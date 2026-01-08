import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Watermark from '../components/Watermark';
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
                <div className="card-container" style={{ background: '#4a76c5', color: 'white', padding: '10px 80px', borderRadius: '5px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    WELCOME USER
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                <div style={{ position: 'relative' }}>
                    <button 
                        style={btnStyle} 
                        onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                    >
                        Vendor
                    </button>
                    {showVendorDropdown && (
                        <div style={{ 
                            position: 'absolute', 
                            top: '110%', 
                            left: 0, 
                            background: 'white', 
                            border: '1px solid #4a76c5', 
                            borderRadius: '5px',
                            display: 'flex', 
                            flexDirection: 'column', 
                            minWidth: '150px', 
                            zIndex: 10,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}>
                            {['Catering', 'Florist', 'Decoration', 'Lighting'].map(cat => (
                                <button 
                                    key={cat}
                                    style={dropdownItemStyle}
                                    onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                    onClick={() => navigate(`/user/vendor/${cat}`)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button style={btnStyle} onClick={() => navigate('/user/cart')}>Cart</button>
                <button style={btnStyle} onClick={() => navigate('/user/guest-list')}>Guest List</button>
                <button style={btnStyle} onClick={() => navigate('/user/order-status')}>Order Status</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={logOutBtnStyle} onClick={handleLogout}>LogOut</button>
            </div>
            <div style={{ marginTop: '80px' }}>
                <Watermark />
            </div>
        </div>
    );
};

const btnStyle = {
    background: 'white',
    border: '2px solid #a2c4c9',
    padding: '12px 40px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    minWidth: '160px',
    fontWeight: '500'
};

const dropdownItemStyle = {
    padding: '12px 15px',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: '1px solid #eee',
    width: '100%',
    transition: 'background 0.2s'
};

const logOutBtnStyle = {
    background: '#4a76c5',
    color: 'white',
    border: 'none',
    padding: '10px 60px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '20px'
};

export default UserDashboard;
