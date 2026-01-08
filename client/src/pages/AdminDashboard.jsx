import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Watermark from '../components/Watermark';
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
                <button style={btnStyle} onClick={() => navigate('/admin')}>Home</button>
                <button style={btnStyle} onClick={handleLogout}>LogOut</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
                <div className="card-container" style={{ background: 'white', border: '1px solid #4a76c5', padding: '10px 80px', borderRadius: '5px', fontSize: '1.2rem' }}>
                    Welcome Admin
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
                <button 
                    style={actionBtnStyle}
                    onClick={() => navigate('/admin/maintenance')}
                >
                    Maintain User
                </button>
                <button 
                    style={actionBtnStyle}
                    onClick={() => navigate('/admin/maintenance')}
                >
                    Maintain Vendor
                </button>
            </div>
            <div style={{ marginTop: '100px' }}>
                <Watermark />
            </div>
        </div>
    );
};

const btnStyle = { background: 'white', border: '1px solid #4a76c5', padding: '8px 40px', borderRadius: '5px', cursor: 'pointer' };
const actionBtnStyle = { background: 'white', border: '1px solid #4a76c5', padding: '15px 50px', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem' };

export default AdminDashboard;
