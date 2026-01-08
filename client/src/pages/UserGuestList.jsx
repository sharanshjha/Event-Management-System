import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const UserGuestList = () => {
    const [guests, setGuests] = useState([
        { id: 1, name: 'Sample Guest', email: 'guest@example.com', status: 'Invited' }
    ]);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const navigate = useNavigate();

    const handleAdd = (e) => {
        e.preventDefault();
        setGuests([...guests, { id: Date.now(), ...formData, status: 'Invited' }]);
        setFormData({ name: '', email: '' });
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button style={btnStyle} onClick={() => navigate('/user')}>Home</button>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 100px', borderRadius: '5px' }}>Guest List</div>
                <button style={btnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div className="card-container" style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '800px', margin: '0 auto', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label>Guest Name</label>
                        <input 
                            className="form-input"
                            style={inputStyle} 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Email</label>
                        <input 
                            className="form-input"
                            style={inputStyle} 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" style={addBtnStyle}>Add Guest</button>
                </form>
            </div>

            <div style={{ padding: '0 50px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr style={{ background: '#4a76c5', color: 'white' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map(g => (
                            <tr key={g.id} className="table-row-white" style={{ background: 'white' }}>
                                <td style={tdStyle}>{g.name}</td>
                                <td style={tdStyle}>{g.email}</td>
                                <td style={tdStyle}>{g.status}</td>
                                <td style={tdStyle}>
                                    <button 
                                        onClick={() => setGuests(guests.filter(item => item.id !== g.id))}
                                        style={{ ...actionBtnStyle, background: '#d9534f' }}
                                    >
                                        Remove
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

const btnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '8px 40px', borderRadius: '5px', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' };
const addBtnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '11px 30px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { padding: '15px', textAlign: 'left', color: 'white' };
const tdStyle = { padding: '15px' };
const actionBtnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '3px', cursor: 'pointer' };

export default UserGuestList;
