import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../services/api';
import './Dashboard.css';

const VendorProductStatus = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await vendorApi.getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await vendorApi.updateOrderStatus(updatingOrder._id, newStatus.toLowerCase().replace(/ /g, '-'));
            setUpdatingOrder(null);
            loadOrders();
            alert('Status updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            alert('Update failed: ' + err.message);
        }
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 100px', borderRadius: '5px', fontSize: '1.2rem' }}>
                    Product Status
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', padding: '0 20px' }}>
                <button style={btnStyle} onClick={() => navigate('/vendor')}>Home</button>
                <button style={btnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ padding: '0 20px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>E-Mail</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Update</th>
                            <th style={thStyle}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td style={tdStyle}>{order.userId?.name || 'Guest'}</td>
                                <td style={tdStyle}>{order.userId?.email || 'N/A'}</td>
                                <td style={tdStyle}>{order.shippingAddress?.city || 'N/A'}</td>
                                <td style={tdStyle}>{order.status}</td>
                                <td style={tdStyle}>
                                    <button onClick={() => setUpdatingOrder(order)} style={actionBtnStyle}>Update</button>
                                </td>
                                <td style={tdStyle}>
                                    <button style={actionBtnStyle}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status Update Modal (Page 17) */}
            {updatingOrder && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#e0e0e0', padding: '40px', borderRadius: '10px', minWidth: '400px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <button style={btnStyle} onClick={() => setUpdatingOrder(null)}>Home</button>
                            <button style={btnStyle}>LogOut</button>
                        </div>

                        <div style={{ background: '#4a76c5', borderRadius: '20px', padding: '30px', color: 'white' }}>
                            <h2 style={{ marginBottom: '20px' }}>Update</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', maxWidth: '250px', margin: '0 auto' }}>
                                <label style={radioContainerStyle}>
                                    <input type="radio" name="status" value="Received" onChange={e => setNewStatus(e.target.value)} />
                                    <span style={radioLabelStyle}>Received</span>
                                </label>
                                <label style={radioContainerStyle}>
                                    <input type="radio" name="status" value="Ready for Shipping" onChange={e => setNewStatus(e.target.value)} />
                                    <span style={radioLabelStyle}>Ready for Shipping</span>
                                </label>
                                <label style={radioContainerStyle}>
                                    <input type="radio" name="status" value="Out For Delivery" onChange={e => setNewStatus(e.target.value)} />
                                    <span style={radioLabelStyle}>Out For Delivery</span>
                                </label>
                            </div>
                            <button 
                                onClick={handleUpdate}
                                style={{
                                    background: 'white', color: '#4a76c5', border: 'none', 
                                    padding: '8px 40px', borderRadius: '5px', marginTop: '30px', fontWeight: 'bold'
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const btnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { background: '#4a76c5', color: 'white', padding: '15px', borderRadius: '5px' };
const tdStyle = { background: '#4a76c5', color: 'white', padding: '15px', textAlign: 'center', borderRadius: '5px', opacity: 0.9 };
const actionBtnStyle = { background: 'white', border: 'none', padding: '5px 15px', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' };
const radioContainerStyle = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const radioLabelStyle = { background: 'white', padding: '5px 15px', borderRadius: '5px', flex: 1 };

export default VendorProductStatus;
