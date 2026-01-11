import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleGoBack = () => {
        if (user) {
            const routes = { admin: '/admin', vendor: '/vendor', user: '/user' };
            navigate(routes[user.role] || '/');
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />
            
            <main style={styles.main}>
                <div style={styles.card}>
                    <div style={styles.iconContainer}>
                        <span style={styles.icon}>🚫</span>
                    </div>
                    <h1 style={styles.title}>Access Denied</h1>
                    <p style={styles.subtitle}>
                        You don't have permission to view this page
                    </p>
                    <p style={styles.description}>
                        This area is restricted to authorized users only. 
                        Please contact an administrator if you believe this is an error.
                    </p>
                    <div style={styles.actions}>
                        <button onClick={handleGoBack} style={styles.primaryBtn}>
                            ← Go to Dashboard
                        </button>
                        {user && (
                            <button onClick={() => { logout(); navigate('/login'); }} style={styles.secondaryBtn}>
                                Switch Account
                            </button>
                        )}
                    </div>
                    {user && (
                        <p style={styles.userInfo}>
                            Logged in as: <strong>{user.name}</strong> ({user.role})
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    bgPattern: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`, pointerEvents: 'none' },
    bgGlow: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(255, 82, 82, 0.1) 0%, transparent 60%)', pointerEvents: 'none' },
    main: { position: 'relative', zIndex: 1, padding: '2rem', width: '100%', maxWidth: '500px' },
    card: { background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem', textAlign: 'center' },
    iconContainer: { width: '100px', height: '100px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'rgba(255, 82, 82, 0.1)', border: '2px solid rgba(255, 82, 82, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' },
    icon: { fontSize: '3rem' },
    title: { fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #ff5252, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' },
    description: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '2rem' },
    actions: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' },
    primaryBtn: { padding: '0.85rem 1.5rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer' },
    secondaryBtn: { padding: '0.85rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    userInfo: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }
};

export default Unauthorized;
