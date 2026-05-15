const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member',
  },
  avatar: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  signupOtp: String,
  signupOtpExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  preferences: {
    taskAssigned: { type: Boolean, default: true },
    deadlineReminders: { type: Boolean, default: true },
    projectUpdates: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
