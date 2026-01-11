import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VendorProductStatus = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [productData, statusData] = await Promise.all([vendorApi.getProducts(), vendorApi.getProductStatus()]);
            setProducts(productData);
            setStats({ total: statusData.total || productData.length, active: statusData.active || 0, pending: statusData.pending || 0 });
        } catch (err) { console.error('Failed'); }
        finally { setLoading(false); }
    };

    const getCategoryEmoji = () => ({ 'Catering': '🍽️', 'Florist': '💐', 'Decoration': '🎨', 'Lighting': '💡' }[user?.category] || '📦');

    const filteredProducts = filter === 'all' ? products : products.filter(p => p.status === filter);

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <span>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                    <span style={styles.roleTag}>Vendor</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/vendor')} style={styles.navLink}>Dashboard</button>
                    <button onClick={() => navigate('/vendor/products')} style={styles.navLink}>Products</button>
                    <button style={{...styles.navLink, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}>Status</button>
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout →</button>
            </nav>

            <main style={styles.main}>
                <h1 style={styles.title}>Product Status</h1>
                <p style={styles.subtitle}>Track status of all your products</p>

                <section style={styles.statsRow}>
                    <div style={{...styles.statCard, cursor: 'pointer'}} onClick={() => setFilter('all')}>
                        <span style={styles.statIcon}>{getCategoryEmoji()}</span>
                        <span style={styles.statValue}>{stats.total}</span>
                        <span style={styles.statLabel}>Total</span>
                    </div>
                    <div style={{...styles.statCard, cursor: 'pointer'}} onClick={() => setFilter('active')}>
                        <span style={styles.statIcon}>✅</span>
                        <span style={{...styles.statValue, color: '#43e97b'}}>{stats.active}</span>
                        <span style={styles.statLabel}>Active</span>
                    </div>
                    <div style={{...styles.statCard, cursor: 'pointer'}} onClick={() => setFilter('pending')}>
                        <span style={styles.statIcon}>⏳</span>
                        <span style={{...styles.statValue, color: '#f093fb'}}>{stats.pending}</span>
                        <span style={styles.statLabel}>Pending</span>
                    </div>
                </section>

                <div style={styles.filterRow}>
                    {['all', 'active', 'pending', 'deleted'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{...styles.filterBtn, background: filter === f ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.03)', color: filter === f ? '#fff' : 'rgba(255,255,255,0.6)'}}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                    ))}
                </div>

                {loading ? <div style={styles.spinner} /> : filteredProducts.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>📦</span>
                        <h3>No {filter !== 'all' ? filter : ''} products</h3>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredProducts.map((p, i) => (
                            <div key={p._id} style={{...styles.productCard, animationDelay: `${i * 0.05}s`}}>
                                <div style={styles.productImage}>{p.image ? <img src={p.image} alt={p.name} style={styles.image} /> : <span>{getCategoryEmoji()}</span>}</div>
                                <div style={styles.productInfo}>
                                    <h4>{p.name}</h4>
                                    <p style={styles.productPrice}>₹{p.price}</p>
                                    <span style={{...styles.statusBadge, background: p.status === 'active' ? 'rgba(67,233,123,0.15)' : p.status === 'pending' ? 'rgba(240,147,251,0.15)' : 'rgba(255,82,82,0.15)', color: p.status === 'active' ? '#43e97b' : p.status === 'pending' ? '#f093fb' : '#ff5252'}}>{p.status}</span>
                                </div>
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
    roleTag: { padding: '0.25rem 0.75rem', background: 'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, color: '#fff' },
    navLinks: { display: 'flex', gap: '0.5rem' },
    navLink: { padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
    logoutBtn: { padding: '0.6rem 1.25rem', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '10px', color: '#ff5252', cursor: 'pointer' },
    main: { position: 'relative', zIndex: 1, padding: '2rem 3rem 4rem', maxWidth: '1400px', margin: '0 auto' },
    title: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' },
    statsRow: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
    statCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' },
    statIcon: { fontSize: '1.5rem' },
    statValue: { fontSize: '1.5rem', fontWeight: 700, color: '#667eea' },
    statLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    filterRow: { display: 'flex', gap: '0.5rem', marginBottom: '2rem' },
    filterBtn: { padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' },
    spinner: { width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '2rem auto' },
    emptyState: { textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' },
    emptyIcon: { fontSize: '4rem', display: 'block', marginBottom: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' },
    productCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', animation: 'fadeInUp 0.5s ease-out both' },
    productImage: { height: '140px', background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    productInfo: { padding: '1rem' },
    productPrice: { color: '#43e97b', fontWeight: 600, marginBottom: '0.5rem' },
    statusBadge: { padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'capitalize' }
};

export default VendorProductStatus;
