import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVendors: 0,
        totalOrders: 0,
        pendingRequests: 0,
        totalProducts: 0
    });
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
                const data = await adminApi.getStats();
                setStats(data);
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

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#667eea', trend: '+12%' },
        { label: 'Active Vendors', value: stats.totalVendors, icon: '🏪', color: '#f093fb', trend: '+8%' },
        { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#4facfe', trend: '+15%' },
        { label: 'Orders', value: stats.totalOrders, icon: '🛒', color: '#43e97b', trend: '+23%' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: '⏳', color: '#f5576c', trend: 'Action needed' }
    ];

    const managementCards = [
        {
            title: 'User Management',
            icon: '👤',
            desc: 'View and manage all registered users',
            path: '/admin/users',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            stat: stats.totalUsers,
            statLabel: 'users'
        },
        {
            title: 'Vendor Management',
            icon: '🏪',
            desc: 'Manage vendor accounts and memberships',
            path: '/admin/maintenance',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            stat: stats.totalVendors,
            statLabel: 'vendors'
        },
        {
            title: 'Membership Control',
            icon: '⭐',
            desc: 'Set vendor membership durations',
            path: '/admin/membership',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: 'Order Tracking',
            icon: '📦',
            desc: 'Monitor and update order statuses',
            path: '/admin/maintenance',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            stat: stats.totalOrders,
            statLabel: 'orders'
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
                    <span style={styles.roleTag}>Admin</span>
                </Link>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/admin')} style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Dashboard</button>
                    <button onClick={() => navigate('/admin/maintenance')} style={styles.navLink}>Maintenance</button>
                    <button onClick={() => navigate('/admin/membership')} style={styles.navLink}>Memberships</button>
                    <button onClick={() => navigate('/admin/users')} style={styles.navLink}>Users</button>
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
                        <span style={styles.greetingLabel}>{greeting} 👑</span>
                        <h1 style={styles.welcomeTitle}>
                            Admin Console
                        </h1>
                        <p style={styles.welcomeDesc}>
                            Full platform oversight and control. Manage users, vendors, and system operations.
                        </p>
                    </div>
                    <div style={styles.welcomeVisual}>
                        <div style={styles.liveIndicator}>
                            <span style={styles.liveDot} />
                            <span style={styles.liveText}>System Online</span>
                        </div>
                    </div>
                </section>

                {/* Stats Overview */}
                <section style={styles.statsSection}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Platform Overview</h2>
                        <span style={styles.lastUpdated}>Last updated: Just now</span>
                    </div>
                    <div style={styles.statsGrid}>
                        {statCards.map((stat, index) => (
                            <div 
                                key={stat.label} 
                                style={{
                                    ...styles.statCard,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div style={styles.statTop}>
                                    <div style={{...styles.statIconWrapper, background: `${stat.color}15`, borderColor: `${stat.color}30`}}>
                                        <span style={styles.statIcon}>{stat.icon}</span>
                                    </div>
                                    <span style={{
                                        ...styles.trend,
                                        color: stat.trend.includes('+') ? '#43e97b' : stat.color
                                    }}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div style={styles.statBottom}>
                                    <span style={{...styles.statValue, color: stat.color}}>
                                        {loading ? '...' : stat.value.toLocaleString()}
                                    </span>
                                    <span style={styles.statLabel}>{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Management Grid */}
                <section style={styles.managementSection}>
                    <h2 style={styles.sectionTitle}>Management Console</h2>
                    <div style={styles.managementGrid}>
                        {managementCards.map((card, index) => (
                            <div
                                key={card.title}
                                onClick={() => navigate(card.path)}
                                style={{
                                    ...styles.managementCard,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div style={{...styles.cardHeader, background: card.gradient}}>
                                    <span style={styles.cardIcon}>{card.icon}</span>
                                    {card.stat !== undefined && (
                                        <div style={styles.cardStat}>
                                            <span style={styles.cardStatValue}>{card.stat}</span>
                                            <span style={styles.cardStatLabel}>{card.statLabel}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={styles.cardBody}>
                                    <h3 style={styles.cardTitle}>{card.title}</h3>
                                    <p style={styles.cardDesc}>{card.desc}</p>
                                    <span style={styles.cardAction}>Manage →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions Bar */}
                <section style={styles.quickActionsSection}>
                    <div style={styles.quickActionsCard}>
                        <div style={styles.quickActionsLeft}>
                            <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
                            <p style={styles.quickActionsDesc}>Common administrative tasks</p>
                        </div>
                        <div style={styles.quickActionsButtons}>
                            <button onClick={() => navigate('/admin/users')} style={styles.quickActionBtn}>
                                <span>👥</span> View Users
                            </button>
                            <button onClick={() => navigate('/admin/membership')} style={styles.quickActionBtn}>
                                <span>⭐</span> Memberships
                            </button>
                            <button onClick={() => navigate('/admin/maintenance')} style={styles.quickActionBtn}>
                                <span>🔧</span> Maintenance
                            </button>
                        </div>
                    </div>
                </section>

                {/* System Status */}
                <section style={styles.statusSection}>
                    <div style={styles.statusCard}>
                        <div style={styles.statusHeader}>
                            <h3 style={styles.statusTitle}>System Health</h3>
                            <span style={styles.statusBadge}>All Systems Operational</span>
                        </div>
                        <div style={styles.statusGrid}>
                            {[
                                { name: 'API Server', status: 'Operational', icon: '🟢' },
                                { name: 'Database', status: 'Connected', icon: '🟢' },
                                { name: 'File Storage', status: 'Active', icon: '🟢' },
                                { name: 'Auth Service', status: 'Secure', icon: '🟢' }
                            ].map(service => (
                                <div key={service.name} style={styles.statusItem}>
                                    <span style={styles.statusIcon}>{service.icon}</span>
                                    <div style={styles.statusInfo}>
                                        <span style={styles.serviceName}>{service.name}</span>
                                        <span style={styles.serviceStatus}>{service.status}</span>
                                    </div>
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
        top: '-40%',
        left: '-20%',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(ellipse at center, rgba(79, 172, 254, 0.08) 0%, transparent 60%)',
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
        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: '#000',
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
        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1))',
        borderRadius: '24px',
        border: '1px solid rgba(79, 172, 254, 0.2)',
        marginBottom: '2rem',
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
        marginBottom: '0.75rem',
        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    welcomeDesc: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.5
    },
    welcomeVisual: {
        display: 'flex',
        alignItems: 'center'
    },
    liveIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        background: 'rgba(67, 233, 123, 0.1)',
        border: '1px solid rgba(67, 233, 123, 0.3)',
        borderRadius: '12px'
    },
    liveDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#43e97b',
        animation: 'pulse 2s infinite'
    },
    liveText: {
        fontSize: '0.9rem',
        color: '#43e97b',
        fontWeight: 500
    },
    statsSection: {
        marginBottom: '2.5rem'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#fff'
    },
    lastUpdated: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.4)'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
    },
    statCard: {
        padding: '1.25rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    statTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
    },
    statIconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid'
    },
    statIcon: {
        fontSize: '1.25rem'
    },
    trend: {
        fontSize: '0.75rem',
        fontWeight: 500
    },
    statBottom: {
        display: 'flex',
        flexDirection: 'column'
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: 700,
        lineHeight: 1.2
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)'
    },
    managementSection: {
        marginBottom: '2rem'
    },
    managementGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
    },
    managementCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    cardHeader: {
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    cardIcon: {
        fontSize: '2.5rem'
    },
    cardStat: {
        textAlign: 'right'
    },
    cardStatValue: {
        display: 'block',
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#fff'
    },
    cardStatLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.7)'
    },
    cardBody: {
        padding: '1.25rem 1.5rem 1.5rem',
        background: 'rgba(0,0,0,0.3)'
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.3rem'
    },
    cardDesc: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '0.75rem'
    },
    cardAction: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.4)',
        transition: 'color 0.3s ease'
    },
    quickActionsSection: {
        marginBottom: '2rem'
    },
    quickActionsCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)'
    },
    quickActionsLeft: {
        
    },
    quickActionsTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.25rem'
    },
    quickActionsDesc: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.5)'
    },
    quickActionsButtons: {
        display: 'flex',
        gap: '0.75rem'
    },
    quickActionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.25rem',
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '10px',
        color: '#667eea',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    statusSection: {
        
    },
    statusCard: {
        padding: '1.5rem 2rem',
        background: 'rgba(67, 233, 123, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(67, 233, 123, 0.15)'
    },
    statusHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem'
    },
    statusTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff'
    },
    statusBadge: {
        padding: '0.35rem 0.85rem',
        background: 'rgba(67, 233, 123, 0.15)',
        borderRadius: '20px',
        fontSize: '0.8rem',
        color: '#43e97b'
    },
    statusGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
    },
    statusItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '10px'
    },
    statusIcon: {
        fontSize: '1.25rem'
    },
    statusInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    serviceName: {
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#fff'
    },
    serviceStatus: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)'
    }
};

export default AdminDashboard;
