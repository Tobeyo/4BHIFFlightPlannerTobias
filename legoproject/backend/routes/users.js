const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET alle Benutzer
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET einzelner Benutzer
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST neuen Benutzer registrieren
router.post('/register', async (req, res) => {
  try {
    // Prüfen ob E-Mail bereits existiert
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-Mail bereits registriert' });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password, // In Produktion: hashen mit bcrypt
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address
    });

    const newUser = await user.save();
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST Benutzer Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // In Produktion: Passwort mit bcrypt vergleichen
    if (user.password !== req.body.password) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT Benutzer aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.address) user.address = req.body.address;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      address: updatedUser.address
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Benutzer löschen
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    await user.deleteOne();
    res.json({ message: 'Benutzer gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

