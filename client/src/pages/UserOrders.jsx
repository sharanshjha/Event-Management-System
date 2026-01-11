import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserOrders = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await userApi.getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await userApi.cancelOrder(orderId);
                loadOrders();
            } catch (err) {
                alert('Failed to cancel order');
            }
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'pending': { color: '#f093fb', bg: 'rgba(240, 147, 251, 0.15)', icon: '⏳', label: 'Pending' },
            'confirmed': { color: '#4facfe', bg: 'rgba(79, 172, 254, 0.15)', icon: '✓', label: 'Confirmed' },
            'processing': { color: '#667eea', bg: 'rgba(102, 126, 234, 0.15)', icon: '⚙️', label: 'Processing' },
            'shipped': { color: '#4facfe', bg: 'rgba(79, 172, 254, 0.15)', icon: '🚚', label: 'Shipped' },
            'delivered': { color: '#43e97b', bg: 'rgba(67, 233, 123, 0.15)', icon: '✅', label: 'Delivered' },
            'cancelled': { color: '#ff5252', bg: 'rgba(255, 82, 82, 0.15)', icon: '✕', label: 'Cancelled' }
        };
        return configs[status] || configs['pending'];
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(o => o.status === filter);

    const filterOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

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
                        <span>Dashboard</span>
                    </button>
                </div>
                <div style={styles.navCenter}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </div>
                <div style={styles.navRight}>
                    <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>
                        Logout →
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Header */}
                <section style={styles.header}>
                    <div style={styles.headerContent}>
                        <h1 style={styles.title}>Order Status</h1>
                        <p style={styles.subtitle}>Track and manage your orders</p>
                    </div>
                    <div style={styles.statsRow}>
                        <div style={styles.statBadge}>
                            <span style={styles.statValue}>{orders.length}</span>
                            <span style={styles.statLabel}>Total Orders</span>
                        </div>
                        <div style={{...styles.statBadge, borderColor: 'rgba(67, 233, 123, 0.3)'}}>
                            <span style={{...styles.statValue, color: '#43e97b'}}>
                                {orders.filter(o => o.status === 'delivered').length}
                            </span>
                            <span style={styles.statLabel}>Delivered</span>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section style={styles.filterSection}>
                    <div style={styles.filterTabs}>
                        {filterOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                style={{
                                    ...styles.filterTab,
                                    background: filter === opt.value 
                                        ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                        : 'rgba(255,255,255,0.03)',
                                    color: filter === opt.value ? '#fff' : 'rgba(255,255,255,0.6)'
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Orders List */}
                <section style={styles.ordersSection}>
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner} />
                            <p>Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>📦</span>
                            <h3 style={styles.emptyTitle}>No orders found</h3>
                            <p style={styles.emptyText}>
                                {filter === 'all' 
                                    ? "You haven't placed any orders yet" 
                                    : `No ${filter} orders`}
                            </p>
                            <button onClick={() => navigate('/user')} style={styles.shopBtn}>
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div style={styles.ordersList}>
                            {filteredOrders.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);
                                return (
                                    <div 
                                        key={order._id} 
                                        style={{
                                            ...styles.orderCard,
                                            animationDelay: `${index * 0.05}s`
                                        }}
                                    >
                                        <div style={styles.orderHeader}>
                                            <div style={styles.orderInfo}>
                                                <span style={styles.orderId}>
                                                    Order #{order._id.slice(-8).toUpperCase()}
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
                                                color: statusConfig.color,
                                                borderColor: statusConfig.color
                                            }}>
                                                <span>{statusConfig.icon}</span>
                                                <span>{statusConfig.label}</span>
                                            </span>
                                        </div>

                                        <div style={styles.orderBody}>
                                            <div style={styles.itemsPreview}>
                                                {order.items?.slice(0, 3).map((item, i) => (
                                                    <div key={i} style={styles.itemPreview}>
                                                        <span style={styles.itemName}>{item.name}</span>
                                                        <span style={styles.itemQty}>×{item.quantity}</span>
                                                    </div>
                                                ))}
                                                {order.items?.length > 3 && (
                                                    <span style={styles.moreItems}>
                                                        +{order.items.length - 3} more items
                                                    </span>
                                                )}
                                            </div>

                                            <div style={styles.orderMeta}>
                                                <div style={styles.metaItem}>
                                                    <span style={styles.metaLabel}>Payment</span>
                                                    <span style={styles.metaValue}>
                                                        {order.paymentMethod === 'cash' ? '💵 COD' : '📱 UPI'}
                                                    </span>
                                                </div>
                                                <div style={styles.metaItem}>
                                                    <span style={styles.metaLabel}>Total</span>
                                                    <span style={styles.orderTotal}>
                                                        ₹{order.totalAmount?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {order.status === 'pending' && (
                                            <div style={styles.orderFooter}>
                                                <button 
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    style={styles.cancelBtn}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}

                                        {/* Progress Bar */}
                                        <div style={styles.progressBar}>
                                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((step, i) => {
                                                const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                                                const currentIndex = steps.indexOf(order.status);
                                                const isActive = i <= currentIndex && order.status !== 'cancelled';
                                                return (
                                                    <div key={step} style={styles.progressStep}>
                                                        <div style={{
                                                            ...styles.progressDot,
                                                            background: isActive ? '#43e97b' : 'rgba(255,255,255,0.1)'
                                                        }} />
                                                        {i < 4 && (
                                                            <div style={{
                                                                ...styles.progressLine,
                                                                background: i < currentIndex && order.status !== 'cancelled'
                                                                    ? '#43e97b' 
                                                                    : 'rgba(255,255,255,0.1)'
                                                            }} />
                                                        )}
                                                    </div>
                                                );
                                            })}
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
        right: '-20%',
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
    logoutBtn: {
        padding: '0.5rem 1rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '8px',
        color: '#ff5252',
        fontSize: '0.9rem',
        cursor: 'pointer'
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem 4rem',
        maxWidth: '1000px',
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
        background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.5)'
    },
    statsRow: {
        display: 'flex',
        gap: '1rem'
    },
    statBadge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px'
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#667eea'
    },
    statLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)'
    },
    filterSection: {
        marginBottom: '2rem'
    },
    filterTabs: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
    },
    filterTab: {
        padding: '0.6rem 1.25rem',
        borderRadius: '8px',
        border: 'none',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    ordersSection: {},
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
    shopBtn: {
        padding: '0.85rem 2rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer'
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    orderCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out both'
    },
    orderHeader: {
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
        border: '1px solid'
    },
    orderBody: {
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '2rem'
    },
    itemsPreview: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    itemPreview: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemName: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.8)'
    },
    itemQty: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)'
    },
    moreItems: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.4)',
        fontStyle: 'italic'
    },
    orderMeta: {
        display: 'flex',
        gap: '2rem'
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    metaLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)'
    },
    metaValue: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.8)'
    },
    orderTotal: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#43e97b'
    },
    orderFooter: {
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        padding: '0.5rem 1.25rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '8px',
        color: '#ff5252',
        fontSize: '0.85rem',
        cursor: 'pointer'
    },
    progressBar: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        background: 'rgba(255,255,255,0.02)'
    },
    progressStep: {
        display: 'flex',
        alignItems: 'center',
        flex: 1
    },
    progressDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        flexShrink: 0
    },
    progressLine: {
        flex: 1,
        height: '2px',
        marginLeft: '0.25rem'
    }
};

export default UserOrders;
