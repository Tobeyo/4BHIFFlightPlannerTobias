import './Cart.css'

function Cart({ id, items, isOpen, onClose, onUpdateQuantity, onRemoveItem, total }) {
  const hasItems = items.length > 0

  return (
    <section className={`cart ${isOpen ? 'is-open' : ''}`} id={id}>
      <div className="cart-header">
        <div>
          <p className="cart-label">Warenkorb</p>
          <h2 className="cart-title">Deine Auswahl</h2>
        </div>
        <button className="cart-close" onClick={onClose} aria-label="Warenkorb schließen">
          &times;
        </button>
      </div>

      {hasItems ? (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-thumb">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-header">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <button
                      className="remove-btn"
                      aria-label={`${item.title} entfernen`}
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Entfernen
                    </button>
                  </div>
                  <p className="cart-item-meta">{item.pieces} Teile</p>
                  <p className="cart-item-price">{item.price.toFixed(2)} €</p>
                  <div className="cart-quantity">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        onUpdateQuantity(item.id, Number(event.target.value) || 1)
                      }
                    />
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    <span className="cart-item-subtotal">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Zwischensumme</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>
            <button className="btn-checkout" disabled>
              Zur Kasse (demnächst)
            </button>
          </div>
        </>
      ) : (
        <p className="cart-empty">Der Warenkorb ist leer. Füge Sets hinzu und baue los!</p>
      )}
    </section>
  )
}

export default Cart
