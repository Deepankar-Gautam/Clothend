const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Cloth = require('../models/Cloth');
const auth = require('../middleware/auth');
const { extractCoordinates } = require('../utils/distance');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadsDir); },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/listings — create listing with Google Maps locationUrl
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, gender, type, size, price, description, color, locationUrl } = req.body;

    if (!name || !gender || !type || !size || !price) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    
    if (!locationUrl) {
      return res.status(400).json({ message: 'Please provide a Google Maps location link' });
    }

    // Validate link immediately
    const coords = await extractCoordinates(locationUrl);
    if (!coords) {
      return res.status(400).json({ message: 'Invalid Google Maps link. Could not extract location.' });
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : `https://picsum.photos/seed/${Date.now()}/300/400`;

    const cloth = await Cloth.create({
      name, type,
      color: color || 'Custom',
      gender, size,
      price: Number(price),
      image,
      description: description || '',
      listedBy: req.user.id,
      locationUrl
    });

    res.status(201).json(cloth);
  } catch (err) {
    console.error('Listing error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
