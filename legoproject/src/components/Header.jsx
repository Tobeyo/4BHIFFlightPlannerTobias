import './Header.css';

function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <div className="lego-logo">LEGO</div>
          <h1 className="store-title">store</h1>
        </div>
        <nav className="header-nav">
          <a href="#products" className="nav-link">Produkte</a>
          <a href="#cart" className="cart-link">
            🛒<span className="cart-count">{cartCount}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
