import { useState, useMemo, useEffect } from 'react'
import Header from './components/Header'
import ProductOverview from './components/ProductOverview'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import { productService, cartService } from './services/api'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Produkte und Warenkorb beim Start laden
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [productsData, cartData] = await Promise.all([
          productService.getAll(),
          cartService.getCart()
        ])
        setProducts(productsData)
        // Cart Items mit Produktdaten mappen
        const items = cartData.items?.map(item => ({
          id: item.product._id,
          title: item.product.title,
          image: item.product.image,
          price: item.product.price,
          pieces: item.product.pieces,
          quantity: item.quantity
        })) || []
        setCartItems(items)
      } catch (err) {
        setError(err.message)
        console.error('Fehler beim Laden:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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

  const handleAddToCart = async (productId) => {
    const product = products.find((p) => p._id === productId)
    if (!product) return

    try {
      const cartData = await cartService.addItem(productId)
      const items = cartData.items?.map(item => ({
        id: item.product._id,
        title: item.product.title,
        image: item.product.image,
        price: item.product.price,
        pieces: item.product.pieces,
        quantity: item.quantity
      })) || []
      setCartItems(items)
      openCart()
    } catch (err) {
      console.error('Fehler beim Hinzufügen:', err)
    }
  }

  const handleViewDetails = (productId) => {
    const product = products.find((p) => p._id === productId)
    setSelectedProduct(product || null)
  }

  const handleCloseDetails = () => setSelectedProduct(null)

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId)
      return
    }

    try {
      const cartData = await cartService.updateQuantity(productId, quantity)
      const items = cartData.items?.map(item => ({
        id: item.product._id,
        title: item.product.title,
        image: item.product.image,
        price: item.product.price,
        pieces: item.product.pieces,
        quantity: item.quantity
      })) || []
      setCartItems(items)
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err)
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      const cartData = await cartService.removeItem(productId)
      const items = cartData.items?.map(item => ({
        id: item.product._id,
        title: item.product.title,
        image: item.product.image,
        price: item.product.price,
        pieces: item.product.pieces,
        quantity: item.quantity
      })) || []
      setCartItems(items)
    } catch (err) {
      console.error('Fehler beim Entfernen:', err)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Header cartCount={0} onCartClick={() => {}} />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Produkte werden geladen...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header cartCount={0} onCartClick={() => {}} />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'red' }}>Fehler: {error}</p>
          <p>Stelle sicher, dass das Backend läuft (npm run dev im backend Ordner)</p>
        </main>
      </div>
    )
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
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onClose={handleCloseDetails}
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
    </div>
  )
}

export default App
