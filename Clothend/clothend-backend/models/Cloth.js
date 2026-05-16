const mongoose = require('mongoose');

const clothSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String },
  gender: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
  availableDate: { type: Date, default: null },
  locationUrl: { type: String, required: true },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Cloth', clothSchema);
