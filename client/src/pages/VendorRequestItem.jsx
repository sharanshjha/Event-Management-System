import { useState, useEffect } from 'react';
import { vendorApi } from '../services/api';
import './Dashboard.css';
import './Auth.css';

const VendorRequestItem = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await vendorApi.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemName) {
      alert('Item name is required');
      return;
    }
    
    setLoading(true);
    
    try {
      await vendorApi.requestItem({ itemName, description });
      alert('Request submitted successfully!');
      setItemName('');
      setDescription('');
      await loadRequests();
    } catch (err) {
      alert('Failed to submit request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Request New Item</h2>
      
      <div className="form-container" style={{ maxWidth: '500px', marginBottom: '40px' }}>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="itemName">Item Name *</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              rows="4"
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <h3>Your Requests</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="4" className="no-data">No requests found</td></tr>
            ) : (
              requests.map(request => (
                <tr key={request._id}>
                  <td data-label="Item Name">{request.itemName}</td>
                  <td data-label="Description">{request.description || '-'}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td data-label="Date">{new Date(request.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorRequestItem;
