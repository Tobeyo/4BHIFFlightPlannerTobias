import './ProductCard.css'

function ProductCard({ image, title, price, pieces, onViewDetails, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <h3 className="product-title">{title}</h3>
      <p className="product-meta">{pieces} Teile · {price.toFixed(2)} €</p>
      <div className="product-actions">
        <button className="btn btn-view" onClick={onViewDetails}>
          Details ansehen
        </button>
        <button className="btn btn-add-to-cart" onClick={onAddToCart}>
          In den Warenkorb
        </button>
      </div>
    </div>
  )
}

export default ProductCard

