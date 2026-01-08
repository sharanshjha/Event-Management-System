import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const [addedProduct, setAddedProduct] = useState(null);

  const categories = ['All', 'Catering', 'Florist', 'Decoration', 'Lighting'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await userApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product._id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div>
      <div className="content-card">
        <h2>Browse Event Services</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 2, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5001/${product.image.replace(/\\/g, '/')}`) : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="product-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image' }}
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-vendor">by {product.vendorId?.name || 'Unknown'}</p>
                <p className="product-price">₹{product.price}</p>
                <div className="product-actions">
                  <button
                    className={`action-btn ${addedProduct === product._id ? 'success' : 'primary'}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedProduct === product._id ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <h3>No products found</h3>
          <p>Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default UserProducts;
