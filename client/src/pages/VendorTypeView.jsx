import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import './Dashboard.css';

const VendorTypeView = () => {
    const { category } = useParams();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadVendors();
    }, [category]);

    const loadVendors = async () => {
        try {
            const data = await userApi.getVendorsByCategory(category);
            if (data && data.length > 0) {
                setVendors(data);
            } else {
                // Fallback dummy data for testing
                setVendors([
                    { _id: '507f191e810c19729de860e1', name: 'Elite ' + category, email: 'elite@test.com' },
                    { _id: '507f191e810c19729de860e2', name: 'Premium ' + category, email: 'premium@test.com' },
                    { _id: '507f191e810c19729de860e3', name: 'Golden ' + category, email: 'golden@test.com' }
                ]);
            }
        } catch (err) {
            console.error('Failed to load vendors, using dummy data');
            setVendors([
                { _id: '507f191e810c19729de860e1', name: 'Elite ' + category, email: 'elite@test.com' },
                { _id: '507f191e810c19729de860e2', name: 'Premium ' + category, email: 'premium@test.com' },
                { _id: '507f191e810c19729de860e3', name: 'Golden ' + category, email: 'golden@test.com' }
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
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 40px', borderRadius: '5px', display: 'flex', gap: '20px', fontSize: '1.2rem' }}>
                    <span>Vendor</span>
                    <span>{category}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', padding: '0 50px' }}>
                {vendors.map((v, index) => (
                    <div key={v._id} style={{
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
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Vendor {index + 1}</div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '5px' }}>{v.name}</div>
                            <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>{v.email}</div>
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
                            onClick={() => navigate(`/user/shop/${v._id}`)}
                        >
                            Shop Item
                        </button>
                    </div>
                ))}
            </div>
            {vendors.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No vendors found for this category.</div>
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

export default VendorTypeView;
