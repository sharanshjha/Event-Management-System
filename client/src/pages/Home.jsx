import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ 
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100 
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const roles = [
        {
            id: 'user',
            title: 'User Portal',
            subtitle: 'Event Organizers',
            description: 'Browse vendors, compare services, and create unforgettable events',
            icon: '👤',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            features: ['Smart Cart System', 'Real-time Order Tracking', 'Multi-vendor Shopping']
        },
        {
            id: 'vendor',
            title: 'Vendor Hub',
            subtitle: 'Service Providers',
            description: 'Showcase your services and expand your business reach',
            icon: '🏪',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            features: ['Product Management', 'Transaction Analytics', 'Order Fulfillment']
        },
        {
            id: 'admin',
            title: 'Admin Console',
            subtitle: 'Platform Management',
            description: 'Oversee operations and maintain platform excellence',
            icon: '👑',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            features: ['User Management', 'Vendor Memberships', 'Platform Analytics']
        }
    ];

    const stats = [
        { value: '500+', label: 'Vendors', icon: '🏪' },
        { value: '10K+', label: 'Events Managed', icon: '🎉' },
        { value: '98%', label: 'Satisfaction', icon: '⭐' },
        { value: '24/7', label: 'Support', icon: '💬' }
    ];

    return (
        <div style={styles.container}>
            {/* Animated Background */}
            <div style={{
                ...styles.bgGradient,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`
            }} />
            <div style={styles.bgPattern} />
            <div style={styles.bgOrbs}>
                <div style={{...styles.orb, ...styles.orb1}} />
                <div style={{...styles.orb, ...styles.orb2}} />
                <div style={{...styles.orb, ...styles.orb3}} />
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/login')} style={styles.navBtn}>
                        Sign In
                    </button>
                    <button onClick={() => navigate('/signup')} style={styles.navBtnPrimary}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.badge}>
                        <span style={styles.badgeDot} />
                        Version 2.0 - Now Live
                    </div>
                    <h1 style={styles.heroTitle}>
                        <span style={styles.heroTitleLine}>Elevate Your</span>
                        <span style={styles.heroTitleGradient}>Event Experience</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        The premium marketplace connecting event organizers with world-class vendors. 
                        From catering to decorations, create moments that matter.
                    </p>
                    <div style={styles.heroCta}>
                        <button onClick={() => navigate('/signup')} style={styles.ctaPrimary}>
                            <span>Start Planning</span>
                            <span style={styles.ctaArrow}>→</span>
                        </button>
                        <button onClick={() => navigate('/login')} style={styles.ctaSecondary}>
                            Explore as Guest
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div style={styles.statsBar}>
                    {stats.map((stat, index) => (
                        <div key={index} style={styles.statItem}>
                            <span style={styles.statIcon}>{stat.icon}</span>
                            <span style={styles.statValue}>{stat.value}</span>
                            <span style={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Role Cards Section */}
            <section style={styles.rolesSection}>
                <h2 style={styles.sectionTitle}>Choose Your Portal</h2>
                <p style={styles.sectionSubtitle}>Experience tailored for every role</p>
                
                <div style={styles.rolesGrid}>
                    {roles.map((role, index) => (
                        <div 
                            key={role.id}
                            style={{
                                ...styles.roleCard,
                                animationDelay: `${index * 0.15}s`,
                                transform: activeCard === role.id ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
                                boxShadow: activeCard === role.id 
                                    ? '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(102, 126, 234, 0.3)'
                                    : '0 10px 40px rgba(0,0,0,0.2)'
                            }}
                            onMouseEnter={() => setActiveCard(role.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            onClick={() => navigate('/login')}
                        >
                            <div style={{...styles.roleCardHeader, background: role.gradient}}>
                                <span style={styles.roleIcon}>{role.icon}</span>
                            </div>
                            <div style={styles.roleCardBody}>
                                <span style={styles.roleSubtitle}>{role.subtitle}</span>
                                <h3 style={styles.roleTitle}>{role.title}</h3>
                                <p style={styles.roleDescription}>{role.description}</p>
                                <ul style={styles.featureList}>
                                    {role.features.map((feature, i) => (
                                        <li key={i} style={styles.featureItem}>
                                            <span style={styles.featureCheck}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button style={{...styles.roleBtn, background: role.gradient}}>
                                    Enter Portal
                                    <span style={styles.roleBtnArrow}>→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Preview */}
            <section style={styles.categoriesSection}>
                <h2 style={styles.sectionTitle}>Our Vendor Categories</h2>
                <p style={styles.sectionSubtitle}>Expert services for every aspect of your event</p>
                
                <div style={styles.categoriesGrid}>
                    {[
                        { name: 'Catering', icon: '🍽️', desc: 'Culinary excellence for any occasion' },
                        { name: 'Florist', icon: '💐', desc: 'Stunning floral arrangements' },
                        { name: 'Decoration', icon: '🎨', desc: 'Transform any space beautifully' },
                        { name: 'Lighting', icon: '💡', desc: 'Set the perfect ambiance' }
                    ].map((cat, index) => (
                        <div key={cat.name} style={{
                            ...styles.categoryCard,
                            animationDelay: `${index * 0.1}s`
                        }}>
                            <span style={styles.categoryIcon}>{cat.icon}</span>
                            <h4 style={styles.categoryName}>{cat.name}</h4>
                            <p style={styles.categoryDesc}>{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaCard}>
                    <h2 style={styles.ctaSectionTitle}>Ready to Create Magic?</h2>
                    <p style={styles.ctaSectionDesc}>
                        Join thousands of event organizers who trust Nexus to make their vision a reality.
                    </p>
                    <div style={styles.ctaButtons}>
                        <button onClick={() => navigate('/signup')} style={styles.ctaFinalBtn}>
                            Create Free Account
                        </button>
                        <button onClick={() => navigate('/login')} style={styles.ctaFinalBtnOutline}>
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <span style={styles.logoIcon}>✨</span>
                        <span style={styles.logoText}>Nexus</span>
                    </div>
                    <p style={styles.footerText}>
                        Crafted with ⚡ by Sharansh | Event Management System 2.0
                    </p>
                </div>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0a0f',
        color: '#ffffff'
    },
    bgGradient: {
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.15) 0%, rgba(10, 10, 15, 0) 70%)',
        transition: 'background-position 0.3s ease',
        pointerEvents: 'none',
        zIndex: 0
    },
    bgPattern: {
        position: 'fixed',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 0
    },
    bgOrbs: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
    },
    orb: {
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.4,
        animation: 'float 8s ease-in-out infinite'
    },
    orb1: {
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        top: '-100px',
        right: '-100px',
        animationDelay: '0s'
    },
    orb2: {
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        bottom: '20%',
        left: '-50px',
        animationDelay: '2s'
    },
    orb3: {
        width: '250px',
        height: '250px',
        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        top: '50%',
        right: '10%',
        animationDelay: '4s'
    },
    nav: {
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 4rem',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    logoIcon: {
        fontSize: '1.5rem'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    navLinks: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    navBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff',
        padding: '0.6rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'all 0.3s ease'
    },
    navBtnPrimary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: '#fff',
        padding: '0.7rem 1.75rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 600,
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
    },
    hero: {
        position: 'relative',
        zIndex: 1,
        padding: '6rem 4rem 4rem',
        textAlign: 'center'
    },
    heroContent: {
        maxWidth: '900px',
        margin: '0 auto'
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(102, 126, 234, 0.15)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '50px',
        fontSize: '0.85rem',
        color: '#a8b4f0',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.6s ease-out'
    },
    badgeDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#667eea',
        animation: 'pulse 2s infinite'
    },
    heroTitle: {
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: '1.5rem',
        animation: 'fadeInUp 0.6s ease-out 0.1s both'
    },
    heroTitleLine: {
        display: 'block',
        color: '#ffffff'
    },
    heroTitleGradient: {
        display: 'block',
        background: 'linear-gradient(135deg, #667eea 0%, #f093fb 50%, #4facfe 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    heroSubtitle: {
        fontSize: '1.25rem',
        color: 'rgba(255,255,255,0.7)',
        maxWidth: '600px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.6,
        animation: 'fadeInUp 0.6s ease-out 0.2s both'
    },
    heroCta: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        animation: 'fadeInUp 0.6s ease-out 0.3s both'
    },
    ctaPrimary: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 600,
        boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
    },
    ctaArrow: {
        fontSize: '1.2rem',
        transition: 'transform 0.3s ease'
    },
    ctaSecondary: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 500,
        transition: 'all 0.3s ease'
    },
    statsBar: {
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        marginTop: '5rem',
        padding: '2rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        flexWrap: 'wrap',
        animation: 'fadeInUp 0.6s ease-out 0.4s both'
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem'
    },
    statIcon: {
        fontSize: '1.5rem',
        marginBottom: '0.25rem'
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.6)'
    },
    rolesSection: {
        position: 'relative',
        zIndex: 1,
        padding: '6rem 4rem',
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 700,
        marginBottom: '0.5rem',
        color: '#fff'
    },
    sectionSubtitle: {
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '3rem'
    },
    rolesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    roleCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    roleCardHeader: {
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    roleIcon: {
        fontSize: '3.5rem',
        filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))'
    },
    roleCardBody: {
        padding: '1.5rem 2rem 2rem',
        textAlign: 'left',
        background: 'rgba(0,0,0,0.3)'
    },
    roleSubtitle: {
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '0.5rem',
        display: 'block'
    },
    roleTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: '#fff'
    },
    roleDescription: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.5,
        marginBottom: '1.25rem'
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.7)'
    },
    featureCheck: {
        color: '#43e97b',
        fontWeight: 'bold'
    },
    roleBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.9rem',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    roleBtnArrow: {
        transition: 'transform 0.3s ease'
    },
    categoriesSection: {
        position: 'relative',
        zIndex: 1,
        padding: '4rem',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.02)'
    },
    categoriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1000px',
        margin: '0 auto'
    },
    categoryCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.6s ease-out both'
    },
    categoryIcon: {
        fontSize: '2.5rem',
        display: 'block',
        marginBottom: '1rem'
    },
    categoryName: {
        fontSize: '1.2rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: '#fff'
    },
    categoryDesc: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.5)'
    },
    ctaSection: {
        position: 'relative',
        zIndex: 1,
        padding: '6rem 4rem'
    },
    ctaCard: {
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '4rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
        borderRadius: '24px',
        border: '1px solid rgba(102, 126, 234, 0.3)'
    },
    ctaSectionTitle: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        marginBottom: '1rem',
        color: '#fff'
    },
    ctaSectionDesc: {
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '2rem'
    },
    ctaButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    ctaFinalBtn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: '#fff',
        padding: '1rem 2.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 600,
        boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
    },
    ctaFinalBtnOutline: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        color: '#fff',
        padding: '1rem 2.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 500,
        transition: 'all 0.3s ease'
    },
    footer: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 4rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.3)'
    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    footerBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    footerText: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.5)'
    }
};

export default Home;
