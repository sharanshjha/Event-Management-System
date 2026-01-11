import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Shared Navigation Component
 * Used across all dashboard pages with clickable logo
 */
const Navbar = ({ showCart = false, backTo = null, backLabel = 'Back' }) => {
    const { user, logout } = useAuth();
    const { getItemCount } = useCart?.() || { getItemCount: () => 0 };
    const navigate = useNavigate();
    const cartCount = showCart ? getItemCount() : 0;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardRoute = () => {
        if (!user) return '/';
        const routes = { admin: '/admin', vendor: '/vendor', user: '/user' };
        return routes[user.role] || '/';
    };

    const getRoleConfig = () => {
        const configs = {
            admin: { label: 'Admin', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#000' },
            vendor: { label: 'Vendor', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff' },
            user: { label: 'User', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#000' }
        };
        return configs[user?.role] || configs.user;
    };

    const roleConfig = getRoleConfig();

    return (
        <nav style={styles.nav}>
            <div style={styles.navLeft}>
                {backTo ? (
                    <button onClick={() => navigate(backTo)} style={styles.backBtn}>
                        <span>←</span>
                        <span>{backLabel}</span>
                    </button>
                ) : (
                    <Link to="/" style={styles.logo}>
                        <span style={styles.logoIcon}>✨</span>
                        <span style={styles.logoText}>Nexus</span>
                    </Link>
                )}
                {user && (
                    <span style={{...styles.roleTag, background: roleConfig.gradient, color: roleConfig.color}}>
                        {roleConfig.label}
                    </span>
                )}
            </div>

            <div style={styles.navCenter}>
                <Link to="/" style={styles.logoCenter}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </Link>
            </div>

            <div style={styles.navRight}>
                {showCart && (
                    <button onClick={() => navigate('/user/cart')} style={styles.cartBtn}>
                        <span>🛒</span>
                        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                    </button>
                )}
                {user && (
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout →
                    </button>
                )}
            </div>
        </nav>
    );
};

const styles = {
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
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
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
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        cursor: 'pointer'
    },
    logoCenter: {
        display: 'none', // Hidden on larger screens, shown when back button is present
        textDecoration: 'none'
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
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    navCenter: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    },
    navRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem'
    },
    cartBtn: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        fontSize: '1.25rem',
        cursor: 'pointer'
    },
    cartBadge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        minWidth: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: '#fff',
        padding: '0 4px'
    },
    logoutBtn: {
        padding: '0.6rem 1.25rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '10px',
        color: '#ff5252',
        fontSize: '0.9rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};

export default Navbar;
