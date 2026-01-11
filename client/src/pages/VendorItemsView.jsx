import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../services/api';
import { useCart } from '../context/CartContext';

const VendorItemsView = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart, getItemCount } = useCart();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await userApi.getVendorProducts(vendorId);
                setProducts(data);
                // Get vendor info from first product or make additional call
                if (data.length > 0 && data[0].vendorId) {
                    const vendorInfo = typeof data[0].vendorId === 'object' 
                        ? data[0].vendorId 
                        : { _id: vendorId, name: 'Vendor' };
                    setVendor(vendorInfo);
                }
            } catch (err) {
                console.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [vendorId]);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const isInCart = (productId) => {
        return cart.some(item => item._id === productId);
    };

    const getCategoryInfo = (cat) => {
        const info = {
            'Catering': { emoji: '🍽️', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            'Florist': { emoji: '💐', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            'Decoration': { emoji: '🎨', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            'Lighting': { emoji: '💡', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
        };
        return info[cat] || { emoji: '📦', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    };

    const category = products[0]?.category || 'Products';
    const categoryInfo = getCategoryInfo(category);

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navLeft}>
                    <button onClick={() => navigate(-1)} style={styles.backBtn}>
                        <span>←</span>
                        <span>Back</span>
                    </button>
                </div>
                <div style={styles.navCenter}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </div>
                <div style={styles.navRight}>
                    <button onClick={() => navigate('/user/cart')} style={styles.cartBtn}>
                        <span>🛒</span>
                        <span style={styles.cartText}>Cart</span>
                        {getItemCount() > 0 && (
                            <span style={styles.cartBadge}>{getItemCount()}</span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Vendor Header */}
                {vendor && (
                    <section style={{
                        ...styles.vendorHeader,
                        background: `${categoryInfo.gradient.replace('100%)', '15%)')}`
                    }}>
                        <div style={styles.vendorInfo}>
                            <span style={styles.vendorIcon}>{categoryInfo.emoji}</span>
                            <div style={styles.vendorDetails}>
                                <h1 style={styles.vendorName}>{vendor.name || 'Vendor'}</h1>
                                <p style={styles.vendorCategory}>{category} Services</p>
                            </div>
                        </div>
                        <div style={styles.productCount}>
                            <span style={styles.countValue}>{products.length}</span>
                            <span style={styles.countLabel}>Products</span>
                        </div>
                    </section>
                )}

                {/* Products Grid */}
                <section style={styles.productsSection}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Available Products</h2>
                        <p style={styles.sectionSubtitle}>
                            Browse and add items to your cart
                        </p>
                    </div>

                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner} />
                            <p>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>📦</span>
                            <h3 style={styles.emptyTitle}>No products available</h3>
                            <p style={styles.emptyText}>
                                This vendor hasn't listed any products yet
                            </p>
                            <button onClick={() => navigate('/user')} style={styles.emptyBtn}>
                                Browse Other Vendors
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
                                            <div style={{
                                                ...styles.imagePlaceholder,
                                                background: categoryInfo.gradient.replace('100%)', '20%)')
                                            }}>
                                                <span>{categoryInfo.emoji}</span>
                                            </div>
                                        )}
                                        {isInCart(product._id) && (
                                            <span style={styles.inCartBadge}>In Cart ✓</span>
                                        )}
                                    </div>
                                    <div style={styles.productInfo}>
                                        <h4 style={styles.productName}>{product.name}</h4>
                                        <p style={styles.productDesc}>
                                            {product.description || 'Premium quality product for your event'}
                                        </p>
                                        <div style={styles.productPrice}>
                                            <span style={styles.currency}>₹</span>
                                            <span style={styles.priceValue}>{product.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div style={styles.productActions}>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            style={{
                                                ...styles.addBtn,
                                                background: addedId === product._id 
                                                    ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                        >
                                            {addedId === product._id ? (
                                                <>
                                                    <span>✓</span>
                                                    <span>Added!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>🛒</span>
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Floating Cart Button */}
                {getItemCount() > 0 && (
                    <button 
                        onClick={() => navigate('/user/cart')} 
                        style={styles.floatingCart}
                    >
                        <span style={styles.floatingIcon}>🛒</span>
                        <span style={styles.floatingText}>
                            View Cart ({getItemCount()} items)
                        </span>
                        <span style={styles.floatingArrow}>→</span>
                    </button>
                )}
            </main>
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
        background: 'radial-gradient(ellipse at center, rgba(240, 147, 251, 0.08) 0%, transparent 60%)',
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
    navLeft: {
        flex: 1
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
        cursor: 'pointer'
    },
    navCenter: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flex: 1,
        justifyContent: 'center'
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
    navRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    cartBtn: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(240, 147, 251, 0.1)',
        border: '1px solid rgba(240, 147, 251, 0.3)',
        borderRadius: '8px',
        color: '#f093fb',
        fontSize: '0.9rem',
        cursor: 'pointer'
    },
    cartText: {
        fontWeight: 500
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '22px',
        height: '22px',
        background: '#ff5252',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: '#fff'
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem 6rem',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    vendorHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem 2.5rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.5s ease-out'
    },
    vendorInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    vendorIcon: {
        fontSize: '3.5rem'
    },
    vendorDetails: {},
    vendorName: {
        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
        fontWeight: 700,
        marginBottom: '0.25rem'
    },
    vendorCategory: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)'
    },
    productCount: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px'
    },
    countValue: {
        fontSize: '1.75rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    countLabel: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    productsSection: {},
    sectionHeader: {
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '0.25rem'
    },
    sectionSubtitle: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.5)'
    },
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        gap: '1rem',
        color: 'rgba(255,255,255,0.6)'
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem'
    },
    productCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.5s ease-out both'
    },
    productImage: {
        position: 'relative',
        height: '180px'
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
        fontSize: '4rem'
    },
    inCartBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '0.35rem 0.75rem',
        background: 'rgba(67, 233, 123, 0.9)',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#000'
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
        overflow: 'hidden',
        lineHeight: 1.4
    },
    productPrice: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.1rem'
    },
    currency: {
        fontSize: '1rem',
        color: '#43e97b',
        fontWeight: 500
    },
    priceValue: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#43e97b'
    },
    productActions: {
        padding: '0 1.25rem 1.25rem'
    },
    addBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.85rem',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.25)'
    },
    floatingCart: {
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '50px',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.5)',
        animation: 'slideInUp 0.5s ease-out',
        zIndex: 50
    },
    floatingIcon: {
        fontSize: '1.25rem'
    },
    floatingText: {},
    floatingArrow: {
        fontSize: '1.1rem'
    }
};

export default VendorItemsView;
