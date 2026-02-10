const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET Warenkorb eines Benutzers
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.product');

    if (!cart) {
      // Leeren Warenkorb erstellen wenn keiner existiert
      cart = new Cart({ user: req.params.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Produkt zum Warenkorb hinzufügen
router.post('/:userId/items', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Produkt prüfen
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    // Warenkorb finden oder erstellen
    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
    }

    // Prüfen ob Produkt bereits im Warenkorb
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Mit Produktdaten zurückgeben
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT Menge eines Produkts im Warenkorb aktualisieren
router.put('/:userId/items/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
    }

    const item = cart.items.find(
      item => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Produkt nicht im Warenkorb' });
    }

    if (quantity <= 0) {
      // Produkt entfernen wenn Menge 0 oder weniger
      cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Produkt aus Warenkorb entfernen
router.delete('/:userId/items/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE Warenkorb komplett leeren
router.delete('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Warenkorb geleert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

