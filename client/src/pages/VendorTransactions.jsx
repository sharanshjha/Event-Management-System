import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../services/api';
import './Dashboard.css';

const VendorTransactions = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await vendorApi.getTransactions();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button style={topBtnStyle} onClick={() => navigate('/vendor')}>Home</button>
                <button style={topBtnStyle} onClick={() => navigate('/vendor/products')}>View Product</button>
                <button style={topBtnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '15px 100px', borderRadius: '5px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Transactions
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', padding: '0 50px' }}>
                {orders.map((order, index) => (
                    <div key={order._id} style={{
                        background: '#4a76c5',
                        borderRadius: '10px',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}>
                        Item {index + 1}
                    </div>
                ))}
            </div>
            {orders.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No requests found.</div>
            )}
        </div>
    );
};

const topBtnStyle = {
    background: '#4a76c5',
    color: 'white',
    border: 'none',
    padding: '10px 30px',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default VendorTransactions;
