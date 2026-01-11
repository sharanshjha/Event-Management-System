import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../services/api';
import { useCart } from '../context/CartContext';

const VendorTypeView = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { getItemCount } = useCart();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVendors = async () => {
            try {
                const data = await userApi.getVendorsByCategory(category);
                setVendors(data);
            } catch (err) {
                console.error('Failed to load vendors');
            } finally {
                setLoading(false);
            }
        };
        loadVendors();
    }, [category]);

    const getCategoryEmoji = (cat) => {
        const emojis = {
            'Catering': '🍽️',
            'Florist': '💐',
            'Decoration': '🎨',
            'Lighting': '💡'
        };
        return emojis[cat] || '🏪';
    };

    const getCategoryGradient = (cat) => {
        const gradients = {
            'Catering': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'Florist': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'Decoration': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'Lighting': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        };
        return gradients[cat] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navLeft}>
                    <button onClick={() => navigate('/user')} style={styles.backBtn}>
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
                        {getItemCount() > 0 && (
                            <span style={styles.cartBadge}>{getItemCount()}</span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Hero Section */}
                <section style={{
                    ...styles.hero,
                    background: `${getCategoryGradient(category).replace('100%)', '20%)')}, rgba(10, 10, 15, 0.9)`
                }}>
                    <div style={styles.heroContent}>
                        <span style={styles.heroIcon}>{getCategoryEmoji(category)}</span>
                        <div style={styles.heroText}>
                            <h1 style={styles.heroTitle}>{category} Vendors</h1>
                            <p style={styles.heroSubtitle}>
                                Discover premium {category?.toLowerCase()} services for your event
                            </p>
                        </div>
                    </div>
                    <div style={styles.heroBadge}>
                        <span style={styles.badgeValue}>{vendors.length}</span>
                        <span style={styles.badgeLabel}>Vendors Available</span>
                    </div>
                </section>

                {/* Vendors Grid */}
                <section style={styles.vendorsSection}>
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner} />
                            <p>Loading vendors...</p>
                        </div>
                    ) : vendors.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>🔍</span>
                            <h3 style={styles.emptyTitle}>No vendors found</h3>
                            <p style={styles.emptyText}>
                                There are no {category?.toLowerCase()} vendors available at the moment
                            </p>
                            <button onClick={() => navigate('/user')} style={styles.emptyBtn}>
                                Browse Other Categories
                            </button>
                        </div>
                    ) : (
                        <div style={styles.vendorsGrid}>
                            {vendors.map((vendor, index) => (
                                <div
                                    key={vendor._id}
                                    onClick={() => navigate(`/user/vendor-items/${vendor._id}`)}
                                    style={{
                                        ...styles.vendorCard,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div style={{
                                        ...styles.vendorHeader,
                                        background: vendor.profileImage ? 'transparent' : getCategoryGradient(category),
                                        padding: vendor.profileImage ? 0 : '2rem',
                                        height: vendor.profileImage ? '180px' : 'auto',
                                        position: 'relative'
                                    }}>
                                        {vendor.profileImage ? (
                                            <img 
                                                src={vendor.profileImage} 
                                                alt={vendor.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        ) : (
                                            <span style={styles.vendorIcon}>{getCategoryEmoji(category)}</span>
                                        )}
                                        {vendor.membershipStatus === 'active' && (
                                            <span style={{
                                                ...styles.verifiedBadge,
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem'
                                            }}>✓ Verified</span>
                                        )}
                                    </div>
                                    <div style={styles.vendorBody}>
                                        <h3 style={styles.vendorName}>{vendor.name}</h3>
                                        <p style={styles.vendorEmail}>{vendor.email}</p>
                                        <div style={styles.vendorMeta}>
                                            <span style={styles.vendorCategory}>
                                                {getCategoryEmoji(category)} {vendor.category}
                                            </span>
                                            <span style={{
                                                ...styles.membershipTag,
                                                background: vendor.membershipStatus === 'active' 
                                                    ? 'rgba(67, 233, 123, 0.15)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                color: vendor.membershipStatus === 'active'
                                                    ? '#43e97b'
                                                    : 'rgba(255,255,255,0.5)'
                                            }}>
                                                {vendor.membershipStatus === 'active' ? '★ Premium' : 'Standard'}
                                            </span>
                                        </div>
                                        <button style={styles.viewBtn}>
                                            View Products
                                            <span style={styles.btnArrow}>→</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
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
        top: '-30%',
        left: '-20%',
        width: '70%',
        height: '70%',
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
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '1.25rem',
        cursor: 'pointer'
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '20px',
        height: '20px',
        background: '#ff5252',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem',
        fontWeight: 700
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    hero: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2.5rem 3rem',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '2.5rem',
        animation: 'fadeInUp 0.6s ease-out'
    },
    heroContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    heroIcon: {
        fontSize: '4rem'
    },
    heroText: {},
    heroTitle: {
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 700,
        marginBottom: '0.25rem'
    },
    heroSubtitle: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.6)'
    },
    heroBadge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
    },
    badgeValue: {
        fontSize: '2rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    badgeLabel: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    vendorsSection: {},
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
    vendorsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
    },
    vendorCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.5s ease-out both'
    },
    vendorHeader: {
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    vendorIcon: {
        fontSize: '3rem'
    },
    verifiedBadge: {
        padding: '0.35rem 0.75rem',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: '#fff'
    },
    vendorBody: {
        padding: '1.5rem',
        background: 'rgba(0,0,0,0.3)'
    },
    vendorName: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '0.25rem',
        color: '#fff'
    },
    vendorEmail: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '1rem'
    },
    vendorMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    vendorCategory: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.6)'
    },
    membershipTag: {
        padding: '0.25rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: 500
    },
    viewBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.85rem',
        background: 'rgba(102, 126, 234, 0.15)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '10px',
        color: '#667eea',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    btnArrow: {
        transition: 'transform 0.3s ease'
    }
};

export default VendorTypeView;
