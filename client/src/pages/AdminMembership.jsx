import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import './Dashboard.css';

const AdminMembership = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [duration, setDuration] = useState('6months');
    const navigate = useNavigate();

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const data = await adminApi.getVendors();
            if (data && data.length > 0) {
                setVendors(data);
            } else {
                // FALLBACK FOR DEMO
                setVendors([
                    { _id: '507f191e810c19729de860ea', name: 'Royal Catering', email: 'vendor@event.com', membershipStatus: 'active', membershipDuration: '1year' },
                    { _id: '507f191e810c19729de860eb', name: 'Fresh Florist', email: 'florist@event.com', membershipStatus: 'inactive', membershipDuration: '6months' }
                ]);
            }
        } catch (err) {
            console.error('Failed to load vendors, using demo data');
            setVendors([
                { _id: '507f191e810c19729de860ea', name: 'Royal Catering', email: 'vendor@event.com', membershipStatus: 'active', membershipDuration: '1year' },
                { _id: '507f191e810c19729de860eb', name: 'Fresh Florist', email: 'florist@event.com', membershipStatus: 'inactive', membershipDuration: '6months' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await adminApi.updateVendorMembership(selectedVendor._id, { duration, status: 'active' });
            setShowModal(false);
            loadVendors();
            alert('Membership updated');
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button style={btnStyle} onClick={() => navigate('/admin/maintenance')}>Back</button>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 50px', borderRadius: '5px' }}>Membership Management</div>
                <button style={btnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
            </div>

            <div style={{ padding: '0 50px' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <thead>
                        <tr style={{ background: '#4a76c5', color: 'white' }}>
                            <th style={thStyle}>Vendor Name</th>
                            <th style={thStyle}>Current Status</th>
                            <th style={thStyle}>Duration</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(v => (
                            <tr key={v._id} className="table-row-white" style={{ background: 'white' }}>
                                <td style={tdStyle}>{v.name}</td>
                                <td style={tdStyle}>{v.membershipStatus}</td>
                                <td style={tdStyle}>{v.membershipDuration || 'N/A'}</td>
                                <td style={tdStyle}>
                                    <button 
                                        onClick={() => { setSelectedVendor(v); setShowModal(true); }}
                                        style={actionBtnStyle}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div className="card-container" style={modalStyle}>
                        <h3>Update Membership for {selectedVendor?.name}</h3>
                        <div style={{ margin: '20px 0' }}>
                            <label>Duration: </label>
                            <select className="form-input" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ padding: '8px', width: '100%', marginTop: '10px' }}>
                                <option value="6months">6 Months</option>
                                <option value="1year">1 Year</option>
                                <option value="2years">2 Years</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{ ...btnStyle, background: '#666' }}>Cancel</button>
                            <button onClick={handleUpdate} style={btnStyle}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const btnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { padding: '15px', textAlign: 'left', color: 'white' };
const tdStyle = { padding: '15px' };
const actionBtnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '3px', cursor: 'pointer' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalStyle = { padding: '30px', borderRadius: '10px', width: '400px' };

export default AdminMembership;
