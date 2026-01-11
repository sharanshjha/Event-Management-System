import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VendorTransactions = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, revenue: 0 });

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await vendorApi.getTransactions();
            setTransactions(data);
            
            // Calculate stats
            const totalOrders = data.length;
            const totalRevenue = data.reduce((sum, order) => {
                const orderItemsTotal = order.items?.reduce((itemSum, item) => 
                    itemSum + (item.price * item.quantity), 0) || 0;
                return sum + orderItemsTotal;
            }, 0);
            
            setStats({ total: totalOrders, revenue: totalRevenue });
        } catch (err) {
            console.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusConfig = (status) => {
        const configs = {
            'pending': { color: '#f093fb', bg: 'rgba(240, 147, 251, 0.15)', icon: '⏳' },
            'confirmed': { color: '#4facfe', bg: 'rgba(79, 172, 254, 0.15)', icon: '✓' },
            'processing': { color: '#667eea', bg: 'rgba(102, 126, 234, 0.15)', icon: '⚙️' },
            'shipped': { color: '#4facfe', bg: 'rgba(79, 172, 254, 0.15)', icon: '🚚' },
            'delivered': { color: '#43e97b', bg: 'rgba(67, 233, 123, 0.15)', icon: '✅' },
            'cancelled': { color: '#ff5252', bg: 'rgba(255, 82, 82, 0.15)', icon: '✕' }
        };
        return configs[status] || configs['pending'];
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
                    <button onClick={() => navigate('/vendor/products')} style={styles.navLink}>Products</button>
                    <button onClick={() => navigate('/vendor/transactions')} style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Transactions</button>
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
                        <h1 style={styles.title}>Transactions</h1>
                        <p style={styles.subtitle}>Track orders containing your products</p>
                    </div>
                </section>

                {/* Stats Cards */}
                <section style={styles.statsSection}>
                    <div style={styles.statCard}>
                        <div style={styles.statIconWrapper}>
                            <span style={styles.statIcon}>📦</span>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statValue}>{stats.total}</span>
                            <span style={styles.statLabel}>Total Orders</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIconWrapper, background: 'rgba(67, 233, 123, 0.15)'}}>
                            <span style={styles.statIcon}>💰</span>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={{...styles.statValue, color: '#43e97b'}}>
                                ₹{stats.revenue.toLocaleString()}
                            </span>
                            <span style={styles.statLabel}>Total Revenue</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIconWrapper, background: 'rgba(79, 172, 254, 0.15)'}}>
                            <span style={styles.statIcon}>📈</span>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={{...styles.statValue, color: '#4facfe'}}>
                                ₹{stats.total > 0 ? Math.round(stats.revenue / stats.total).toLocaleString() : 0}
                            </span>
                            <span style={styles.statLabel}>Avg. Order Value</span>
                        </div>
                    </div>
                </section>

                {/* Transactions List */}
                <section style={styles.transactionsSection}>
                    <h2 style={styles.sectionTitle}>Order History</h2>
                    
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner} />
                            <p>Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>📭</span>
                            <h3 style={styles.emptyTitle}>No transactions yet</h3>
                            <p style={styles.emptyText}>
                                When customers order your products, they'll appear here
                            </p>
                        </div>
                    ) : (
                        <div style={styles.transactionsList}>
                            {transactions.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);
                                const orderTotal = order.items?.reduce((sum, item) => 
                                    sum + (item.price * item.quantity), 0) || order.totalAmount;
                                
                                return (
                                    <div 
                                        key={order._id} 
                                        style={{
                                            ...styles.transactionCard,
                                            animationDelay: `${index * 0.05}s`
                                        }}
                                    >
                                        <div style={styles.cardHeader}>
                                            <div style={styles.orderInfo}>
                                                <span style={styles.orderId}>
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                                <span style={styles.orderDate}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <span style={{
                                                ...styles.statusBadge,
                                                background: statusConfig.bg,
                                                color: statusConfig.color
                                            }}>
                                                <span>{statusConfig.icon}</span>
                                                <span>{order.status}</span>
                                            </span>
                                        </div>

                                        <div style={styles.cardBody}>
                                            <div style={styles.itemsList}>
                                                {order.items?.map((item, i) => (
                                                    <div key={i} style={styles.itemRow}>
                                                        <div style={styles.itemInfo}>
                                                            <span style={styles.itemName}>{item.name}</span>
                                                            <span style={styles.itemQty}>
                                                                ₹{item.price} × {item.quantity}
                                                            </span>
                                                        </div>
                                                        <span style={styles.itemTotal}>
                                                            ₹{(item.price * item.quantity).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={styles.cardFooter}>
                                            <div style={styles.customerInfo}>
                                                <span style={styles.customerIcon}>👤</span>
                                                <span style={styles.customerName}>
                                                    {order.guestName || order.userId?.name || 'Customer'}
                                                </span>
                                            </div>
                                            <div style={styles.totalSection}>
                                                <span style={styles.totalLabel}>Order Total</span>
                                                <span style={styles.totalValue}>
                                                    ₹{orderTotal?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
        background: 'radial-gradient(ellipse at center, rgba(67, 233, 123, 0.08) 0%, transparent 60%)',
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
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        marginBottom: '2rem'
    },
    headerContent: {},
    title: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        marginBottom: '0.25rem',
        background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.5)'
    },
    statsSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)'
    },
    statIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        background: 'rgba(102, 126, 234, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)'
    },
    transactionsSection: {},
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1.25rem'
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
        color: 'rgba(255,255,255,0.5)'
    },
    transactionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    transactionCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out both'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    orderInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem'
    },
    orderId: {
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: 'monospace'
    },
    orderDate: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 500,
        textTransform: 'capitalize'
    },
    cardBody: {
        padding: '1.25rem 1.5rem'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0'
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.1rem'
    },
    itemName: {
        fontSize: '0.95rem',
        color: '#fff'
    },
    itemQty: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    itemTotal: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: '#43e97b'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
    },
    customerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    customerIcon: {
        fontSize: '1.1rem'
    },
    customerName: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.7)'
    },
    totalSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    totalLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)'
    },
    totalValue: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#43e97b'
    }
};

export default VendorTransactions;
