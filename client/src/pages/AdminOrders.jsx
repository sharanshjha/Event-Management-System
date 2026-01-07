import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Dashboard.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminApi.updateOrder(id, { status: newStatus });
      loadOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update status');
    }
  };

  const handleDateUpdate = async (id, newDate) => {
    try {
      await adminApi.updateOrder(id, { estimatedDeliveryDate: newDate });
      loadOrders();
    } catch (err) {
      console.error('Failed to update order date:', err);
      alert('Failed to update date');
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-section">
      <div className="content-card">
        <h2>All Orders</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Est. Delivery</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="no-data">No orders found</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td data-label="Order ID">{order._id.slice(-6)}</td>
                    <td data-label="Customer">{order.userId?.name || 'Guest'}</td>
                    <td data-label="Total">₹{order.totalAmount}</td>
                    <td data-label="Payment">{order.paymentMethod?.toUpperCase()}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td data-label="Est. Delivery">
                      <input 
                        type="date" 
                        className="date-input"
                        value={order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleDateUpdate(order._id, e.target.value)}
                        style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                      />
                    </td>
                    <td data-label="Action">
                      <select 
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
