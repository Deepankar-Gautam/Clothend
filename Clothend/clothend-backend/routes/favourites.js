const express = require('express');
const router = express.Router();
const Favourite = require('../models/Favourite');
const auth = require('../middleware/auth');

// GET /api/favourites — get user's favourite cloth IDs
router.get('/', auth, async (req, res) => {
  try {
    const fav = await Favourite.findOne({ userId: req.user.id });
    res.json(fav ? fav.clothIds : []);
  } catch (err) {
    console.error('Favs get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/favourites — toggle a cloth in favourites
router.post('/', auth, async (req, res) => {
  try {
    const { clothId } = req.body;

    let fav = await Favourite.findOne({ userId: req.user.id });
    if (!fav) {
      fav = new Favourite({ userId: req.user.id, clothIds: [] });
    }

    const idx = fav.clothIds.findIndex(id => id.toString() === clothId);
    let action;

    if (idx > -1) {
      fav.clothIds.splice(idx, 1);
      action = 'removed';
    } else {
      fav.clothIds.push(clothId);
      action = 'added';
    }

    await fav.save();
    res.json({ clothIds: fav.clothIds, action });
  } catch (err) {
    console.error('Favs toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
