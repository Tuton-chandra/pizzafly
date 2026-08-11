import { useState } from 'react';

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery' },
  { id: 'mobile', label: 'Mobile Banking' },
  { id: 'card', label: 'Card' },
];

function Checkout({ isOpen, onClose, total, order, onPlaceOrder, onTrackOrder, defaultAddress }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: defaultAddress || '',
    apartment: '',
    instructions: '',
    payment: 'cod',
  });

  if (!isOpen) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Keep the checkout address aligned with the latest address selected on the tracking section.
  // The form only adopts the new default while the user has not typed a custom address.
  const currentAddress = form.address || defaultAddress || '';


  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder(form);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <div className="overlay overlay--visible" onClick={handleClose} aria-hidden="true"></div>

      <div className="modal modal--checkout" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={handleClose} aria-label="Close checkout">
          ✕
        </button>

        {order ? (
          <div className="order-success">
            <div className="order-success__icon">🎉</div>
            <h3>Order Confirmed!</h3>
            <p>Your pizza is being prepared.</p>

            <div className="order-success__details">
              <div>
                <span>Order ID</span>
                <strong>{order.id}</strong>
              </div>
              <div>
                <span>Estimated delivery</span>
                <strong>{order.eta} minutes</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>৳{order.total}</strong>
              </div>
              <div>
                <span>Payment</span>
                <strong>{order.payment === 'cod' ? 'Cash on Delivery' : order.payment === 'mobile' ? 'Mobile Banking' : 'Card'}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                onTrackOrder();
                handleClose();
              }}
            >
              Track My Drone
            </button>
          </div>
        ) : (
          <>
            <h3 className="modal__title">Checkout</h3>
            <p className="modal__subtitle">Tell us where to land your pizza.</p>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>
                Full Name
                <input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="01XXXXXXXXX"
                />
              </label>

              <label>
                Delivery Address
                <input
                  type="text"
                  required
                  value={currentAddress}
                  onChange={update('address')}
                  placeholder="Street, area, city"
                />
              </label>

              <label>
                Apartment / House
                <input
                  type="text"
                  value={form.apartment}
                  onChange={update('apartment')}
                  placeholder="Apartment or house number (optional)"
                />
              </label>

              <label>
                Delivery Instructions
                <textarea
                  rows="2"
                  value={form.instructions}
                  onChange={update('instructions')}
                  placeholder="Landing spot, gate code, etc. (optional)"
                ></textarea>
              </label>

              <fieldset className="payment-methods">
                <legend>Payment Method</legend>
                {paymentMethods.map((method) => (
                  <label key={method.id} className="payment-methods__option">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={form.payment === method.id}
                      onChange={update('payment')}
                    />
                    {method.label}
                  </label>
                ))}
              </fieldset>

              <div className="checkout-form__total">
                <span>Total to pay</span>
                <strong>৳{total}</strong>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Place Order
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default Checkout;
