const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userExists.email,
            subject: 'TaskNova - Email Verification OTP',
            text: `Your verification OTP is: ${otp}\nThis will expire in 10 minutes.`,
          }).catch(e => console.error("Email send error:", e.message));
        } else {
          console.log(`[DEV MODE] Verification OTP for ${userExists.email}: ${otp}`);
        }

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
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Welcome to TaskNova - Verify your email',
          html: `<h2>Welcome to TaskNova!</h2><p>Your verification OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`,
        }).catch(e => console.error("Email send error:", e.message));
      } else {
        console.log(`[DEV MODE] Verification OTP for ${user.email}: ${otp}`);
      }

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

module.exports = { signup, login, getProfile, forgotPassword, resetPassword, verifySignupOtp };
