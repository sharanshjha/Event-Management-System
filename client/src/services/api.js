const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Generic fetch wrapper
const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error('Non-JSON response received:', text);
    throw new Error(`Server returned non-JSON response (HTML/Text). Check if VITE_API_URL is correct: ${API_URL}`);
  }
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Auth API
export const authApi = {
  login: (credentials) => fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  signup: (userData) => fetchApi('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  getMe: () => fetchApi('/auth/me'),
};

// Admin API
export const adminApi = {
  getUsers: () => fetchApi('/admin/users'),
  getVendors: () => fetchApi('/admin/vendors'),
  deleteUser: (id) => fetchApi(`/admin/users/${id}`, { method: 'DELETE' }),
  deleteVendor: (id) => fetchApi(`/admin/vendors/${id}`, { method: 'DELETE' }),
  updateMembership: (id, data) => fetchApi(`/admin/vendors/${id}/membership`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getOrders: () => fetchApi('/admin/orders'),
  updateOrder: (id, data) => fetchApi(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getRequests: () => fetchApi('/admin/requests'),
  updateRequest: (id, status) => fetchApi(`/admin/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getStats: () => fetchApi('/admin/stats'),
};

// Vendor API
export const vendorApi = {
  getProducts: () => fetchApi('/vendor/products'),
  addProduct: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vendor/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add product');
    return data;
  },
  updateProduct: async (id, formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vendor/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },
  deleteProduct: (id) => fetchApi(`/vendor/products/${id}`, { method: 'DELETE' }),
  getProductStatus: () => fetchApi('/vendor/product-status'),
  requestItem: (data) => fetchApi('/vendor/request-item', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getRequests: () => fetchApi('/vendor/requests'),
  getTransactions: () => fetchApi('/vendor/transactions'),
};

// User API
export const userApi = {
  getProducts: () => fetchApi('/user/products'),
  getProduct: (id) => fetchApi(`/user/products/${id}`),
  getVendors: () => fetchApi('/user/vendors'),
  placeOrder: (orderData) => fetchApi('/user/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  getOrders: () => fetchApi('/user/orders'),
  getOrder: (id) => fetchApi(`/user/orders/${id}`),
  cancelOrder: (id) => fetchApi(`/user/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'cancelled' }),
  }),
  deleteOrder: (id) => fetchApi(`/user/orders/${id}`, { method: 'DELETE' }),
};

export default fetchApi;
