import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>Event Management</h1>
          <span className="role-badge admin">Admin Panel</span>
        </div>
        <div className="nav-links">
          <Link to="/admin" className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Dashboard</Link>
          <Link to="/admin/users" className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</Link>
          <Link to="/admin/vendors" className={activeTab === 'vendors' ? 'active' : ''} onClick={() => setActiveTab('vendors')}>Vendors</Link>
          <Link to="/admin/orders" className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</Link>
          <Link to="/admin/requests" className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Requests</Link>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon vendors-icon">🏪</div>
              <div className="stat-info">
                <h3>{stats.totalVendors}</h3>
                <p>Total Vendors</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon products-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orders-icon">🛒</div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
