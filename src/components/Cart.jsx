function Cart({
  isOpen,
  onClose,
  items,
  onIncrease,
  onDecrease,
  onRemove,
  subtotal,
  deliveryFee,
  total,
  onCheckout,
}) {
  return (
    <>
      <div
        className={`overlay ${isOpen ? 'overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h3>Your Cart</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <span>🍕</span>
            <p>Your cart is empty.</p>
            <p className="cart-drawer__empty-sub">Add a pizza to get it flying to you.</p>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">৳{item.price}</p>
                    <div className="cart-item__qty">
                      <button onClick={() => onDecrease(item.id)} aria-label={`Decrease ${item.name} quantity`}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => onIncrease(item.id)} aria-label={`Increase ${item.name} quantity`}>
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__summary">
              <div className="cart-drawer__row">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="cart-drawer__row">
                <span>Delivery Fee</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div className="cart-drawer__row cart-drawer__row--total">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
              <button className="btn btn-primary btn-block" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default Cart;
