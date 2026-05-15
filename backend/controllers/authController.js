const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Helper: Send Email using Brevo REST API (Bypasses Railway SMTP Block)
const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log(`[DEV MODE] Email to ${toEmail}: ${subject}`);
    return;
  }
  
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'TaskNova',
          email: 'bhorgadeharshit@gmail.com' // Verified Brevo Sender
        },
        to: [
          {
            email: toEmail
          }
        ],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[BREVO ERROR]", data);
    } else {
      console.log(`[BREVO SUCCESS] Email sent to ${toEmail}`);
    }
  } catch (error) {
    console.error("[BREVO FETCH ERROR]", error.message);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Generates OTP)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists but is not verified, we can resend OTP or let them know.
      // For simplicity, we just say it exists, or if not verified, update and resend.
      if (!userExists.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.signupOtp = otp;
        userExists.signupOtpExpire = Date.now() + 10 * 60 * 1000;
        await userExists.save();

        await sendBrevoEmail(
          userExists.email,
          'TaskNova - Email Verification OTP',
          `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
            <h2 style="color:#6d28d9">Welcome back to TaskNova!</h2>
            <p>Your verification code is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6d28d9;padding:16px;background:#f5f3ff;border-radius:8px;text-align:center">${otp}</div>
            <p style="color:#6b7280;font-size:14px;margin-top:16px">This code expires in 10 minutes. Do not share it with anyone.</p>
          </div>`
        );

        return res.status(200).json({ message: 'OTP re-sent to email for verification (Check server console if dev mode)', email, devOtp: otp });
      } else {
        res.status(400);
        throw new Error('User already exists');
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Member',
      isVerified: false,
      signupOtp: otp,
      signupOtpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    if (user) {
      // Send Email
      // Send Email via Brevo API
      await sendBrevoEmail(
        user.email,
        'Welcome to TaskNova - Verify your email',
        `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#6d28d9">Welcome to TaskNova!</h2>
          <p>Your verification code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6d28d9;padding:16px;background:#f5f3ff;border-radius:8px;text-align:center">${otp}</div>
          <p style="color:#6b7280;font-size:14px;margin-top:16px">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>`
      );

      res.status(201).json({ message: 'User registered. Please check email for OTP (or server console).', email: user.email, devOtp: otp });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Verify OTP and log in
// @route   POST /api/auth/verify-signup-otp
// @access  Public
const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.signupOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > user.signupOtpExpire) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark as verified
    user.isVerified = true;
    user.signupOtp = undefined;
    user.signupOtpExpire = undefined;
    await user.save();

    // Return auth token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email before logging in');
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Forgot Password (Dev Mode)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate token (simple for dev mode)
    const resetToken = require('crypto').randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Dev mode: return token directly (in production, email this)
    console.log(`[DEV MODE] Password reset token for ${user.email}: ${resetToken}`);
    res.json({ message: 'Password reset link sent (Check console or devToken)', devToken: resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      if (!(await user.matchPassword(req.body.currentPassword))) {
        res.status(401);
        throw new Error('Current password is incorrect');
      }

      user.password = req.body.newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.preferences = {
        ...user.preferences,
        ...req.body,
      };
      
      await user.save();
      res.json({ message: 'Preferences updated', preferences: user.preferences });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, getProfile, forgotPassword, resetPassword, verifySignupOtp, updateProfile, updatePassword, updatePreferences };
