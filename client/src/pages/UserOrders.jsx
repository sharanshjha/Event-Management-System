import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import './Dashboard.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await userApi.getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '0 20px' }}>
                <button style={btnStyle} onClick={() => navigate('/user')}>Home</button>
                <button style={btnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 100px', borderRadius: '5px', fontSize: '1.2rem' }}>
                    User Order Status
                </div>
            </div>

            <div style={{ padding: '0 20px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>E-mail</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td style={tdStyle}>{order.userId?.name || 'Guest'}</td>
                                <td style={tdStyle}>{order.userId?.email || 'N/A'}</td>
                                <td style={tdStyle}>{order.shippingAddress?.city || 'N/A'}</td>
                                <td style={tdStyle}>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {orders.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No orders found.</div>
            )}
        </div>
    );
};

const btnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '8px 40px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { background: '#4a76c5', color: 'white', padding: '15px', borderRadius: '5px' };
const tdStyle = { background: '#4a76c5', color: 'white', padding: '20px', textAlign: 'center', borderRadius: '5px', opacity: 0.9 };

export default UserOrders;
