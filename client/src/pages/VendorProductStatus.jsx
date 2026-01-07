import { useState, useEffect } from 'react';
import { vendorApi } from '../services/api';
import './Dashboard.css';

const VendorProductStatus = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await vendorApi.getProductStatus();
      setStatusData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading product status...</div>;

  return (
    <div className="admin-section">
      <h2>Product Status Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{statusData?.total || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{statusData?.active || 0}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{statusData?.pending || 0}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card deleted">
          <div className="stat-icon">🗑️</div>
          <div className="stat-info">
            <h3>{statusData?.deleted || 0}</h3>
            <p>Deleted</p>
          </div>
        </div>
      </div>

      {statusData?.products && (
        <div className="table-container" style={{ marginTop: '30px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {statusData.products.map(product => (
                <tr key={product._id}>
                  <td data-label="Product Name">{product.name}</td>
                  <td data-label="Price">₹{product.price}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td data-label="Created">{new Date(product.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorProductStatus;
