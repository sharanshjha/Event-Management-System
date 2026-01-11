import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserGuestList = () => {
    const navigate = useNavigate();
    const [guests, setGuests] = useState([]);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', relation: 'Family' });
    const [showForm, setShowForm] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return alert('Fill required fields');
        setGuests([...guests, { ...formData, id: Date.now() }]);
        setFormData({ name: '', phone: '', email: '', relation: 'Family' });
        setShowForm(false);
    };

    const handleDelete = (id) => setGuests(guests.filter(g => g.id !== id));

    const relations = ['Family', 'Friend', 'Colleague', 'Relative', 'VIP', 'Other'];

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <nav style={styles.nav}>
                <button onClick={() => navigate('/user')} style={styles.backBtn}>← Back</button>
                <div style={styles.navCenter}><span>✨</span><span style={styles.logoText}>Nexus</span></div>
                <span style={styles.guestCount}>{guests.length} guests</span>
            </nav>

            <main style={styles.main}>
                <section style={styles.header}>
                    <div><h1 style={styles.title}>Guest List</h1><p style={styles.subtitle}>Manage your event guests</p></div>
                    <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ Add Guest</button>
                </section>

                <section style={styles.statsRow}>
                    <div style={styles.statCard}><span>👥</span><span style={styles.statValue}>{guests.length}</span><span style={styles.statLabel}>Total</span></div>
                    <div style={styles.statCard}><span>👨‍👩‍👧</span><span style={{...styles.statValue, color: '#f093fb'}}>{guests.filter(g => g.relation === 'Family').length}</span><span style={styles.statLabel}>Family</span></div>
                    <div style={styles.statCard}><span>🤝</span><span style={{...styles.statValue, color: '#43e97b'}}>{guests.filter(g => g.relation === 'Friend').length}</span><span style={styles.statLabel}>Friends</span></div>
                </section>

                {guests.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>📋</span>
                        <h3>No guests yet</h3>
                        <p style={styles.emptyText}>Start adding guests to your event</p>
                        <button onClick={() => setShowForm(true)} style={styles.emptyBtn}>Add First Guest</button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {guests.map((g, i) => (
                            <div key={g.id} style={{...styles.card, animationDelay: `${i * 0.05}s`}}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.avatar}>👤</span>
                                    <div style={styles.guestInfo}><h4>{g.name}</h4><span style={styles.relation}>{g.relation}</span></div>
                                    <button onClick={() => handleDelete(g.id)} style={styles.removeBtn}>✕</button>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.row}><span>📱</span><span>{g.phone}</span></div>
                                    {g.email && <div style={styles.row}><span>📧</span><span>{g.email}</span></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showForm && (
                <div style={styles.overlay} onClick={() => setShowForm(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Add Guest</h2>
                        <form onSubmit={handleAdd}>
                            <div style={styles.formGroup}><label>Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} placeholder="Guest name" required /></div>
                            <div style={styles.formGroup}><label>Phone *</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={styles.input} placeholder="Phone number" required /></div>
                            <div style={styles.formGroup}><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={styles.input} placeholder="Email (optional)" /></div>
                            <div style={styles.formGroup}>
                                <label>Relation</label>
                                <div style={styles.relationGrid}>{relations.map(r => (
                                    <button type="button" key={r} onClick={() => setFormData({...formData, relation: r})} style={{...styles.relationBtn, borderColor: formData.relation === r ? '#667eea' : 'rgba(255,255,255,0.1)', background: formData.relation === r ? 'rgba(102,126,234,0.15)' : 'transparent'}}>{r}</button>
                                ))}</div>
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                                <button type="submit" style={styles.submitBtn}>Add Guest</button>
                            </div>
                        </form>
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
    backBtn: { padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    navCenter: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' },
    logoText: { fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    guestCount: { padding: '0.5rem 1rem', background: 'rgba(240,147,251,0.15)', borderRadius: '8px', color: '#f093fb', fontSize: '0.9rem' },
    main: { position: 'relative', zIndex: 1, padding: '2rem 3rem 4rem', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #f093fb, #f5576c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: 'rgba(255,255,255,0.5)' },
    addBtn: { padding: '0.85rem 1.5rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer' },
    statsRow: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
    statCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '1.25rem' },
    statValue: { fontWeight: 700, color: '#667eea' },
    statLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    emptyState: { textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' },
    emptyIcon: { fontSize: '4rem', display: 'block', marginBottom: '1rem' },
    emptyText: { color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' },
    emptyBtn: { padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
    card: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeInUp 0.5s ease-out both', overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    avatar: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' },
    guestInfo: { flex: 1 },
    relation: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
    removeBtn: { width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,82,82,0.1)', border: 'none', color: '#ff5252', cursor: 'pointer' },
    cardBody: { padding: '1rem' },
    row: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { width: '100%', maxWidth: '420px', background: '#1a1a24', borderRadius: '20px', padding: '2rem' },
    modalTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' },
    formGroup: { marginBottom: '1.25rem' },
    input: { width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', marginTop: '0.5rem', outline: 'none' },
    relationGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' },
    relationBtn: { padding: '0.5rem 1rem', border: '1px solid', borderRadius: '8px', background: 'transparent', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' },
    modalActions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    cancelBtn: { flex: 1, padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    submitBtn: { flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer' }
};

export default UserGuestList;
