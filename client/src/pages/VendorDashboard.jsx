import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
            <div className="banner-primary" style={{ marginBottom: '50px', width: '80%' }}>
                <h1 style={{ fontSize: '2rem', color: 'inherit' }}>Welcome Vendor</h1>
            </div>

            <div className="vendor-actions-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                width: '90%',
                maxWidth: '1000px'
            }}>
                <button 
                    className="dashboard-btn" 
                    onClick={() => navigate('/vendor/products')}
                >
                    Your Item
                </button>
                <button 
                    className="dashboard-btn" 
                    onClick={() => navigate('/vendor/products')}
                >
                    Add New Item
                </button>
                <button 
                    className="dashboard-btn" 
                    onClick={() => navigate('/vendor/transactions')}
                >
                    Transaction
                </button>
                <button 
                    className="dashboard-btn" 
                    onClick={handleLogout}
                >
                    LogOut
                </button>
            </div>
        </div>
    );
};

export default VendorDashboard;
