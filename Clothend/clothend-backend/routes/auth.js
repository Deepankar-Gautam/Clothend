const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me — get current user from token
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/email');

// Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/otp/change-email
router.post('/otp/change-email', auth, async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: 'New email is required' });
    
    // Check if new email is already in use
    const existing = await User.findOne({ email: newEmail.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.findById(req.user.id);
    const otp = generateOTP();
    
    await OTP.create({ email: user.email, otp, type: 'change_email' });
    await sendEmail(user.email, 'Clothend - Email Change OTP', `Your OTP to change your email is: ${otp}. It will expire in 10 minutes.`);
    
    res.json({ message: 'OTP sent to current email' });
  } catch (err) {
    console.error('OTP change-email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/verify-change-email
router.post('/verify-change-email', auth, async (req, res) => {
  try {
    const { otp, newEmail } = req.body;
    if (!otp || !newEmail) return res.status(400).json({ message: 'OTP and new email required' });

    const user = await User.findById(req.user.id);
    
    const validOTP = await OTP.findOne({ email: user.email, otp, type: 'change_email' });
    if (!validOTP) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.email = newEmail.toLowerCase();
    await user.save();
    await OTP.deleteOne({ _id: validOTP._id });

    // Issue new token with new email
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Email updated successfully', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Verify change-email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/otp/change-password
router.post('/otp/change-password', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otp = generateOTP();
    
    await OTP.create({ email: user.email, otp, type: 'change_password' });
    await sendEmail(user.email, 'Clothend - Password Change OTP', `Your OTP to change your password is: ${otp}. It will expire in 10 minutes.`);
    
    res.json({ message: 'OTP sent to current email' });
  } catch (err) {
    console.error('OTP change-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/verify-change-password
router.post('/verify-change-password', auth, async (req, res) => {
  try {
    const { otp, currentPassword, newPassword } = req.body;
    if (!otp || !currentPassword || !newPassword) return res.status(400).json({ message: 'All fields required' });

    const user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const validOTP = await OTP.findOne({ email: user.email, otp, type: 'change_password' });
    if (!validOTP) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    await OTP.deleteOne({ _id: validOTP._id });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Verify change-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/otp/forgot-password
router.post('/otp/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = generateOTP();
    await OTP.create({ email: user.email, otp, type: 'forgot_password' });
    await sendEmail(user.email, 'Clothend - Forgot Password OTP', `Your OTP to reset your password is: ${otp}. It will expire in 10 minutes.`);

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('OTP forgot-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validOTP = await OTP.findOne({ email: user.email, otp, type: 'forgot_password' });
    if (!validOTP) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    await OTP.deleteOne({ _id: validOTP._id });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Password reset successfully', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
