const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  clothId: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  image: String,
  price: Number,
  days: Number,
  listerLocationUrl: String,
  distanceKm: Number,
  deliveryDays: Number,
  deliveryDate: Date,
  rentalEndDate: Date,
  returnDeliveryDays: Number,
  returnDate: Date,
  availableDate: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  renterLocationUrl: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  checkoutDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
