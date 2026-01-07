import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Dashboard.css';

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [membershipData, setMembershipData] = useState({ duration: '6months', status: 'active' });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await adminApi.getVendors();
      setVendors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will also delete all products by this vendor.')) return;
    try {
      await adminApi.deleteVendor(id);
      setVendors(vendors.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete vendor: ' + err.message);
    }
  };

  const openMembershipModal = (vendor) => {
    setSelectedVendor(vendor);
    setMembershipData({
      duration: vendor.membershipDuration || '6months',
      status: vendor.membershipStatus || 'active'
    });
    setShowMembershipModal(true);
  };

  const handleMembershipUpdate = async () => {
    try {
      await adminApi.updateMembership(selectedVendor._id, membershipData);
      await loadVendors();
      setShowMembershipModal(false);
      alert('Membership updated successfully');
    } catch (err) {
      alert('Failed to update membership: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading vendors...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-section">
      <h2>Manage Vendors</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No vendors found</td></tr>
            ) : (
              vendors.map(vendor => (
                <tr key={vendor._id}>
                  <td data-label="Name">{vendor.name}</td>
                  <td data-label="Email">{vendor.email}</td>
                  <td data-label="Membership">{vendor.membershipDuration || 'N/A'}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${vendor.membershipStatus || 'inactive'}`}>
                      {vendor.membershipStatus || 'Inactive'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <button onClick={() => openMembershipModal(vendor)} className="btn-edit">Membership</button>
                    <button onClick={() => handleDelete(vendor._id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showMembershipModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Membership - {selectedVendor?.name}</h3>
            <div className="form-group">
              <label>Duration</label>
              <select
                value={membershipData.duration}
                onChange={(e) => setMembershipData({ ...membershipData, duration: e.target.value })}
              >
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
                <option value="2years">2 Years</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={membershipData.status}
                onChange={(e) => setMembershipData({ ...membershipData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleMembershipUpdate} className="btn-save">Update</button>
              <button onClick={() => setShowMembershipModal(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
