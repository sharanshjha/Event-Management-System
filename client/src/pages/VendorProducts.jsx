import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const VendorProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', description: '', _id: null });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await vendorApi.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData._id) {
                await vendorApi.updateProduct(formData._id, formData);
                alert('Item updated successfully!');
            } else {
                const productData = {
                    ...formData,
                    category: user?.category || 'General'
                };
                delete productData._id; // Remove null _id for new products
                await vendorApi.addProduct(productData);
                alert('Item added successfully!');
            }
            setFormData({ name: '', price: '', description: '', _id: null });
            loadProducts();
        } catch (err) {
            console.error('Error:', err);
            alert('Operation failed: ' + err.message);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            _id: product._id
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            try {
                await vendorApi.deleteProduct(id);
                loadProducts();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar Form (Blue) */}
            <div style={{ width: '350px', background: '#4a76c5', padding: '40px 20px', color: 'white' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>{formData._id ? 'Update Item' : 'Add Item'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label>Item Name</label>
                        <input 
                            className="form-input"
                            style={sidebarInputStyle} 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Item Price</label>
                        <input 
                            className="form-input"
                            style={sidebarInputStyle} 
                            type="number"
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea 
                            className="form-input"
                            style={{...sidebarInputStyle, height: '100px', resize: 'none'}} 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>
                    <button type="submit" style={sidebarBtnStyle}>
                        {formData._id ? 'Update' : 'Add'}
                    </button>
                    {formData._id && (
                        <button type="button" onClick={() => setFormData({name: '', price: '', description: '', _id: null})} style={{...sidebarBtnStyle, background: '#666'}}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* Main Content (Grey) */}
            <div className="page-shell" style={{ flex: 1, background: '#e0e0e0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={topBtnStyle} onClick={() => navigate('/vendor')}>Home</button>
                        <button style={topBtnStyle} onClick={() => navigate('/vendor/product-status')}>Product Status</button>
                        <button style={topBtnStyle} onClick={() => navigate('/vendor/transactions')}>Request Item</button>
                    </div>
                    <button style={topBtnStyle} onClick={() => { localStorage.clear(); navigate('/login'); }}>LogOut</button>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#4a76c5', color: 'white' }}>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Update</th>
                                <th style={thStyle}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={tdStyle}>{p.name}</td>
                                    <td style={tdStyle}>{p.price}/-</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleEdit(p)} style={actionBtnStyle}>Update</button>
                                    </td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleDelete(p._id)} style={actionBtnStyle}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const sidebarInputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', marginTop: '5px' };
const sidebarBtnStyle = { background: 'white', color: '#4a76c5', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };
const topBtnStyle = { background: 'white', border: '1px solid #4a76c5', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { padding: '15px', textAlign: 'left', color: 'white' };
const tdStyle = { padding: '15px', textAlign: 'left' };
const actionBtnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '3px', cursor: 'pointer' };

export default VendorProducts;
