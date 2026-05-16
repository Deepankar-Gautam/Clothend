const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  type: { type: String, required: true }, // 'change_email', 'change_password', 'forgot_password'
  createdAt: { type: Date, default: Date.now, expires: 600 } // 600 seconds = 10 minutes TTL
});

module.exports = mongoose.model('OTP', otpSchema);
