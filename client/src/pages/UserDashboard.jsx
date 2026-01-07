import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { userApi } from '../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    try {
      const data = await userApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>Event Management</h1>
          <span className="role-badge user">User Portal</span>
        </div>
        <div className="nav-links">
          <Link to="/user" className={isActive('/user') ? 'active' : ''}>Dashboard</Link>
          <Link to="/user/products" className={isActive('/user/products') ? 'active' : ''}>Products</Link>
          <Link to="/user/cart" className={isActive('/user/cart') ? 'active' : ''}>
            Cart ({getItemCount()})
          </Link>
          <Link to="/user/orders" className={isActive('/user/orders') ? 'active' : ''}>My Orders</Link>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        {location.pathname === '/user' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orders-icon">📦</div>
                <div className="stat-info">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pending-icon">⏳</div>
                <div className="stat-info">
                  <h3>{orders.filter(o => o.status === 'pending').length}</h3>
                  <p>Pending Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon active-icon">✅</div>
                <div className="stat-info">
                  <h3>{orders.filter(o => o.status === 'delivered').length}</h3>
                  <p>Delivered</p>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h2>Recent Orders</h2>
              {orders.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order._id}>
                        <td data-label="Order ID">{order._id.slice(-8)}</td>
                        <td data-label="Items">{order.items?.length || 0} items</td>
                        <td data-label="Total">₹{order.totalAmount}</td>
                        <td data-label="Status">
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <span style={{ fontSize: '3rem' }}>🛒</span>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                </div>
              )}
            </div>
          </>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
