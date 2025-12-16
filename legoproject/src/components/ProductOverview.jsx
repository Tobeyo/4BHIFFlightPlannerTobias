import ProductCard from './ProductCard';
import './ProductOverview.css';

function ProductOverview({ onAddToCart }) {
  const products = [
    {
      id: 1,
      title: 'City Police Station',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'City Fire Truck',
      image: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'City Passenger Train',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    }
  ];

  const handleViewDetails = (productId) => {
    console.log('View details for product:', productId);
  };

  return (
    <section className="product-overview">
      <h2 className="overview-title">Product Overview</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            onViewDetails={() => handleViewDetails(product.id)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductOverview;
