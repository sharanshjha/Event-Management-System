import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();
    const [showVendorDropdown, setShowVendorDropdown] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) setGreeting('Good Morning');
            else if (hour < 17) setGreeting('Good Afternoon');
            else setGreeting('Good Evening');
            
            setCurrentTime(new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            }));
        };
        updateGreeting();
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const categories = [
        { name: 'Catering', icon: '🍽️', desc: 'Culinary services', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Florist', icon: '💐', desc: 'Floral arrangements', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { name: 'Decoration', icon: '🎨', desc: 'Event décor', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Lighting', icon: '💡', desc: 'Ambient lighting', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
    ];

    const quickActions = [
        { 
            title: 'Shopping Cart', 
            icon: '🛒', 
            desc: `${getItemCount()} items`, 
            path: '/user/cart',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            badge: getItemCount() > 0 ? getItemCount() : null
        },
        { 
            title: 'Guest List', 
            icon: '📋', 
            desc: 'Manage invites', 
            path: '/user/guest-list',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        { 
            title: 'Order Status', 
            icon: '📦', 
            desc: 'Track orders', 
            path: '/user/order-status',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
    ];

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
                    <span style={styles.roleTag}>User</span>
                </Link>
                <div style={styles.navRight}>
                    <span style={styles.timeDisplay}>{currentTime}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <span>Logout</span>
                        <span style={styles.logoutIcon}>→</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Welcome Section */}
                <section style={styles.welcomeSection}>
                    <div style={styles.welcomeContent}>
                        <span style={styles.greetingLabel}>{greeting} ✨</span>
                        <h1 style={styles.welcomeTitle}>
                            Welcome back, <span style={styles.userName}>{user?.name || 'User'}</span>
                        </h1>
                        <p style={styles.welcomeDesc}>
                            Explore premium vendors, manage your event, and create unforgettable experiences.
                        </p>
                    </div>
                    <div style={styles.welcomeVisual}>
                        <div style={styles.statsCard}>
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{getItemCount()}</span>
                                <span style={styles.statLabel}>Cart Items</span>
                            </div>
                            <div style={styles.statDivider} />
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>4</span>
                                <span style={styles.statLabel}>Categories</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vendor Categories */}
                <section style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Explore Vendors</h2>
                        <p style={styles.sectionDesc}>Choose a category to browse premium service providers</p>
                    </div>
                    <div style={styles.categoriesGrid}>
                        {categories.map((cat, index) => (
                            <div
                                key={cat.name}
                                onClick={() => navigate(`/user/vendor/${cat.name}`)}
                                style={{
                                    ...styles.categoryCard,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div style={{...styles.categoryIconWrapper, background: cat.gradient}}>
                                    <span style={styles.categoryIcon}>{cat.icon}</span>
                                </div>
                                <div style={styles.categoryInfo}>
                                    <h3 style={styles.categoryName}>{cat.name}</h3>
                                    <p style={styles.categoryDesc}>{cat.desc}</p>
                                </div>
                                <span style={styles.categoryArrow}>→</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Quick Actions</h2>
                        <p style={styles.sectionDesc}>Access frequently used features</p>
                    </div>
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
                                <div style={{...styles.actionIconWrapper, background: action.gradient}}>
                                    <span style={styles.actionIcon}>{action.icon}</span>
                                    {action.badge && (
                                        <span style={styles.actionBadge}>{action.badge}</span>
                                    )}
                                </div>
                                <div style={styles.actionInfo}>
                                    <h4 style={styles.actionTitle}>{action.title}</h4>
                                    <p style={styles.actionDesc}>{action.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Event Planning Tips */}
                <section style={styles.tipsSection}>
                    <div style={styles.tipCard}>
                        <div style={styles.tipBadge}>💡 Pro Tip</div>
                        <h3 style={styles.tipTitle}>Plan Your Perfect Event</h3>
                        <p style={styles.tipText}>
                            Start by exploring vendor categories, add items to your cart, and proceed to checkout. 
                            Track your orders in real-time and manage your guest list all in one place!
                        </p>
                        <div style={styles.tipSteps}>
                            {['Browse Vendors', 'Add to Cart', 'Checkout', 'Track Orders'].map((step, i) => (
                                <div key={step} style={styles.tipStep}>
                                    <span style={styles.tipStepNum}>{i + 1}</span>
                                    <span style={styles.tipStepText}>{step}</span>
                                </div>
                            ))}
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
        top: '-50%',
        left: '-25%',
        width: '150%',
        height: '100%',
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
        background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    timeDisplay: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'monospace'
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
        padding: '3rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '24px',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        marginBottom: '3rem',
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
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        marginBottom: '1rem'
    },
    userName: {
        background: 'linear-gradient(135deg, #667eea, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    welcomeDesc: {
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.5
    },
    welcomeVisual: {
        display: 'flex',
        alignItems: 'center'
    },
    statsCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '1.5rem 2.5rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)'
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem'
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    statLabel: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    statDivider: {
        width: '1px',
        height: '40px',
        background: 'rgba(255,255,255,0.1)'
    },
    section: {
        marginBottom: '3rem'
    },
    sectionHeader: {
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '0.25rem'
    },
    sectionDesc: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.5)'
    },
    categoriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
    },
    categoryCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    categoryIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    categoryIcon: {
        fontSize: '1.75rem'
    },
    categoryInfo: {
        flex: 1
    },
    categoryName: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.2rem'
    },
    categoryDesc: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)'
    },
    categoryArrow: {
        fontSize: '1.25rem',
        color: 'rgba(255,255,255,0.3)',
        transition: 'all 0.3s ease'
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
    },
    actionCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    actionIconWrapper: {
        position: 'relative',
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
    },
    actionIcon: {
        fontSize: '2rem'
    },
    actionBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '24px',
        height: '24px',
        background: '#ff5252',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 700
    },
    actionInfo: {
        
    },
    actionTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.25rem'
    },
    actionDesc: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)'
    },
    tipsSection: {
        marginTop: '2rem'
    },
    tipCard: {
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.08), rgba(56, 249, 215, 0.08))',
        borderRadius: '20px',
        border: '1px solid rgba(67, 233, 123, 0.2)'
    },
    tipBadge: {
        display: 'inline-block',
        padding: '0.35rem 0.85rem',
        background: 'rgba(67, 233, 123, 0.2)',
        borderRadius: '20px',
        fontSize: '0.8rem',
        color: '#43e97b',
        marginBottom: '1rem'
    },
    tipTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.75rem'
    },
    tipText: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.6,
        marginBottom: '1.5rem'
    },
    tipSteps: {
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap'
    },
    tipStep: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    tipStepNum: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'rgba(67, 233, 123, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#43e97b'
    },
    tipStepText: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.7)'
    }
};

export default UserDashboard;
