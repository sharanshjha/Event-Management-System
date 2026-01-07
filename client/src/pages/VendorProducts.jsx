import { useState, useEffect } from 'react';
import { vendorApi } from '../services/api';
import './Dashboard.css';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await vendorApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await vendorApi.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('price', editData.price);
      formData.append('description', editData.description);
      
      await vendorApi.updateProduct(editingProduct._id, formData);
      await loadProducts();
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (err) {
      alert('Failed to update product: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-section">
      <h2>My Products</h2>
      
      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-data">No products found. Add your first product!</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image.startsWith('http') ? product.image : `http://localhost:5001${product.image}`} alt={product.name} />
                ) : (
                  <div className="no-image">📦</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
                <p className="product-desc">{product.description || 'No description'}</p>
                <span className={`status-badge ${product.status}`}>{product.status}</span>
              </div>
              <div className="product-actions">
                <button onClick={() => openEditModal(product)} className="btn-edit">Update</button>
                <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Product</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleUpdate} className="btn-save">Update</button>
              <button onClick={() => setEditingProduct(null)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
