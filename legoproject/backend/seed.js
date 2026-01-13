const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legoshop');
    console.log('✅ MongoDB verbunden');

    // Bestehende Produkte löschen
    await Product.deleteMany({});
    console.log('🗑️  Bestehende Produkte gelöscht');

    // Neue Produkte einfügen
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} Produkte eingefügt`);

    mongoose.connection.close();
    console.log('✅ Seed abgeschlossen');
  } catch (error) {
    console.error('❌ Seed Fehler:', error);
    process.exit(1);
  }
}

seed();

