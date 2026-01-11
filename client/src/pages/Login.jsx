import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Load remembered email
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const user = await login({ email, password });
            
            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Navigate based on role
            const routes = { admin: '/admin', vendor: '/vendor', user: '/user' };
            navigate(routes[user.role] || '/user');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = async (role) => {
        const accounts = {
            user: { email: 'user@event.com', password: 'password123' },
            vendor: { email: 'vendor@event.com', password: 'password123' },
            admin: { email: 'admin@event.com', password: 'password123' }
        };
        setEmail(accounts[role].email);
        setPassword(accounts[role].password);
    };

    const features = [
        { icon: '🎯', title: 'One Platform', desc: 'All event services in one place' },
        { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
        { icon: '⚡', title: 'Fast', desc: 'Lightning-fast experience' },
        { icon: '💎', title: 'Premium', desc: 'Top-quality vendors only' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <div style={styles.bgOrb1} />
            <div style={styles.bgOrb2} />

            {/* Left Panel - Branding */}
            <div style={styles.leftPanel}>
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </Link>
                
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Welcome Back!</h1>
                    <p style={styles.heroSubtitle}>
                        Sign in to continue planning your perfect event
                    </p>
                </div>

                <div style={styles.featureGrid}>
                    {features.map((f, i) => (
                        <div key={i} style={{...styles.featureCard, animationDelay: `${i * 0.1}s`}}>
                            <span style={styles.featureIcon}>{f.icon}</span>
                            <div>
                                <h4 style={styles.featureTitle}>{f.title}</h4>
                                <p style={styles.featureDesc}>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.statsBar}>
                    <div style={styles.stat}><span style={styles.statValue}>10K+</span><span style={styles.statLabel}>Events</span></div>
                    <div style={styles.stat}><span style={styles.statValue}>500+</span><span style={styles.statLabel}>Vendors</span></div>
                    <div style={styles.stat}><span style={styles.statValue}>50K+</span><span style={styles.statLabel}>Users</span></div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div style={styles.rightPanel}>
                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Sign In</h2>
                        <p style={styles.formSubtitle}>Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={{
                                ...styles.inputWrapper,
                                borderColor: focusedField === 'email' ? '#667eea' : 'rgba(255,255,255,0.1)',
                                boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(102,126,234,0.15)' : 'none'
                            }}>
                                <span style={styles.inputIcon}>📧</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    style={styles.input}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={{
                                ...styles.inputWrapper,
                                borderColor: focusedField === 'password' ? '#667eea' : 'rgba(255,255,255,0.1)',
                                boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(102,126,234,0.15)' : 'none'
                            }}>
                                <span style={styles.inputIcon}>🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
                                    style={styles.input}
                                    autoComplete="current-password"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeBtn}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div style={styles.optionsRow}>
                            <label style={styles.checkboxLabel}>
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={styles.checkbox}
                                />
                                <span style={styles.checkmark} />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={styles.forgotLink}>
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}
                        >
                            {loading ? (
                                <span style={styles.spinner} />
                            ) : (
                                <>Sign In<span>→</span></>
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerLine} />
                        <span style={styles.dividerText}>Quick Demo Access</span>
                        <span style={styles.dividerLine} />
                    </div>

                    <div style={styles.quickAccess}>
                        {[
                            { role: 'user', icon: '👤', label: 'User', color: '#43e97b' },
                            { role: 'vendor', icon: '🏪', label: 'Vendor', color: '#f093fb' },
                            { role: 'admin', icon: '👑', label: 'Admin', color: '#4facfe' }
                        ].map((acc) => (
                            <button 
                                key={acc.role}
                                onClick={() => quickLogin(acc.role)}
                                style={{...styles.quickBtn, borderColor: acc.color}}
                            >
                                <span>{acc.icon}</span>
                                <span>{acc.label}</span>
                            </button>
                        ))}
                    </div>

                    <p style={styles.signupLink}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={styles.link}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', background: '#0a0a0f', color: '#fff', position: 'relative', overflow: 'hidden' },
    bgPattern: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`, pointerEvents: 'none' },
    bgOrb1: { position: 'fixed', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' },
    bgOrb2: { position: 'fixed', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(240,147,251,0.1) 0%, transparent 70%)', pointerEvents: 'none', animation: 'float 10s ease-in-out infinite reverse' },
    
    leftPanel: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 4rem', position: 'relative', zIndex: 1 },
    logo: { display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '3rem', cursor: 'pointer' },
    logoIcon: { fontSize: '2rem' },
    logoText: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroContent: { marginBottom: '3rem' },
    heroTitle: { fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 },
    heroSubtitle: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '400px' },
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' },
    featureCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeInUp 0.5s ease-out both' },
    featureIcon: { fontSize: '1.5rem' },
    featureTitle: { fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.1rem' },
    featureDesc: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
    statsBar: { display: 'flex', gap: '2rem' },
    stat: { display: 'flex', flexDirection: 'column' },
    statValue: { fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    statLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },

    rightPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 },
    formCard: { width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem', backdropFilter: 'blur(20px)' },
    formHeader: { marginBottom: '2rem', textAlign: 'center' },
    formTitle: { fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' },
    formSubtitle: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' },
    errorBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '10px', marginBottom: '1.5rem', color: '#ff5252', fontSize: '0.9rem' },
    form: {},
    inputGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontWeight: 500 },
    inputWrapper: { display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', transition: 'all 0.3s ease' },
    inputIcon: { fontSize: '1rem', marginRight: '0.75rem' },
    input: { flex: 1, padding: '0.9rem 0', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem' },
    eyeBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.5rem' },
    optionsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    checkbox: { width: '18px', height: '18px', accentColor: '#667eea' },
    forgotLink: { fontSize: '0.85rem', color: '#667eea', textDecoration: 'none' },
    submitBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 25px rgba(102,126,234,0.35)', transition: 'all 0.3s ease' },
    spinner: { width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    divider: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' },
    dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' },
    dividerText: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' },
    quickAccess: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
    quickBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'transparent', border: '1px solid', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' },
    signupLink: { textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' },
    link: { color: '#667eea', textDecoration: 'none', fontWeight: 600 }
};

export default Login;
