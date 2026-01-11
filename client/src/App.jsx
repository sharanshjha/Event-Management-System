import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Watermark from './components/Watermark';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMaintenance from './pages/AdminMaintenance';
import AdminMembership from './pages/AdminMembership';
import AdminUserManagement from './pages/AdminUserManagement';

// Vendor Pages
import VendorDashboard from './pages/VendorDashboard';
import VendorProducts from './pages/VendorProducts';
import VendorProductStatus from './pages/VendorProductStatus';
import VendorTransactions from './pages/VendorTransactions';

// User Pages
import UserDashboard from './pages/UserDashboard';
import UserCart from './pages/UserCart';
import UserCheckout from './pages/UserCheckout';
import UserOrders from './pages/UserOrders';
import OrderSuccess from './pages/OrderSuccess';
import VendorTypeView from './pages/VendorTypeView';
import VendorItemsView from './pages/VendorItemsView';
import UserGuestList from './pages/UserGuestList';

import './index.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0f',
        color: '#667eea',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(102,126,234,0.2)',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Loading...</span>
      </div>
    );
  }

  // Not logged in - redirect to login with return URL
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname, message: 'Please login to access this page' }} />;
  }
  
  // Wrong role - show unauthorized page (NOT redirect to home)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Global Layout Wrapper to handle location-based components
const AppContent = () => {
  const location = useLocation();
  
  // Routes where watermark should NOT be visible
  const hideWatermarkRoutes = [
    '/user/checkout',
    '/user/order-success',
    '/user/cart',
    '/login',
    '/signup',
    '/'
  ];

  const showWatermark = !hideWatermarkRoutes.includes(location.pathname);

  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/maintenance" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMaintenance />
          </ProtectedRoute>
        } />
        <Route path="/admin/membership" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMembership />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUserManagement />
          </ProtectedRoute>
        } />

        {/* Vendor Routes */}
        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/vendor/products" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProducts />
          </ProtectedRoute>
        } />
        <Route path="/vendor/transactions" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorTransactions />
          </ProtectedRoute>
        } />
        <Route path="/vendor/product-status" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProductStatus />
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/guest-list" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserGuestList />
          </ProtectedRoute>
        } />
        <Route path="/user/vendor/:category" element={
          <ProtectedRoute allowedRoles={['user']}>
            <VendorTypeView />
          </ProtectedRoute>
        } />
        <Route path="/user/shop/:vendorId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <VendorItemsView />
          </ProtectedRoute>
        } />
        <Route path="/user/cart" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserCart />
          </ProtectedRoute>
        } />
        <Route path="/user/checkout" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserCheckout />
          </ProtectedRoute>
        } />
        <Route path="/user/order-success" element={
          <ProtectedRoute allowedRoles={['user']}>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path="/user/order-status" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserOrders />
          </ProtectedRoute>
        } />
        <Route path="/user/vendor-items/:vendorId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <VendorItemsView />
          </ProtectedRoute>
        } />

        {/* 404 Page - Show proper message, not redirect */}
        <Route path="*" element={
          <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <span style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</span>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Page Not Found</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '400px' }}>
              The page you're looking for doesn't exist or may have been moved.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.85rem 2rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Go to Homepage
            </button>
          </div>
        } />
      </Routes>
      {showWatermark && (
        <div style={{ position: 'fixed', bottom: '10px', left: '10px', pointerEvents: 'none', zIndex: 1000 }}>
          <Watermark />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
