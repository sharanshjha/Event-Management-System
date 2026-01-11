import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VendorProducts = () => {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', description: '', _id: null });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
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
        setSubmitting(true);
        try {
            if (formData._id) {
                await vendorApi.updateProduct(formData._id, formData);
            } else {
                const productData = {
                    ...formData,
                    category: user?.category || 'General'
                };
                delete productData._id;
                await vendorApi.addProduct(productData);
            }
            setFormData({ name: '', price: '', description: '', _id: null });
            setShowForm(false);
            loadProducts();
        } catch (err) {
            alert('Operation failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            _id: product._id
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await vendorApi.deleteProduct(id);
                loadProducts();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                    <span style={styles.roleTag}>Vendor</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/vendor')} style={styles.navLink}>Dashboard</button>
                    <button onClick={() => navigate('/vendor/products')} style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Products</button>
                    <button onClick={() => navigate('/vendor/transactions')} style={styles.navLink}>Transactions</button>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout →
                </button>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Header */}
                <section style={styles.header}>
                    <div style={styles.headerContent}>
                        <h1 style={styles.title}>Product Management</h1>
                        <p style={styles.subtitle}>Manage your {user?.category || 'vendor'} inventory</p>
                    </div>
                    <button 
                        onClick={() => {
                            setFormData({ name: '', price: '', description: '', _id: null });
                            setShowForm(true);
                        }} 
                        style={styles.addBtn}
                    >
                        <span>+</span>
                        Add Product
                    </button>
                </section>

                {/* Stats Row */}
                <section style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <span style={styles.statIcon}>📦</span>
                        <div style={styles.statInfo}>
                            <span style={styles.statValue}>{products.length}</span>
                            <span style={styles.statLabel}>Total Products</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statIcon}>✅</span>
                        <div style={styles.statInfo}>
                            <span style={{...styles.statValue, color: '#43e97b'}}>
                                {products.filter(p => p.status === 'active').length}
                            </span>
                            <span style={styles.statLabel}>Active</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statIcon}>⏳</span>
                        <div style={styles.statInfo}>
                            <span style={{...styles.statValue, color: '#f093fb'}}>
                                {products.filter(p => p.status === 'pending').length}
                            </span>
                            <span style={styles.statLabel}>Pending</span>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section style={styles.productsSection}>
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner} />
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>📦</span>
                            <h3 style={styles.emptyTitle}>No products yet</h3>
                            <p style={styles.emptyText}>Start by adding your first product</p>
                            <button onClick={() => setShowForm(true)} style={styles.emptyBtn}>
                                Add Product
                            </button>
                        </div>
                    ) : (
                        <div style={styles.productsGrid}>
                            {products.map((product, index) => (
                                <div 
                                    key={product._id} 
                                    style={{
                                        ...styles.productCard,
                                        animationDelay: `${index * 0.05}s`
                                    }}
                                >
                                    <div style={styles.productImage}>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} style={styles.image} />
                                        ) : (
                                            <div style={styles.imagePlaceholder}>
                                                <span>📦</span>
                                            </div>
                                        )}
                                        <span style={{
                                            ...styles.statusBadge,
                                            background: product.status === 'active' 
                                                ? 'rgba(67, 233, 123, 0.2)' 
                                                : 'rgba(240, 147, 251, 0.2)',
                                            color: product.status === 'active' ? '#43e97b' : '#f093fb'
                                        }}>
                                            {product.status}
                                        </span>
                                    </div>
                                    <div style={styles.productInfo}>
                                        <h4 style={styles.productName}>{product.name}</h4>
                                        <p style={styles.productDesc}>
                                            {product.description || 'No description'}
                                        </p>
                                        <div style={styles.productMeta}>
                                            <span style={styles.productPrice}>₹{product.price}</span>
                                            <span style={styles.productCategory}>{product.category}</span>
                                        </div>
                                    </div>
                                    <div style={styles.productActions}>
                                        <button onClick={() => handleEdit(product)} style={styles.editBtn}>
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} style={styles.deleteBtn}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Add/Edit Modal */}
            {showForm && (
                <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                {formData._id ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowForm(false)} style={styles.closeBtn}>
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter product name"
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    placeholder="Enter price"
                                    style={styles.input}
                                    required
                                    min="0"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Enter product description"
                                    style={styles.textarea}
                                    rows={4}
                                />
                            </div>
                            <div style={styles.formActions}>
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)} 
                                    style={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    style={{
                                        ...styles.submitBtn,
                                        opacity: submitting ? 0.7 : 1
                                    }}
                                >
                                    {submitting ? 'Saving...' : formData._id ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#fff',
        position: 'relative'
    },
    bgPattern: {
        position: 'fixed',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 0
    },
    bgGlow: {
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 3rem',
        background: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    navBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    logoIcon: {
        fontSize: '1.5rem'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    roleTag: {
        padding: '0.25rem 0.75rem',
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: '#fff',
        textTransform: 'uppercase'
    },
    navLinks: {
        display: 'flex',
        gap: '0.5rem'
    },
    navLink: {
        padding: '0.5rem 1rem',
        background: 'transparent',
        border: 'none',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.9rem',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
    },
    logoutBtn: {
        padding: '0.6rem 1.25rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '10px',
        color: '#ff5252',
        fontSize: '0.9rem',
        cursor: 'pointer'
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    headerContent: {},
    title: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        marginBottom: '0.25rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.5)'
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.85rem 1.5rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)'
    },
    statIcon: {
        fontSize: '1.75rem'
    },
    statInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#667eea'
    },
    statLabel: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    productsSection: {},
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        gap: '1rem'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#667eea',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)'
    },
    emptyIcon: {
        fontSize: '4rem',
        display: 'block',
        marginBottom: '1rem'
    },
    emptyTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '0.5rem'
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '2rem'
    },
    emptyBtn: {
        padding: '0.85rem 2rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer'
    },
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
    },
    productCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out both'
    },
    productImage: {
        position: 'relative',
        height: '160px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
    },
    statusBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    productInfo: {
        padding: '1.25rem'
    },
    productName: {
        fontSize: '1.1rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: '#fff'
    },
    productDesc: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    productMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    productPrice: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#43e97b'
    },
    productCategory: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)',
        padding: '0.25rem 0.5rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '4px'
    },
    productActions: {
        display: 'flex',
        gap: '0.5rem',
        padding: '0 1.25rem 1.25rem'
    },
    editBtn: {
        flex: 1,
        padding: '0.6rem',
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '8px',
        color: '#667eea',
        fontSize: '0.85rem',
        cursor: 'pointer'
    },
    deleteBtn: {
        flex: 1,
        padding: '0.6rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '8px',
        color: '#ff5252',
        fontSize: '0.85rem',
        cursor: 'pointer'
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        width: '100%',
        maxWidth: '480px',
        background: '#1a1a24',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
    },
    modalTitle: {
        fontSize: '1.25rem',
        fontWeight: 600
    },
    closeBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        color: 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        padding: '1.5rem'
    },
    formGroup: {
        marginBottom: '1.25rem'
    },
    label: {
        display: 'block',
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '0.5rem'
    },
    input: {
        width: '100%',
        padding: '0.85rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.95rem',
        outline: 'none'
    },
    textarea: {
        width: '100%',
        padding: '0.85rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.95rem',
        outline: 'none',
        resize: 'none'
    },
    formActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem'
    },
    cancelBtn: {
        flex: 1,
        padding: '0.85rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'rgba(255,255,255,0.7)',
        cursor: 'pointer'
    },
    submitBtn: {
        flex: 1,
        padding: '0.85rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer'
    }
};

export default VendorProducts;
