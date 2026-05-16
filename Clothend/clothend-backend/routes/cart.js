const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart ? cart.items : []);
  } catch (err) {
    console.error('Cart get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cart — add item to cart
router.post('/', auth, async (req, res) => {
  try {
    const { clothId, name, image, price, size, type, color, gender, days } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Prevent duplicate items
    const alreadyInCart = cart.items.some(item => item.clothId && item.clothId.toString() === clothId);
    if (alreadyInCart) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    cart.items.push({ clothId, name, image, price, size, type, color, gender, days: days || 1 });
    await cart.save();

    res.json(cart.items);
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/cart/:index — update days for a cart item
router.patch('/:index', auth, async (req, res) => {
  try {
    const { days } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const index = parseInt(req.params.index);
    if (index >= 0 && index < cart.items.length) {
      cart.items[index].days = Math.max(1, parseInt(days) || 1);
      await cart.save();
    }

    res.json(cart.items);
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cart/:index — remove item by index
router.delete('/:index', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json([]);

    const index = parseInt(req.params.index);
    if (index >= 0 && index < cart.items.length) {
      cart.items.splice(index, 1);
      await cart.save();
    }

    res.json(cart.items);
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json([]);
  } catch (err) {
    console.error('Cart clear error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
