import './ProductDetail.css'

function ProductDetail({ product, onAddToCart, onClose }) {
  if (!product) return null

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
        <button className="detail-close" aria-label="Detail schließen" onClick={onClose}>
          &times;
        </button>
        <div className="detail-media">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="detail-body">
          <p className="detail-label">Set</p>
          <h3 className="detail-title">{product.title}</h3>
          <p className="detail-price">{product.price.toFixed(2)} €</p>
          <p className="detail-description">{product.description}</p>
          <p className="detail-meta">{product.pieces} Teile</p>
          <div className="detail-actions">
            <button
              className="btn btn-primary"
              onClick={() => onAddToCart(product.id)}
            >
              In den Warenkorb
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
