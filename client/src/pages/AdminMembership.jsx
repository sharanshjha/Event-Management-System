import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminMembership = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [membershipData, setMembershipData] = useState({ status: 'active', duration: '6months' });

    useEffect(() => { loadVendors(); }, []);

    const loadVendors = async () => {
        try {
            const data = await adminApi.getVendors();
            setVendors(data);
        } catch (err) { console.error('Failed'); }
        finally { setLoading(false); }
    };

    const handleUpdateMembership = async () => {
        if (!selectedVendor) return;
        try {
            await adminApi.updateMembership(selectedVendor._id, membershipData);
            setSelectedVendor(null);
            loadVendors();
        } catch (err) { alert('Failed'); }
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
                    <button style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Memberships</button>
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout →</button>
            </nav>

            <main style={styles.main}>
                <h1 style={styles.title}>Vendor Memberships</h1>
                <p style={styles.subtitle}>Manage vendor subscription status</p>

                <section style={styles.statsRow}>
                    <div style={styles.statCard}><span>🏪</span><span style={styles.statValue}>{vendors.length}</span><span style={styles.statLabel}>Total</span></div>
                    <div style={styles.statCard}><span>✅</span><span style={{...styles.statValue, color: '#43e97b'}}>{vendors.filter(v => v.membershipStatus === 'active').length}</span><span style={styles.statLabel}>Active</span></div>
                </section>

                {loading ? <div style={styles.spinner} /> : (
                    <div style={styles.grid}>
                        {vendors.map((v, i) => (
                            <div key={v._id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.avatar}>{getCategoryEmoji(v.category)}</span>
                                    <div style={styles.vendorInfo}><h4>{v.name}</h4><p style={styles.email}>{v.email}</p></div>
                                    <span style={{...styles.badge, background: v.membershipStatus === 'active' ? 'rgba(67,233,123,0.15)' : 'rgba(255,255,255,0.05)', color: v.membershipStatus === 'active' ? '#43e97b' : 'rgba(255,255,255,0.5)'}}>{v.membershipStatus}</span>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.row}><span>Category</span><span>{v.category}</span></div>
                                    <div style={styles.row}><span>Duration</span><span>{v.membershipDuration || '-'}</span></div>
                                </div>
                                <button onClick={() => { setSelectedVendor(v); setMembershipData({ status: v.membershipStatus || 'inactive', duration: v.membershipDuration || '6months' }); }} style={styles.editBtn}>⚙️ Manage</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {selectedVendor && (
                <div style={styles.overlay} onClick={() => setSelectedVendor(null)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Update Membership</h2>
                        <p style={styles.modalSub}>{selectedVendor.name}</p>
                        <div style={styles.formGroup}>
                            <label>Status</label>
                            <div style={styles.options}>{['active', 'inactive', 'cancelled'].map(s => (
                                <button key={s} onClick={() => setMembershipData({...membershipData, status: s})} style={{...styles.option, borderColor: membershipData.status === s ? '#667eea' : 'rgba(255,255,255,0.1)'}}>{s}</button>
                            ))}</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Duration</label>
                            <div style={styles.options}>{['6months', '1year', '2years'].map(d => (
                                <button key={d} onClick={() => setMembershipData({...membershipData, duration: d})} style={{...styles.option, borderColor: membershipData.duration === d ? '#43e97b' : 'rgba(255,255,255,0.1)'}}>{d}</button>
                            ))}</div>
                        </div>
                        <div style={styles.modalActions}>
                            <button onClick={() => setSelectedVendor(null)} style={styles.cancelBtn}>Cancel</button>
                            <button onClick={handleUpdateMembership} style={styles.saveBtn}>Save</button>
                        </div>
                    </div>
                </div>
            )}
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
    title: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' },
    statsRow: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
    statCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '1.5rem' },
    statValue: { fontWeight: 700, color: '#667eea' },
    statLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '2rem auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
    card: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeInUp 0.5s ease-out both' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    avatar: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
    vendorInfo: { flex: 1 },
    email: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    badge: { padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'capitalize' },
    cardBody: { padding: '1rem 1.25rem' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' },
    editBtn: { width: 'calc(100% - 2.5rem)', margin: '0 1.25rem 1.25rem', padding: '0.75rem', background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.3)', borderRadius: '10px', color: '#667eea', cursor: 'pointer' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { width: '100%', maxWidth: '400px', background: '#1a1a24', borderRadius: '20px', padding: '2rem' },
    modalTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' },
    modalSub: { color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' },
    formGroup: { marginBottom: '1.5rem' },
    options: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
    option: { flex: 1, padding: '0.75rem', border: '1px solid', borderRadius: '8px', background: 'transparent', color: '#fff', cursor: 'pointer', textTransform: 'capitalize' },
    modalActions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    cancelBtn: { flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    saveBtn: { flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer' }
};

export default AdminMembership;
