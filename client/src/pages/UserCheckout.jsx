import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { userApi } from '../services/api';
import './Dashboard.css';

const UserCheckout = () => {
    const { cart, getTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        email: '',
        paymentMethod: 'Cash',
        address: '',
        state: '',
        city: '',
        pinCode: ''
    });

    const handleNumberChange = (e) => {
        const val = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (val.length <= 10) { // Limit to 10 digits
            setFormData({ ...formData, number: val });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Robust Validation Logic
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pinRegex = /^[0-9]{6}$/;

        if (formData.name.trim().length < 3) {
            return alert('Name must be at least 3 characters long');
        }

        // Check for repetitive digits (e.g., 9999999999)
        const isRepetitive = /^(.)\1{9}$/.test(formData.number);
        if (isRepetitive) {
            return alert('Please enter a valid phone number (repetitive digits NOT allowed)');
        }

        if (!phoneRegex.test(formData.number)) {
            return alert('Please enter a valid 10-digit phone number');
        }
        if (!emailRegex.test(formData.email)) {
            return alert('Please enter a valid email address');
        }
        if (!pinRegex.test(formData.pinCode)) {
            return alert('Please enter a valid 6-digit pin code');
        }
        if (formData.address.trim().length < 5) {
            return alert('Please enter a complete address');
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                paymentMethod: formData.paymentMethod.toLowerCase(),
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.pinCode,
                    country: 'India'
                },
                guestName: formData.name,
                guestEmail: formData.email
            };

            const order = await userApi.placeOrder(orderData);
            clearCart();
            navigate('/user/order-success', { state: { order, details: formData } });
        } catch (err) {
            alert('Order failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 40px', borderRadius: '5px', display: 'flex', gap: '30px', fontSize: '1.2rem' }}>
                    <span>Item</span>
                    <span>Grand Total</span>
                    <span>{getTotal()}/-</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 50px', borderRadius: '5px' }}>
                    Details
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 60px' }}>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>Name</div>
                        <input required className="form-input" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>Number</div>
                        <input 
                            required 
                            className="form-input"
                            style={inputStyle} 
                            value={formData.number} 
                            onChange={handleNumberChange} 
                            placeholder="10-digit number"
                        />
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>E-mail</div>
                        <input required className="form-input" type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>Payment Method</div>
                        <select className="form-input" style={inputStyle} value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>Address</div>
                        <input required className="form-input" style={inputStyle} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>State</div>
                        <input required className="form-input" style={inputStyle} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>City</div>
                        <input required className="form-input" style={inputStyle} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div style={inputContainerStyle}>
                        <div style={labelStyle}>Pin Code</div>
                        <input 
                            required 
                            className="form-input"
                            style={inputStyle} 
                            value={formData.pinCode} 
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 6) setFormData({...formData, pinCode: val});
                            }} 
                            placeholder="6-digit pin"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            background: '#4a76c5',
                            color: 'white',
                            padding: '12px 60px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Processing...' : 'Order Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const inputContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' };
const labelStyle = { 
    background: '#4a76c5', 
    color: 'white', 
    padding: '8px 40px', 
    borderRadius: '10px', 
    width: '180px', 
    textAlign: 'center',
    marginBottom: '5px'
};
const inputStyle = {
    width: '250px',
    height: '40px',
    border: '2px solid #4a76c5',
    borderRadius: '10px',
    padding: '0 10px'
};

export default UserCheckout;


