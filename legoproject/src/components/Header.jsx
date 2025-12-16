import './Header.css'

function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <div className="lego-logo">LEGO</div>
          <h1 className="store-title">store</h1>
        </div>
        <nav className="header-nav">
          <a href="#products" className="nav-link">Produkte</a>
          <button className="cart-link" onClick={onCartClick}>
            🛒<span className="cart-count">{cartCount}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
