const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

// Routes importieren
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Produkte für initialen Seed
const initialProducts = [
  {
    title: 'City Police Station',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop',
    price: 99.99,
    description: 'Großes City-Hauptquartier mit Hubschrauberlandeplatz, Polizeiwagen und vier Minifiguren.',
    pieces: 823,
    category: 'City',
    stock: 50
  },
  {
    title: 'City Fire Truck',
    image: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=800&h=600&fit=crop',
    price: 49.99,
    description: 'Einsatzbereit mit ausfahrbarer Leiter, Wasserschlauch und mutiger Feuerwehrcrew.',
    pieces: 489,
    category: 'City',
    stock: 75
  },
  {
    title: 'City Passenger Train',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    price: 149.99,
    description: 'Motorisierter Zug mit Bahnsteig, Schienenoval und integrierter Fernsteuerung.',
    pieces: 1189,
    category: 'City',
    stock: 30
  }
];

async function startServer() {
  try {
    // In-Memory MongoDB starten
    console.log('🔄 Starte In-Memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB verbunden (In-Memory)');

    // Initial Seed
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(initialProducts);
      console.log('✅ Initiale Produkte eingefügt');
    }

    // API Routes
    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/cart', cartRoutes);

    // Health Check Route
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', message: 'Server läuft' });
    });

    // Error Handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Ein Fehler ist aufgetreten' });
    });

    // Server starten
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf Port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server Start Fehler:', error);
    process.exit(1);
  }
}

startServer();

