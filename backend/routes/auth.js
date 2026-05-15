const express = require('express');
const router = express.Router();
const { signup, login, getProfile, forgotPassword, resetPassword, verifySignupOtp, updateProfile, updatePassword, updatePreferences } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');

router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  signup
);

router.post('/verify-signup-otp', verifySignupOtp);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/preferences', protect, updatePreferences);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
