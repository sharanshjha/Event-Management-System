import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vendorApi } from '../services/api';
import './Dashboard.css';

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const data = await vendorApi.getProductStatus();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
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
          <span className="role-badge vendor">Vendor Portal</span>
        </div>
        <div className="nav-links">
          <Link to="/vendor" className={isActive('/vendor') ? 'active' : ''}>Dashboard</Link>
          <Link to="/vendor/add-product" className={isActive('/vendor/add-product') ? 'active' : ''}>Add Product</Link>
          <Link to="/vendor/products" className={isActive('/vendor/products') ? 'active' : ''}>My Products</Link>
          <Link to="/vendor/product-status" className={isActive('/vendor/product-status') ? 'active' : ''}>Product Status</Link>
          <Link to="/vendor/request-item" className={isActive('/vendor/request-item') ? 'active' : ''}>Request Item</Link>
          <Link to="/vendor/transactions" className={isActive('/vendor/transactions') ? 'active' : ''}>Transactions</Link>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        {location.pathname === '/vendor' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon products-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.active}</h3>
                <p>Active Products</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>Pending Products</p>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default VendorDashboard;
