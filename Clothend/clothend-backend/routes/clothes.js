const express = require('express');
const router = express.Router();
const Cloth = require('../models/Cloth');
const auth = require('../middleware/auth');

// GET /api/clothes — public, auto-restores availability for expired cooldowns
router.get('/', async (req, res) => {
  try {
    // Auto-restore items whose cooldown period has ended
    await Cloth.updateMany(
      { available: false, availableDate: { $ne: null, $lte: new Date() } },
      { $set: { available: true, availableDate: null } }
    );

    const clothes = await Cloth.find().sort({ createdAt: -1 });
    res.json(clothes);
  } catch (err) {
    console.error('Clothes fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/clothes/:id/available — admin reset availability
router.patch('/:id/available', auth, async (req, res) => {
  try {
    const { available } = req.body;
    const cloth = await Cloth.findByIdAndUpdate(
      req.params.id,
      { available: available, availableDate: null },
      { new: true }
    );
    if (!cloth) return res.status(404).json({ message: 'Cloth not found' });
    res.json(cloth);
  } catch (err) {
    console.error('Availability update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
