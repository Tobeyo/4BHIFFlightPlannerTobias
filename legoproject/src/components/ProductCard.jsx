import './ProductCard.css';

function ProductCard({ image, title, onViewDetails, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <h3 className="product-title">{title}</h3>
      <div className="product-actions">
        <button className="btn btn-view" onClick={onViewDetails}>
          View Details
        </button>
        <button className="btn btn-add-to-cart" onClick={onAddToCart}>
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

