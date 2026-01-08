import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
                <button className="dashboard-btn" style={{ minWidth: '120px' }} onClick={() => navigate('/admin')}>Home</button>
                <button className="dashboard-btn" style={{ minWidth: '120px' }} onClick={handleLogout}>LogOut</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
                <div className="banner-primary">
                    Welcome Admin
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
                <button 
                    className="dashboard-btn"
                    onClick={() => navigate('/admin/maintenance')}
                >
                    Maintain User
                </button>
                <button 
                    className="dashboard-btn"
                    onClick={() => navigate('/admin/maintenance')}
                >
                    Maintain Vendor
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
