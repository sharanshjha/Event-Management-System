import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const VendorItemsView = () => {
    const { vendorId } = useParams();
    const [products, setProducts] = useState([]);
    const [vendorName, setVendorName] = useState('Vendor Name');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [vendorId]);

    const loadData = async () => {
        try {
            const data = await userApi.getVendorProducts(vendorId);
            if (data && data.length > 0) {
                setProducts(data);
                if (data[0].vendorId && typeof data[0].vendorId === 'object') {
                    setVendorName(data[0].vendorId.name);
                }
            } else {
                // Fallback dummy products
                setProducts([
                    { _id: '507f1f77bcf86cd799439011', name: 'Premium Service Pack', price: 25000, description: 'Best in class' },
                    { _id: '507f1f77bcf86cd799439012', name: 'Standard Service Pack', price: 15000, description: 'Economical choice' },
                    { _id: '507f1f77bcf86cd799439013', name: 'Elite Add-on', price: 5000, description: 'Extra features' }
                ]);
            }
        } catch (err) {
            console.error('Failed to load products, using dummy data');
            setProducts([
                { _id: '507f1f77bcf86cd799439011', name: 'Premium Service Pack', price: 25000, description: 'Best in class' },
                { _id: '507f1f77bcf86cd799439012', name: 'Standard Service Pack', price: 15000, description: 'Economical choice' },
                { _id: '507f1f77bcf86cd799439013', name: 'Elite Add-on', price: 5000, description: 'Extra features' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button style={topBtnStyle} onClick={() => navigate('/user')}>Home</button>
                <button style={topBtnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 40px', borderRadius: '5px', fontSize: '1.2rem' }}>
                    {vendorName}
                </div>
            </div>

            <div style={{ padding: '0 50px' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '8px 25px', borderRadius: '5px', width: 'fit-content', marginBottom: '20px' }}>
                    Products
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
                    {products.map((p, index) => (
                        <div key={p._id} style={{
                            background: '#4a76c5',
                            borderRadius: '20px',
                            padding: '30px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: 'white',
                            gap: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Product {index + 1}</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '5px' }}>{p.name}</div>
                                <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Price: Rs/-{p.price}</div>
                            </div>
                            <button 
                                style={{
                                    background: 'white',
                                    color: '#4a76c5',
                                    border: 'none',
                                    padding: '8px 25px',
                                    borderRadius: '5px',
                                    marginTop: '10px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                onClick={() => addToCart(p)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {products.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>This vendor has no items listed.</div>
            )}
        </div>
    );
};

const topBtnStyle = {
    background: 'white',
    border: '2px solid #a2c4c9',
    padding: '8px 30px',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default VendorItemsView;
