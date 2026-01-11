import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminUserManagement = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [usersData, vendorsData] = await Promise.all([adminApi.getUsers(), adminApi.getVendors()]);
            setUsers(usersData);
            setVendors(vendorsData);
        } catch (err) { console.error('Failed'); }
        finally { setLoading(false); }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user?')) {
            try { await adminApi.deleteUser(id); loadData(); }
            catch (err) { alert('Failed'); }
        }
    };

    const handleDeleteVendor = async (id) => {
        if (window.confirm('Delete this vendor and all products?')) {
            try { await adminApi.deleteVendor(id); loadData(); }
            catch (err) { alert('Failed'); }
        }
    };

    const getCategoryEmoji = (cat) => ({ 'Catering': '🍽️', 'Florist': '💐', 'Decoration': '🎨', 'Lighting': '💡' }[cat] || '🏪');

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <span>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                    <span style={styles.roleTag}>Admin</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/admin')} style={styles.navLink}>Dashboard</button>
                    <button onClick={() => navigate('/admin/maintenance')} style={styles.navLink}>Maintenance</button>
                    <button style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Users</button>
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout →</button>
            </nav>

            <main style={styles.main}>
                <h1 style={styles.title}>User Management</h1>
                <p style={styles.subtitle}>Manage platform users and vendors</p>

                <section style={styles.statsRow}>
                    <div style={styles.statCard}><span>👥</span><span style={styles.statValue}>{users.length}</span><span style={styles.statLabel}>Users</span></div>
                    <div style={styles.statCard}><span>🏪</span><span style={{...styles.statValue, color: '#f093fb'}}>{vendors.length}</span><span style={styles.statLabel}>Vendors</span></div>
                </section>

                <div style={styles.tabs}>
                    <button onClick={() => setActiveTab('users')} style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}}>👥 Users ({users.length})</button>
                    <button onClick={() => setActiveTab('vendors')} style={{...styles.tab, ...(activeTab === 'vendors' ? styles.activeTab : {})}}>🏪 Vendors ({vendors.length})</button>
                </div>

                {loading ? <div style={styles.spinner} /> : (
                    <div style={styles.grid}>
                        {activeTab === 'users' && users.map((u, i) => (
                            <div key={u._id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.avatar}>👤</span>
                                    <div style={styles.userInfo}><h4>{u.name}</h4><p style={styles.email}>{u.email}</p></div>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.row}><span>Role</span><span style={styles.roleBadge}>{u.role}</span></div>
                                    <div style={styles.row}><span>Joined</span><span>{new Date(u.createdAt).toLocaleDateString('en-IN')}</span></div>
                                </div>
                                <button onClick={() => handleDeleteUser(u._id)} style={styles.deleteBtn}>🗑️ Delete</button>
                            </div>
                        ))}
                        {activeTab === 'vendors' && vendors.map((v, i) => (
                            <div key={v._id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.avatar}>{getCategoryEmoji(v.category)}</span>
                                    <div style={styles.userInfo}><h4>{v.name}</h4><p style={styles.email}>{v.email}</p></div>
                                    <span style={{...styles.badge, background: v.membershipStatus === 'active' ? 'rgba(67,233,123,0.15)' : 'rgba(255,255,255,0.05)', color: v.membershipStatus === 'active' ? '#43e97b' : 'rgba(255,255,255,0.5)'}}>{v.membershipStatus}</span>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.row}><span>Category</span><span>{v.category}</span></div>
                                    <div style={styles.row}><span>Membership</span><span>{v.membershipDuration || '-'}</span></div>
                                </div>
                                <button onClick={() => handleDeleteVendor(v._id)} style={styles.deleteBtn}>🗑️ Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', position: 'relative' },
    bgPattern: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`, pointerEvents: 'none' },
    nav: { position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    navBrand: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' },
    logoText: { fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    roleTag: { padding: '0.25rem 0.75rem', background: 'linear-gradient(135deg, #4facfe, #00f2fe)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, color: '#000' },
    navLinks: { display: 'flex', gap: '0.5rem' },
    navLink: { padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
    logoutBtn: { padding: '0.6rem 1.25rem', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '10px', color: '#ff5252', cursor: 'pointer' },
    main: { position: 'relative', zIndex: 1, padding: '2rem 3rem 4rem', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' },
    statsRow: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
    statCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '1.5rem' },
    statValue: { fontWeight: 700, color: '#667eea' },
    statLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
    tab: { padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: 'none', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem' },
    activeTab: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' },
    spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '2rem auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
    card: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeInUp 0.5s ease-out both' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    avatar: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
    userInfo: { flex: 1 },
    email: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    badge: { padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'capitalize' },
    roleBadge: { padding: '0.25rem 0.6rem', background: 'rgba(102,126,234,0.15)', borderRadius: '4px', color: '#667eea', fontSize: '0.8rem', textTransform: 'capitalize' },
    cardBody: { padding: '1rem 1.25rem' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' },
    deleteBtn: { width: 'calc(100% - 2.5rem)', margin: '0 1.25rem 1.25rem', padding: '0.75rem', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '10px', color: '#ff5252', cursor: 'pointer' }
};

export default AdminUserManagement;
