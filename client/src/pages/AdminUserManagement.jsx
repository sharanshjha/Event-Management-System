import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import './Dashboard.css';

const AdminUserManagement = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const users = await adminApi.getUsers();
            const vendors = await adminApi.getVendors();
            const combined = [...users, ...vendors];
            if (combined.length > 0) {
                setAllUsers(combined);
            } else {
                setAllUsers([
                    { _id: '507f191e810c19729de860ec', name: 'John User', email: 'user@event.com', role: 'user' },
                    { _id: '507f191e810c19729de860ea', name: 'Royal Catering', email: 'vendor@event.com', role: 'vendor' }
                ]);
            }
        } catch (err) {
            console.error('Failed to load data, using demo data');
            setAllUsers([
                { _id: '507f191e810c19729de860ec', name: 'John User', email: 'user@event.com', role: 'user' },
                { _id: '507f191e810c19729de860ea', name: 'Royal Catering', email: 'vendor@event.com', role: 'vendor' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, role) => {
        if (window.confirm(`Delete this ${role}?`)) {
            try {
                if (role === 'vendor') await adminApi.deleteVendor(id);
                else await adminApi.deleteUser(id);
                loadData();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button style={btnStyle} onClick={() => navigate('/admin/maintenance')}>Back</button>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 50px', borderRadius: '5px' }}>User Management</div>
                <button style={btnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ padding: '0 50px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr style={{ background: '#4a76c5', color: 'white' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Role</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(u => (
                            <tr key={u._id} className="table-row-white" style={{ background: 'white' }}>
                                <td style={tdStyle}>{u.name}</td>
                                <td style={tdStyle}>{u.email}</td>
                                <td style={tdStyle}>{u.role}</td>
                                <td style={tdStyle}>
                                    <button 
                                        onClick={() => handleDelete(u._id, u.role)}
                                        style={{ ...actionBtnStyle, background: '#d9534f' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const btnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { padding: '15px', textAlign: 'left', color: 'white' };
const tdStyle = { padding: '15px' };
const actionBtnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '3px', cursor: 'pointer' };

export default AdminUserManagement;
