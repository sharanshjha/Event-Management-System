import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const UserCart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
                <button style={topBtnStyle} onClick={() => navigate('/user')}>Home</button>
                <button style={topBtnStyle} onClick={() => navigate('/user/vendor/Catering')}>View Product</button>
                <button style={topBtnStyle}>Request Item</button>
                <button style={topBtnStyle} onClick={() => navigate('/user/order-status')}>Product Status</button>
                <button style={topBtnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ background: '#c5d9f1', border: '1px solid #4a76c5', padding: '10px 100px', color: '#4a76c5', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Shopping Cart
                </div>
            </div>

            <div style={{ padding: '0 50px' }}>
                <div style={{ background: '#d0d0d0', padding: '20px', borderRadius: '5px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Quantity</th>
                                <th style={thStyle}>Total Price</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item._id}>
                                    <td style={tdStyle}>
                                        <div style={{ width: '80px', height: '80px', background: '#4a76c5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'Image'}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{item.name}</td>
                                    <td style={tdStyle}>{item.price}/-</td>
                                    <td style={tdStyle}>
                                        <select 
                                            value={item.quantity} 
                                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                            style={{ padding: '5px', background: 'white', border: '1px solid #4a76c5', borderRadius: '4px', color: '#333' }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={tdStyle}>{item.price * item.quantity}/-</td>
                                    <td style={tdStyle}>
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ background: '#4a76c5', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', background: '#4a76c5', color: 'white', padding: '15px', marginTop: '20px', borderRadius: '5px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>Grand Total {getTotal()}/-</div>
                        <button 
                            onClick={clearCart}
                            style={{ background: 'white', color: '#333', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Delete All
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <button 
                        onClick={() => navigate('/user/checkout')}
                        style={{
                            background: 'white',
                            color: '#333',
                            border: '1px solid #4a76c5',
                            padding: '12px 60px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Proceed to CheckOut
                    </button>
                </div>
            </div>
        </div>
    );
};

const topBtnStyle = {
    background: 'white',
    border: '1px solid #4a76c5',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#333'
};

const thStyle = { background: '#4a76c5', color: 'white', padding: '15px', borderRadius: '10px' };
const tdStyle = { background: '#f5f5f5', padding: '15px', textAlign: 'center', borderRadius: '10px' };

export default UserCart;
