import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminVendors from './pages/AdminVendors';
import AdminOrders from './pages/AdminOrders';
import AdminRequests from './pages/AdminRequests';

// Vendor Pages
import VendorDashboard from './pages/VendorDashboard';
import VendorAddProduct from './pages/VendorAddProduct';
import VendorProducts from './pages/VendorProducts';
import VendorProductStatus from './pages/VendorProductStatus';
import VendorRequestItem from './pages/VendorRequestItem';
import VendorTransactions from './pages/VendorTransactions';

// User Pages
import UserDashboard from './pages/UserDashboard';
import UserProducts from './pages/UserProducts';
import UserCart from './pages/UserCart';
import UserCheckout from './pages/UserCheckout';
import UserOrders from './pages/UserOrders';

import './index.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      color: '#fff'
    }}>
      Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
};

// Home Route - redirect based on role
const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      color: '#fff'
    }}>
      Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
  return <Navigate to="/user" replace />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomeRoute />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/:role" element={<Signup />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="users" element={<AdminUsers />} />
              <Route path="vendors" element={<AdminVendors />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="requests" element={<AdminRequests />} />
            </Route>

            {/* Vendor Routes */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="add-product" element={<VendorAddProduct />} />
              <Route path="products" element={<VendorProducts />} />
              <Route path="product-status" element={<VendorProductStatus />} />
              <Route path="request-item" element={<VendorRequestItem />} />
              <Route path="transactions" element={<VendorTransactions />} />
            </Route>

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="products" element={<UserProducts />} />
              <Route path="cart" element={<UserCart />} />
              <Route path="checkout" element={<UserCheckout />} />
              <Route path="orders" element={<UserOrders />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
