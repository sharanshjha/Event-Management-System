import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const UserDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showVendorDropdown, setShowVendorDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
                <div className="banner-primary">
                    WELCOME USER
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                <div style={{ position: 'relative' }}>
                    <button 
                        className="dashboard-btn" 
                        onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                    >
                        Vendor
                    </button>
                    {showVendorDropdown && (
                        <div style={{ 
                            position: 'absolute', 
                            top: '110%', 
                            left: 0, 
                            background: 'var(--bg-secondary)', 
                            border: '1px solid #4a76c5', 
                            borderRadius: '5px',
                            display: 'flex', 
                            flexDirection: 'column', 
                            minWidth: '150px', 
                            zIndex: 10,
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            {['Catering', 'Florist', 'Decoration', 'Lighting'].map(cat => (
                                <button 
                                    key={cat}
                                    style={{
                                        padding: '12px 15px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '0.9rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        width: '100%',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    onClick={() => navigate(`/user/vendor/${cat}`)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button className="dashboard-btn" onClick={() => navigate('/user/cart')}>Cart</button>
                <button className="dashboard-btn" onClick={() => navigate('/user/guest-list')}>Guest List</button>
                <button className="dashboard-btn" onClick={() => navigate('/user/order-status')}>Order Status</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                    onClick={handleLogout}
                    style={{
                        background: '#4a76c5',
                        color: 'white',
                        border: 'none',
                        padding: '10px 60px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginTop: '20px'
                    }}
                >
                    LogOut
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
