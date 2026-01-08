import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminMaintenance = () => {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        console.log('Navigating to:', path);
        navigate(path);
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
                <button style={btnStyle} onClick={() => handleNavigate('/admin')}>Home</button>
                <button style={btnStyle} onClick={() => { localStorage.clear(); handleNavigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* Membership Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div className="card-container" style={labelBoxStyle}>Membership</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={actionBtnStyle} onClick={() => handleNavigate('/signup')}>Add</button>
                        <button style={actionBtnStyle} onClick={() => handleNavigate('/admin/membership')}>Update</button>
                    </div>
                </div>

                {/* User Management Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div className="card-container" style={labelBoxStyle}>User Management</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={actionBtnStyle} onClick={() => handleNavigate('/signup')}>Add</button>
                        <button style={actionBtnStyle} onClick={() => handleNavigate('/admin/users')}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const btnStyle = { background: 'white', color: '#4a76c5', border: '1px solid #4a76c5', padding: '8px 40px', borderRadius: '5px', cursor: 'pointer' };
const labelBoxStyle = { background: 'white', color: '#4a76c5', border: '1px solid #4a76c5', padding: '15px 30px', borderRadius: '5px', fontSize: '1.2rem', minWidth: '250px', textAlign: 'center' };
const actionBtnStyle = { background: 'white', color: '#4a76c5', border: '1px solid #4a76c5', padding: '8px 40px', borderRadius: '5px', cursor: 'pointer', minWidth: '150px' };

export default AdminMaintenance;
