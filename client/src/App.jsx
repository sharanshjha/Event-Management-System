import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
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
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#e0e0e0',
        color: '#4a76c5'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  
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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ThemeToggle />
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
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
