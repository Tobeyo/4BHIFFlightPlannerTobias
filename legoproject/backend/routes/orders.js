const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET alle Bestellungen eines Benutzers
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET einzelne Bestellung
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'email firstName lastName')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST neue Bestellung aus Warenkorb erstellen
router.post('/', async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    // Warenkorb des Benutzers laden
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Warenkorb ist leer' });
    }

    // Bestellpositionen und Gesamtsumme berechnen
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    }));

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Bestellung erstellen
    const order = new Order({
      user: userId,
      items: orderItems,
      total,
      shippingAddress,
      status: 'pending'
    });

    const newOrder = await order.save();

    // Warenkorb leeren
    cart.items = [];
    await cart.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT Bestellstatus aktualisieren
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Bestellung stornieren
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        message: 'Nur ausstehende Bestellungen können storniert werden'
      });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Bestellung storniert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

