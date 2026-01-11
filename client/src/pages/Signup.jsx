import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        category: ''
    });

    // Password strength calculator
    const passwordStrength = useMemo(() => {
        const { password } = formData;
        if (!password) return { score: 0, label: '', color: '' };
        
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        score = Object.values(checks).filter(Boolean).length;
        
        const levels = [
            { label: 'Very Weak', color: '#ff5252' },
            { label: 'Weak', color: '#ff9800' },
            { label: 'Fair', color: '#ffc107' },
            { label: 'Good', color: '#4facfe' },
            { label: 'Strong', color: '#43e97b' }
        ];
        
        return { score, ...levels[Math.min(score, 4)], checks };
    }, [formData.password]);

    // Username suggestions
    const usernameSuggestions = useMemo(() => {
        if (!formData.name) return [];
        const cleanName = formData.name.toLowerCase().replace(/\s+/g, '');
        const random = Math.floor(Math.random() * 1000);
        return [
            `${cleanName}@gmail.com`,
            `${cleanName}${random}@gmail.com`,
            `${cleanName}.events@gmail.com`
        ];
    }, [formData.name]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateStep1 = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (formData.name.length < 2) return 'Name must be at least 2 characters';
        if (!formData.email) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Invalid email format';
        return null;
    };

    const validateStep2 = () => {
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 8) return 'Password must be at least 8 characters';
        if (passwordStrength.score < 3) return 'Please choose a stronger password';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        return null;
    };

    const validateStep3 = () => {
        if (formData.role === 'vendor' && !formData.category) {
            return 'Please select a category';
        }
        return null;
    };

    const handleNext = () => {
        let validationError = null;
        if (step === 1) validationError = validateStep1();
        if (step === 2) validationError = validateStep2();
        if (step === 3) validationError = validateStep3();
        
        if (validationError) {
            setError(validationError);
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        const validationError = validateStep3();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await authApi.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                category: formData.role === 'vendor' ? formData.category : undefined
            });
            navigate('/login', { state: { message: 'Account created! Please login.' } });
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateStrongPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
        let pass = '';
        for (let i = 0; i < 16; i++) pass += chars[Math.floor(Math.random() * chars.length)];
        handleChange('password', pass);
        handleChange('confirmPassword', pass);
    };

    const roles = [
        { id: 'user', icon: '👤', title: 'User', desc: 'Plan and book events' },
        { id: 'vendor', icon: '🏪', title: 'Vendor', desc: 'Sell your services' }
    ];

    const categories = [
        { id: 'Catering', icon: '🍽️', title: 'Catering' },
        { id: 'Florist', icon: '💐', title: 'Florist' },
        { id: 'Decoration', icon: '🎨', title: 'Decoration' },
        { id: 'Lighting', icon: '💡', title: 'Lighting' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <div style={styles.bgOrb1} />
            <div style={styles.bgOrb2} />

            <main style={styles.main}>
                {/* Logo - Clickable to Home */}
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </Link>

                {/* Progress Bar */}
                <div style={styles.progressBar}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={styles.progressStep}>
                            <div style={{
                                ...styles.progressDot,
                                background: step >= s ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)',
                                transform: step === s ? 'scale(1.2)' : 'scale(1)'
                            }}>
                                {step > s ? '✓' : s}
                            </div>
                            <span style={{...styles.progressLabel, color: step >= s ? '#fff' : 'rgba(255,255,255,0.4)'}}>
                                {s === 1 ? 'Account' : s === 2 ? 'Security' : 'Role'}
                            </span>
                        </div>
                    ))}
                    <div style={{...styles.progressLine, background: `linear-gradient(to right, #667eea ${(step - 1) * 50}%, rgba(255,255,255,0.1) ${(step - 1) * 50}%)`}} />
                </div>

                {/* Form Card */}
                <div style={styles.formCard}>
                    <h2 style={styles.title}>
                        {step === 1 && 'Create Account'}
                        {step === 2 && 'Secure Your Account'}
                        {step === 3 && 'Choose Your Role'}
                    </h2>
                    <p style={styles.subtitle}>
                        {step === 1 && 'Enter your details to get started'}
                        {step === 2 && 'Set a strong password to protect your account'}
                        {step === 3 && 'Select how you want to use Nexus'}
                    </p>

                    {error && (
                        <div style={styles.errorBox}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Step 1: Account Details */}
                    {step === 1 && (
                        <div style={styles.stepContent}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Full Name</label>
                                <div style={{
                                    ...styles.inputWrapper,
                                    borderColor: focusedField === 'name' ? '#667eea' : 'rgba(255,255,255,0.1)'
                                }}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter your full name"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <div style={{
                                    ...styles.inputWrapper,
                                    borderColor: focusedField === 'email' ? '#667eea' : 'rgba(255,255,255,0.1)'
                                }}>
                                    <span style={styles.inputIcon}>📧</span>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="you@example.com"
                                        style={styles.input}
                                    />
                                </div>
                                {formData.name && !formData.email && (
                                    <div style={styles.suggestions}>
                                        <span style={styles.suggestLabel}>Suggestions:</span>
                                        {usernameSuggestions.map((s, i) => (
                                            <button key={i} onClick={() => handleChange('email', s)} style={styles.suggestBtn}>{s}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Password */}
                    {step === 2 && (
                        <div style={styles.stepContent}>
                            <div style={styles.inputGroup}>
                                <div style={styles.labelRow}>
                                    <label style={styles.label}>Password</label>
                                    <button onClick={generateStrongPassword} style={styles.generateBtn}>
                                        🔐 Generate Strong
                                    </button>
                                </div>
                                <div style={{
                                    ...styles.inputWrapper,
                                    borderColor: focusedField === 'password' ? '#667eea' : 'rgba(255,255,255,0.1)'
                                }}>
                                    <span style={styles.inputIcon}>🔒</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Create a strong password"
                                        style={styles.input}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {formData.password && (
                                    <div style={styles.strengthMeter}>
                                        <div style={styles.strengthBar}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{
                                                    ...styles.strengthSegment,
                                                    background: i <= passwordStrength.score ? passwordStrength.color : 'rgba(255,255,255,0.1)'
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{...styles.strengthLabel, color: passwordStrength.color}}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                {formData.password && (
                                    <div style={styles.requirements}>
                                        {[
                                            { key: 'length', label: 'At least 8 characters' },
                                            { key: 'lowercase', label: 'Lowercase letter' },
                                            { key: 'uppercase', label: 'Uppercase letter' },
                                            { key: 'numbers', label: 'Number' },
                                            { key: 'special', label: 'Special character' }
                                        ].map(req => (
                                            <div key={req.key} style={styles.requirement}>
                                                <span style={{color: passwordStrength.checks?.[req.key] ? '#43e97b' : 'rgba(255,255,255,0.4)'}}>
                                                    {passwordStrength.checks?.[req.key] ? '✓' : '○'}
                                                </span>
                                                <span style={{color: passwordStrength.checks?.[req.key] ? '#fff' : 'rgba(255,255,255,0.4)'}}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Confirm Password</label>
                                <div style={{
                                    ...styles.inputWrapper,
                                    borderColor: focusedField === 'confirm' ? '#667eea' : 'rgba(255,255,255,0.1)'
                                }}>
                                    <span style={styles.inputIcon}>🔒</span>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        onFocus={() => setFocusedField('confirm')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Confirm your password"
                                        style={styles.input}
                                    />
                                    {formData.confirmPassword && (
                                        <span style={{color: formData.password === formData.confirmPassword ? '#43e97b' : '#ff5252'}}>
                                            {formData.password === formData.confirmPassword ? '✓' : '✗'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Role Selection */}
                    {step === 3 && (
                        <div style={styles.stepContent}>
                            <div style={styles.roleGrid}>
                                {roles.map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => handleChange('role', role.id)}
                                        style={{
                                            ...styles.roleCard,
                                            borderColor: formData.role === role.id ? '#667eea' : 'rgba(255,255,255,0.1)',
                                            background: formData.role === role.id ? 'rgba(102,126,234,0.15)' : 'rgba(255,255,255,0.03)'
                                        }}
                                    >
                                        <span style={styles.roleIcon}>{role.icon}</span>
                                        <h4 style={styles.roleTitle}>{role.title}</h4>
                                        <p style={styles.roleDesc}>{role.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {formData.role === 'vendor' && (
                                <div style={styles.categorySection}>
                                    <label style={styles.label}>Select Your Category</label>
                                    <div style={styles.categoryGrid}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleChange('category', cat.id)}
                                                style={{
                                                    ...styles.categoryCard,
                                                    borderColor: formData.category === cat.id ? '#f093fb' : 'rgba(255,255,255,0.1)',
                                                    background: formData.category === cat.id ? 'rgba(240,147,251,0.15)' : 'rgba(255,255,255,0.03)'
                                                }}
                                            >
                                                <span style={styles.categoryIcon}>{cat.icon}</span>
                                                <span style={styles.categoryName}>{cat.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={styles.actions}>
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} style={styles.backBtn}>
                                ← Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={handleNext} style={styles.nextBtn}>
                                Continue →
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} style={styles.submitBtn}>
                                {loading ? <span style={styles.spinner} /> : 'Create Account'}
                            </button>
                        )}
                    </div>

                    <p style={styles.loginLink}>
                        Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', position: 'relative', overflow: 'hidden' },
    bgPattern: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`, pointerEvents: 'none' },
    bgOrb1: { position: 'fixed', top: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(240,147,251,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
    bgOrb2: { position: 'fixed', bottom: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
    main: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', position: 'relative', zIndex: 1 },
    logo: { display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2rem', cursor: 'pointer' },
    logoIcon: { fontSize: '2rem' },
    logoText: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    progressBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', marginBottom: '2rem', position: 'relative', padding: '0 2rem' },
    progressStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1 },
    progressDot: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, transition: 'all 0.3s ease' },
    progressLabel: { fontSize: '0.8rem', fontWeight: 500 },
    progressLine: { position: 'absolute', top: '20px', left: '25%', right: '25%', height: '2px', zIndex: 0, transition: 'all 0.3s ease' },
    formCard: { width: '100%', maxWidth: '520px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem', backdropFilter: 'blur(20px)' },
    title: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' },
    subtitle: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '1.5rem' },
    errorBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '10px', marginBottom: '1.5rem', color: '#ff5252', fontSize: '0.9rem' },
    stepContent: { marginBottom: '1.5rem' },
    inputGroup: { marginBottom: '1.25rem' },
    labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    label: { display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 },
    generateBtn: { padding: '0.4rem 0.75rem', background: 'rgba(102,126,234,0.15)', border: 'none', borderRadius: '6px', color: '#667eea', fontSize: '0.75rem', cursor: 'pointer' },
    inputWrapper: { display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', transition: 'all 0.3s ease' },
    inputIcon: { fontSize: '1rem', marginRight: '0.75rem' },
    input: { flex: 1, padding: '0.9rem 0', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem' },
    eyeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' },
    suggestions: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' },
    suggestLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' },
    suggestBtn: { padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', color: '#667eea', fontSize: '0.75rem', cursor: 'pointer' },
    strengthMeter: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' },
    strengthBar: { display: 'flex', gap: '4px', flex: 1 },
    strengthSegment: { height: '4px', flex: 1, borderRadius: '2px', transition: 'all 0.3s ease' },
    strengthLabel: { fontSize: '0.75rem', fontWeight: 500, minWidth: '70px', textAlign: 'right' },
    requirements: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' },
    requirement: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' },
    roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
    roleCard: { padding: '1.5rem', borderRadius: '16px', border: '1px solid', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' },
    roleIcon: { fontSize: '2rem', display: 'block', marginBottom: '0.75rem' },
    roleTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' },
    roleDesc: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' },
    categorySection: { marginTop: '1.5rem' },
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '0.75rem' },
    categoryCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease' },
    categoryIcon: { fontSize: '1.5rem' },
    categoryName: { fontSize: '0.9rem', fontWeight: 500 },
    actions: { display: 'flex', gap: '1rem' },
    backBtn: { flex: 1, padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', cursor: 'pointer' },
    nextBtn: { flex: 2, padding: '0.9rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
    submitBtn: { flex: 2, padding: '0.9rem', background: 'linear-gradient(135deg, #43e97b, #38f9d7)', border: 'none', borderRadius: '12px', color: '#000', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
    spinner: { width: '22px', height: '22px', border: '3px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' },
    loginLink: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' },
    link: { color: '#667eea', textDecoration: 'none', fontWeight: 600 }
};

export default Signup;
