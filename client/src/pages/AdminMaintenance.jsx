import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminMaintenance = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('vendors');
    const [vendors, setVendors] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'vendors') {
                const data = await adminApi.getVendors();
                setVendors(data);
            } else if (activeTab === 'users') {
                const data = await adminApi.getUsers();
                setUsers(data);
            } else if (activeTab === 'orders') {
                const data = await adminApi.getOrders();
                setOrders(data);
            } else if (activeTab === 'requests') {
                const data = await adminApi.getRequests();
                setRequests(data);
            }
        } catch (err) {
            console.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVendor = async (id) => {
        if (window.confirm('Delete this vendor and all their products?')) {
            try {
                await adminApi.deleteVendor(id);
                loadData();
            } catch (err) {
                alert('Failed to delete vendor');
            }
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user?')) {
            try {
                await adminApi.deleteUser(id);
                loadData();
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await adminApi.updateOrderStatus(id, status);
            loadData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleRequest = async (id, status) => {
        try {
            await adminApi.updateRequest(id, status);
            loadData();
        } catch (err) {
            alert('Failed to update request');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const tabs = [
        { id: 'vendors', label: 'Vendors', icon: '🏪', count: vendors.length },
        { id: 'users', label: 'Users', icon: '👥', count: users.length },
        { id: 'orders', label: 'Orders', icon: '📦', count: orders.length },
        { id: 'requests', label: 'Requests', icon: '📋', count: requests.length }
    ];

    const statusColors = {
        'pending': { bg: 'rgba(240, 147, 251, 0.15)', color: '#f093fb' },
        'confirmed': { bg: 'rgba(79, 172, 254, 0.15)', color: '#4facfe' },
        'processing': { bg: 'rgba(102, 126, 234, 0.15)', color: '#667eea' },
        'shipped': { bg: 'rgba(79, 172, 254, 0.15)', color: '#4facfe' },
        'delivered': { bg: 'rgba(67, 233, 123, 0.15)', color: '#43e97b' },
        'cancelled': { bg: 'rgba(255, 82, 82, 0.15)', color: '#ff5252' },
        'approved': { bg: 'rgba(67, 233, 123, 0.15)', color: '#43e97b' },
        'rejected': { bg: 'rgba(255, 82, 82, 0.15)', color: '#ff5252' },
        'active': { bg: 'rgba(67, 233, 123, 0.15)', color: '#43e97b' },
        'inactive': { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255,255,255,0.5)' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                    <span style={styles.roleTag}>Admin</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/admin')} style={styles.navLink}>Dashboard</button>
                    <button onClick={() => navigate('/admin/maintenance')} style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Maintenance</button>
                    <button onClick={() => navigate('/admin/membership')} style={styles.navLink}>Memberships</button>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout →</button>
            </nav>

            <main style={styles.main}>
                {/* Header */}
                <section style={styles.header}>
                    <h1 style={styles.title}>Platform Maintenance</h1>
                    <p style={styles.subtitle}>Manage vendors, users, orders, and requests</p>
                </section>

                {/* Tabs */}
                <div style={styles.tabsContainer}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tab,
                                background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.03)',
                                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)'
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            <span style={{
                                ...styles.tabCount,
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                            }}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <section style={styles.content}>
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner} />
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Vendors Tab */}
                            {activeTab === 'vendors' && (
                                <div style={styles.grid}>
                                    {vendors.map((vendor, i) => (
                                        <div key={vendor._id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.userAvatar}>🏪</div>
                                                <div style={styles.userInfo}>
                                                    <h4 style={styles.userName}>{vendor.name}</h4>
                                                    <p style={styles.userEmail}>{vendor.email}</p>
                                                </div>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <div style={styles.infoRow}>
                                                    <span style={styles.infoLabel}>Category</span>
                                                    <span style={styles.infoValue}>{vendor.category}</span>
                                                </div>
                                                <div style={styles.infoRow}>
                                                    <span style={styles.infoLabel}>Membership</span>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        ...statusColors[vendor.membershipStatus]
                                                    }}>{vendor.membershipStatus}</span>
                                                </div>
                                            </div>
                                            <div style={styles.cardActions}>
                                                <button onClick={() => navigate('/admin/membership')} style={styles.editBtn}>Edit Membership</button>
                                                <button onClick={() => handleDeleteVendor(vendor._id)} style={styles.deleteBtn}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div style={styles.grid}>
                                    {users.map((user, i) => (
                                        <div key={user._id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.userAvatar}>👤</div>
                                                <div style={styles.userInfo}>
                                                    <h4 style={styles.userName}>{user.name}</h4>
                                                    <p style={styles.userEmail}>{user.email}</p>
                                                </div>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <div style={styles.infoRow}>
                                                    <span style={styles.infoLabel}>Joined</span>
                                                    <span style={styles.infoValue}>
                                                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={styles.cardActions}>
                                                <button onClick={() => handleDeleteUser(user._id)} style={styles.deleteBtn}>Delete User</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div style={styles.ordersList}>
                                    {orders.map((order, i) => (
                                        <div key={order._id} style={{...styles.orderCard, animationDelay: `${i * 0.05}s`}}>
                                            <div style={styles.orderHeader}>
                                                <div>
                                                    <span style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                                                    <span style={styles.orderDate}>
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                                    </span>
                                                </div>
                                                <span style={{...styles.statusBadge, ...statusColors[order.status]}}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div style={styles.orderBody}>
                                                <div style={styles.orderItems}>
                                                    {order.items?.slice(0, 2).map((item, i) => (
                                                        <span key={i} style={styles.orderItem}>{item.name} ×{item.quantity}</span>
                                                    ))}
                                                    {order.items?.length > 2 && <span style={styles.moreItems}>+{order.items.length - 2} more</span>}
                                                </div>
                                                <span style={styles.orderTotal}>₹{order.totalAmount?.toLocaleString()}</span>
                                            </div>
                                            <div style={styles.orderActions}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                    style={styles.statusSelect}
                                                >
                                                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Requests Tab */}
                            {activeTab === 'requests' && (
                                <div style={styles.grid}>
                                    {requests.map((req, i) => (
                                        <div key={req._id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.userAvatar}>📋</div>
                                                <div style={styles.userInfo}>
                                                    <h4 style={styles.userName}>{req.itemName}</h4>
                                                    <p style={styles.userEmail}>by {req.vendorId?.name || 'Vendor'}</p>
                                                </div>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <p style={styles.requestDesc}>{req.description}</p>
                                                <span style={{...styles.statusBadge, ...statusColors[req.status]}}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            {req.status === 'pending' && (
                                                <div style={styles.cardActions}>
                                                    <button onClick={() => handleRequest(req._id, 'approved')} style={styles.approveBtn}>Approve</button>
                                                    <button onClick={() => handleRequest(req._id, 'rejected')} style={styles.rejectBtn}>Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', position: 'relative' },
    bgPattern: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 0 },
    bgGlow: { position: 'fixed', top: '-30%', right: '-20%', width: '70%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 },
    nav: { position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    navBrand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    logoIcon: { fontSize: '1.5rem' },
    logoText: { fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    roleTag: { padding: '0.25rem 0.75rem', background: 'linear-gradient(135deg, #4facfe, #00f2fe)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, color: '#000', textTransform: 'uppercase' },
    navLinks: { display: 'flex', gap: '0.5rem' },
    navLink: { padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
    logoutBtn: { padding: '0.6rem 1.25rem', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)', borderRadius: '10px', color: '#ff5252', fontSize: '0.9rem', cursor: 'pointer' },
    main: { position: 'relative', zIndex: 1, padding: '2rem 3rem 4rem', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.25rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' },
    tabsContainer: { display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' },
    tab: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.3s ease' },
    tabCount: { padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' },
    content: {},
    loadingState: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem', color: 'rgba(255,255,255,0.6)' },
    spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' },
    card: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', animation: 'fadeInUp 0.5s ease-out both' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    userAvatar: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
    userInfo: { flex: 1 },
    userName: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.1rem' },
    userEmail: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    cardBody: { padding: '1.25rem' },
    infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
    infoLabel: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' },
    infoValue: { fontSize: '0.9rem', color: '#fff' },
    statusBadge: { padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize' },
    requestDesc: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', lineHeight: 1.5 },
    cardActions: { display: 'flex', gap: '0.5rem', padding: '0 1.25rem 1.25rem' },
    editBtn: { flex: 1, padding: '0.6rem', background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', color: '#667eea', fontSize: '0.85rem', cursor: 'pointer' },
    deleteBtn: { flex: 1, padding: '0.6rem', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)', borderRadius: '8px', color: '#ff5252', fontSize: '0.85rem', cursor: 'pointer' },
    approveBtn: { flex: 1, padding: '0.6rem', background: 'rgba(67, 233, 123, 0.1)', border: '1px solid rgba(67, 233, 123, 0.3)', borderRadius: '8px', color: '#43e97b', fontSize: '0.85rem', cursor: 'pointer' },
    rejectBtn: { flex: 1, padding: '0.6rem', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)', borderRadius: '8px', color: '#ff5252', fontSize: '0.85rem', cursor: 'pointer' },
    ordersList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    orderCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', animation: 'fadeInUp 0.5s ease-out both' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    orderId: { fontSize: '1rem', fontWeight: 600, fontFamily: 'monospace', marginRight: '1rem' },
    orderDate: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    orderBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' },
    orderItems: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
    orderItem: { padding: '0.25rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem' },
    moreItems: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' },
    orderTotal: { fontSize: '1.25rem', fontWeight: 700, color: '#43e97b' },
    orderActions: { padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' },
    statusSelect: { padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }
};

export default AdminMaintenance;
