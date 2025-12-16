import { useState, useMemo } from 'react'
import Header from './components/Header'
import ProductOverview from './components/ProductOverview'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import './App.css'

const products = [
  {
    id: 1,
    title: 'City Police Station',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop',
    price: 99.99,
    description: 'Großes City-Hauptquartier mit Hubschrauberlandeplatz, Polizeiwagen und vier Minifiguren.',
    pieces: 823,
  },
  {
    id: 2,
    title: 'City Fire Truck',
    image: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=800&h=600&fit=crop',
    price: 49.99,
    description: 'Einsatzbereit mit ausfahrbarer Leiter, Wasserschlauch und mutiger Feuerwehrcrew.',
    pieces: 489,
  },
  {
    id: 3,
    title: 'City Passenger Train',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    price: 149.99,
    description: 'Motorisierter Zug mit Bahnsteig, Schienenoval und integrierter Fernsteuerung.',
    pieces: 1189,
  },
]

function App() {
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = () => {
    setIsCartOpen(true)
    setTimeout(() => {
      document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cartItems],
  )

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    openCart()
  }

  const handleViewDetails = (productId) => {
    const product = products.find((p) => p.id === productId)
    setSelectedProduct(product || null)
  }

  const handleCloseDetails = () => setSelectedProduct(null)

  const handleUpdateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  return (
    <div className="app">
      <Header cartCount={cartCount} onCartClick={openCart} />
      <main>
        <ProductOverview
          products={products}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
        <Cart
          id="cart"
          items={cartItems}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          total={cartTotal}
        />
      </main>
      <ProductDetail
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onClose={handleCloseDetails}
      />
    </div>
  )
}

export default App
