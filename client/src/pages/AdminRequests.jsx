import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Dashboard.css';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await adminApi.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminApi.updateRequest(id, status);
      await loadRequests();
    } catch (err) {
      alert('Failed to update request: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading requests...</div>;

  return (
    <div className="admin-section">
      <h2>Item Requests</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No requests found</td></tr>
            ) : (
              requests.map(request => (
                <tr key={request._id}>
                  <td data-label="Vendor">{request.vendorId?.name || 'N/A'}</td>
                  <td data-label="Item Name">{request.itemName}</td>
                  <td data-label="Description">{request.description || '-'}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td data-label="Date">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    {request.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(request._id, 'approved')} className="btn-approve">Approve</button>
                        <button onClick={() => handleStatusUpdate(request._id, 'rejected')} className="btn-reject">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequests;
