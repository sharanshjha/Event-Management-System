import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useCart } from '../context/CartContext';
import './Dashboard.css';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await userApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product._id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <div className="content-card">
        <h2>Browse Products</h2>
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5001${product.image}`) : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="product-image"
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
