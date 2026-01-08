import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Watermark from '../components/Watermark';
import './Dashboard.css';

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-simple-container page-shell" style={{ 
            background: '#4a76c5', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="welcome-banner" style={{
                background: '#e0e0e0',
                padding: '20px 100px',
                borderRadius: '5px',
                marginBottom: '50px',
                width: '80%',
                textAlign: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
                <h1 style={{ fontSize: '2rem' }}>Welcome Vendor</h1>
            </div>

            <div className="vendor-actions-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                width: '90%',
                maxWidth: '1000px'
            }}>
                <button 
                    className="pdf-style-btn" 
                    onClick={() => navigate('/vendor/products')}
                    style={btnStyle}
                >
                    Your Item
                </button>
                <button 
                    className="pdf-style-btn" 
                    onClick={() => navigate('/vendor/products')}
                    style={btnStyle}
                >
                    Add New Item
                </button>
                <button 
                    className="pdf-style-btn" 
                    onClick={() => navigate('/vendor/transactions')}
                    style={btnStyle}
                >
                    Transaction
                </button>
                <button 
                    className="pdf-style-btn" 
                    onClick={handleLogout}
                    style={btnStyle}
                >
                    LogOut
                </button>
            </div>
            <div style={{ marginTop: '50px' }}>
                <Watermark />
            </div>
        </div>
    );
};

const btnStyle = {
    background: '#e0e0e0',
    border: 'none',
    padding: '15px 10px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.1s'
};

export default VendorDashboard;
