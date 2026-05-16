const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  clothId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cloth' },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  size: { type: String },
  type: { type: String },
  color: { type: String },
  gender: { type: String },
  days: { type: Number, default: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
