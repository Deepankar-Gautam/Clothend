const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Cloth = require('../models/Cloth');
const auth = require('../middleware/auth');
const { calculateDistance, getDeliveryDays, addDays, extractCoordinates } = require('../utils/distance');

// GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Orders get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/orders — checkout with Google Maps URLs
router.post('/', auth, async (req, res) => {
  try {
    const { renterLocationUrl } = req.body;

    if (!renterLocationUrl) {
      return res.status(400).json({ message: 'Please provide your Google Maps delivery link' });
    }

    const renterCoords = await extractCoordinates(renterLocationUrl);
    if (!renterCoords) {
      return res.status(400).json({ message: 'Invalid Google Maps link. Could not extract delivery location.' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const now = new Date();
    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const cloth = await Cloth.findById(item.clothId);
      
      let distanceKm = 0;
      let listerLocationUrl = '';

      if (cloth && cloth.locationUrl) {
        listerLocationUrl = cloth.locationUrl;
        const listerCoords = await extractCoordinates(listerLocationUrl);
        if (listerCoords) {
           distanceKm = calculateDistance(listerCoords.lat, listerCoords.lng, renterCoords.lat, renterCoords.lng);
        }
      }

      const deliveryDays = getDeliveryDays(distanceKm);
      const deliveryDate = addDays(now, deliveryDays);
      const rentalEndDate = addDays(deliveryDate, item.days);
      const returnDeliveryDays = getDeliveryDays(distanceKm); // same distance back
      const returnDate = addDays(rentalEndDate, returnDeliveryDays);
      const availableDate = addDays(returnDate, 1); // +1 day for washing/drying

      const subtotal = item.price * item.days;
      total += subtotal;

      orderItems.push({
        clothId: item.clothId,
        name: item.name,
        image: item.image,
        price: item.price,
        days: item.days,
        listerLocationUrl,
        distanceKm,
        deliveryDays,
        deliveryDate,
        rentalEndDate,
        returnDeliveryDays,
        returnDate,
        availableDate
      });

      if (cloth) {
        cloth.available = false;
        cloth.availableDate = availableDate;
        await cloth.save();
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      renterLocationUrl,
      items: orderItems,
      total,
      checkoutDate: now
    });

    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json(order);
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
