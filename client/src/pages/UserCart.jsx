import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const UserCart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="content-card">
          <div className="empty-state">
            <span style={{ fontSize: '4rem' }}>🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started</p>
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
        <h2>Shopping Cart</h2>
        
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <img
              src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5001${item.image}`) : 'https://via.placeholder.com/80x80?text=No+Image'}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              <p className="cart-item-price">₹{item.price}</p>
            </div>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div style={{ marginLeft: '1rem' }}>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
            <button
              className="action-btn danger"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>₹{getTotal()}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="action-btn danger"
            style={{ flex: 1 }}
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <button
            className="action-btn success"
            style={{ flex: 2 }}
            onClick={() => navigate('/user/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCart;
