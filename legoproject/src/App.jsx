import { useState } from 'react'
import Header from './components/Header'
import ProductOverview from './components/ProductOverview'
import './App.css'

function App() {
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = () => {
    setCartCount(cartCount + 1)
  }

  return (
    <div className="app">
      <Header cartCount={cartCount} />
      <ProductOverview onAddToCart={handleAddToCart} />
    </div>
  )
}

export default App
