import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import './Dashboard.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await userApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setActionLoading(orderId);
    try {
      await userApi.cancelOrder(orderId);
      loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setActionLoading(orderId);
    try {
      await userApi.deleteOrder(orderId);
      loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to delete order');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div>
      <div className="content-card">
        <h2>My Orders</h2>

        {orders.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td data-label="Order ID">{order._id.slice(-8)}</td>
                  <td data-label="Items">
                    <div style={{ maxWidth: '200px' }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.85rem' }}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td data-label="Total">₹{order.totalAmount}</td>
                  <td data-label="Payment" style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                    {order.estimatedDeliveryDate && (
                      <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--accent-color)' }}>
                        Est: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <div className="order-actions-cell" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {order.status === 'pending' && (
                        <button
                          className="action-btn danger"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={actionLoading === order._id}
                        >
                          Cancel
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'cancelled') && (
                        <button
                          className="action-btn-outline danger"
                          onClick={() => handleDeleteOrder(order._id)}
                          disabled={actionLoading === order._id}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <span style={{ fontSize: '3rem' }}>📦</span>
            <h3>No orders yet</h3>
            <p>Your orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
