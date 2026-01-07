import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { userApi } from '../services/api';
import './Dashboard.css';

const UserCheckout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        paymentMethod,
        guestName: guestName || undefined,
        guestEmail: guestEmail || undefined
      };

      await userApi.placeOrder(orderData);
      clearCart();
      navigate('/user/orders');
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="content-card">
          <div className="empty-state">
            <span style={{ fontSize: '4rem' }}>🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add products before checking out</p>
            <button
              className="action-btn primary"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/user/products')}
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="content-card">
        <h2>Checkout</h2>

        {error && <div className="alert error">{error}</div>}

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Order Summary</h3>
          {cart.map(item => (
            <div key={item._id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.5rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '1rem 0',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: '#43e97b'
          }}>
            <span>Total:</span>
            <span>₹{getTotal()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="cash">Cash on Delivery</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div className="form-group">
            <label>Guest Name (Optional)</label>
            <input
              type="text"
              placeholder="Enter name if ordering as guest"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Guest Email (Optional)</label>
            <input
              type="email"
              placeholder="Enter email for order updates"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className="action-btn danger"
              onClick={() => navigate('/user/cart')}
              style={{ flex: 1 }}
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="submit-btn"
              style={{ flex: 2 }}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCheckout;
