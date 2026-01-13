import ProductCard from './ProductCard'
import './ProductOverview.css'

// Einfacher Ersatz für Array.map, iteriert manuell über die Items
function customMap(list, iterator) {
  const results = []
  for (let index = 0; index < list.length; index += 1) {
    results.push(iterator(list[index], index))
  }
  return results
}

function ProductOverview({ products, onAddToCart, onViewDetails }) {
  return (
    <section className="product-overview" id="products">
      <h2 className="overview-title">Produkte</h2>
      <div className="product-grid">
        {customMap(products, (product) => (
          <ProductCard
            key={product._id}
            image={product.image}
            title={product.title}
            price={product.price}
            pieces={product.pieces}
            onViewDetails={() => onViewDetails(product._id)}
            onAddToCart={() => onAddToCart(product._id)}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductOverview
