import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vendorApi } from '../services/api';

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ products: 0, active: 0, pending: 0, orders: 0 });
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [productData, ordersData] = await Promise.all([
                    vendorApi.getProductStatus(),
                    vendorApi.getTransactions()
                ]);
                setStats({
                    products: productData.total || 0,
                    active: productData.active || 0,
                    pending: productData.pending || 0,
                    orders: ordersData?.length || 0
                });
            } catch (err) {
                console.error('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const quickActions = [
        { 
            title: 'Your Products', 
            icon: '📦', 
            desc: 'Manage inventory',
            path: '/vendor/products',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            stat: stats.products
        },
        { 
            title: 'Add New Item', 
            icon: '➕', 
            desc: 'List a product',
            path: '/vendor/products',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        { 
            title: 'Transactions', 
            icon: '💰', 
            desc: 'View orders',
            path: '/vendor/transactions',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            stat: stats.orders
        },
        { 
            title: 'Product Status', 
            icon: '📊', 
            desc: 'Analytics view',
            path: '/vendor/product-status',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
    ];

    const statCards = [
        { label: 'Total Products', value: stats.products, icon: '📦', color: '#667eea' },
        { label: 'Active Items', value: stats.active, icon: '✅', color: '#43e97b' },
        { label: 'Pending', value: stats.pending, icon: '⏳', color: '#f093fb' },
        { label: 'Orders', value: stats.orders, icon: '🛒', color: '#4facfe' }
    ];

    const getCategoryEmoji = () => {
        const emojis = {
            'Catering': '🍽️',
            'Florist': '💐',
            'Decoration': '🎨',
            'Lighting': '💡'
        };
        return emojis[user?.category] || '🏪';
    };

    return (
        <div style={styles.container}>
            {/* Animated Background */}
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <Link to="/" style={styles.navBrand}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                    <span style={styles.roleTag}>Vendor</span>
                </Link>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/vendor')} style={styles.navLink}>Dashboard</button>
                    <button onClick={() => navigate('/vendor/products')} style={styles.navLink}>Products</button>
                    <button onClick={() => navigate('/vendor/transactions')} style={styles.navLink}>Transactions</button>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <span>Logout</span>
                    <span style={styles.logoutIcon}>→</span>
                </button>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Welcome Section */}
                <section style={styles.welcomeSection}>
                    <div style={styles.welcomeContent}>
                        <span style={styles.greetingLabel}>{greeting} {getCategoryEmoji()}</span>
                        <h1 style={styles.welcomeTitle}>
                            Welcome, <span style={styles.userName}>{user?.name || 'Vendor'}</span>
                        </h1>
                        <p style={styles.welcomeDesc}>
                            Manage your {user?.category || 'vendor'} products and track your business performance.
                        </p>
                        <div style={styles.membershipBadge}>
                            <span style={styles.membershipIcon}>⭐</span>
                            <span>
                                {user?.membershipStatus === 'active' ? 'Active Membership' : 'Membership Inactive'}
                            </span>
                        </div>
                    </div>
                    <div style={styles.welcomeVisual}>
                        <div style={styles.categoryBadge}>
                            <span style={styles.categoryEmoji}>{getCategoryEmoji()}</span>
                            <span style={styles.categoryName}>{user?.category || 'Vendor'}</span>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section style={styles.statsSection}>
                    <h2 style={styles.sectionTitle}>Your Performance</h2>
                    <div style={styles.statsGrid}>
                        {statCards.map((stat, index) => (
                            <div 
                                key={stat.label} 
                                style={{
                                    ...styles.statCard,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div style={{...styles.statIconWrapper, background: `${stat.color}20`, borderColor: `${stat.color}40`}}>
                                    <span style={styles.statIcon}>{stat.icon}</span>
                                </div>
                                <div style={styles.statInfo}>
                                    <span style={{...styles.statValue, color: stat.color}}>
                                        {loading ? '...' : stat.value}
                                    </span>
                                    <span style={styles.statLabel}>{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section style={styles.actionsSection}>
                    <h2 style={styles.sectionTitle}>Quick Actions</h2>
                    <div style={styles.actionsGrid}>
                        {quickActions.map((action, index) => (
                            <div
                                key={action.title}
                                onClick={() => navigate(action.path)}
                                style={{
                                    ...styles.actionCard,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div style={{...styles.actionHeader, background: action.gradient}}>
                                    <span style={styles.actionIcon}>{action.icon}</span>
                                    {action.stat !== undefined && (
                                        <span style={styles.actionStat}>{action.stat}</span>
                                    )}
                                </div>
                                <div style={styles.actionBody}>
                                    <h3 style={styles.actionTitle}>{action.title}</h3>
                                    <p style={styles.actionDesc}>{action.desc}</p>
                                    <span style={styles.actionArrow}>View →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tips Section */}
                <section style={styles.tipsSection}>
                    <div style={styles.tipCard}>
                        <div style={styles.tipContent}>
                            <div style={styles.tipBadge}>💡 Business Tip</div>
                            <h3 style={styles.tipTitle}>Boost Your Sales</h3>
                            <p style={styles.tipText}>
                                Keep your product listings updated with accurate descriptions and competitive pricing. 
                                High-quality product images can increase conversion rates by up to 40%!
                            </p>
                        </div>
                        <div style={styles.tipActions}>
                            <button 
                                onClick={() => navigate('/vendor/products')} 
                                style={styles.tipBtn}
                            >
                                Update Products
                            </button>
                        </div>
                    </div>
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
        position: 'relative',
        overflow: 'hidden'
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
        right: '-20%',
        width: '80%',
        height: '80%',
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
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    navBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        cursor: 'pointer'
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
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
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
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.25rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '10px',
        color: '#ff5252',
        fontSize: '0.9rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    logoutIcon: {
        fontSize: '1rem'
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    welcomeSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2.5rem 3rem',
        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))',
        borderRadius: '24px',
        border: '1px solid rgba(240, 147, 251, 0.2)',
        marginBottom: '2.5rem',
        animation: 'fadeInUp 0.6s ease-out'
    },
    welcomeContent: {
        maxWidth: '600px'
    },
    greetingLabel: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '0.5rem',
        display: 'block'
    },
    welcomeTitle: {
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        marginBottom: '0.75rem'
    },
    userName: {
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    welcomeDesc: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.5,
        marginBottom: '1.25rem'
    },
    membershipBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.7)'
    },
    membershipIcon: {
        fontSize: '1rem'
    },
    welcomeVisual: {
        display: 'flex',
        alignItems: 'center'
    },
    categoryBadge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '2rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)'
    },
    categoryEmoji: {
        fontSize: '3.5rem'
    },
    categoryName: {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.8)'
    },
    statsSection: {
        marginBottom: '2.5rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '1.25rem'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    statIconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid'
    },
    statIcon: {
        fontSize: '1.5rem'
    },
    statInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: 700
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)'
    },
    actionsSection: {
        marginBottom: '2.5rem'
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.25rem'
    },
    actionCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    actionHeader: {
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    actionIcon: {
        fontSize: '2rem'
    },
    actionStat: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#fff'
    },
    actionBody: {
        padding: '1.25rem 1.5rem 1.5rem',
        background: 'rgba(0,0,0,0.3)'
    },
    actionTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.25rem'
    },
    actionDesc: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '0.75rem'
    },
    actionArrow: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.4)'
    },
    tipsSection: {
        marginTop: '1rem'
    },
    tipCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
        borderRadius: '20px',
        border: '1px solid rgba(102, 126, 234, 0.2)'
    },
    tipContent: {
        flex: 1
    },
    tipBadge: {
        display: 'inline-block',
        padding: '0.35rem 0.85rem',
        background: 'rgba(102, 126, 234, 0.2)',
        borderRadius: '20px',
        fontSize: '0.8rem',
        color: '#667eea',
        marginBottom: '0.75rem'
    },
    tipTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.5rem'
    },
    tipText: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.5
    },
    tipActions: {
        flexShrink: 0
    },
    tipBtn: {
        padding: '0.85rem 1.75rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.3s ease'
    }
};

export default VendorDashboard;
