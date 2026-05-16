const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  clothIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cloth' }]
}, { timestamps: true });

module.exports = mongoose.model('Favourite', favouriteSchema);
