import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order, details } = location.state || {};
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!order) {
        return (
            <div style={styles.container}>
                <div style={styles.errorState}>
                    <h2>No order found</h2>
                    <button onClick={() => navigate('/user')} style={styles.homeBtn}>
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Confetti Animation */}
            {showConfetti && (
                <div style={styles.confettiContainer}>
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.confetti,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                background: ['#667eea', '#f093fb', '#43e97b', '#4facfe', '#f5576c'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main Content */}
            <main style={styles.main}>
                {/* Success Icon */}
                <div style={styles.successIcon}>
                    <div style={styles.iconOuter}>
                        <div style={styles.iconInner}>
                            <span style={styles.checkmark}>✓</span>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 style={styles.title}>Order Placed Successfully!</h1>
                <p style={styles.subtitle}>
                    Thank you for your order. We've received your request and will process it shortly.
                </p>

                {/* Order Details Card */}
                <div style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                        <div style={styles.orderInfo}>
                            <span style={styles.orderLabel}>Order ID</span>
                            <span style={styles.orderId}>#{order._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                        </div>
                        <div style={styles.statusBadge}>
                            <span style={styles.statusDot} />
                            Confirmed
                        </div>
                    </div>

                    <div style={styles.orderBody}>
                        {/* Summary Section */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>📦 Order Summary</h3>
                            <div style={styles.itemsList}>
                                {order.items?.map((item, i) => (
                                    <div key={i} style={styles.item}>
                                        <span style={styles.itemName}>{item.name}</span>
                                        <span style={styles.itemQty}>x{item.quantity}</span>
                                        <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={styles.totalRow}>
                                <span>Total Amount</span>
                                <span style={styles.totalAmount}>₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Shipping Section */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>🚚 Shipping Details</h3>
                            <div style={styles.detailsGrid}>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>Recipient</span>
                                    <span style={styles.detailValue}>{details?.name || 'N/A'}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>Phone</span>
                                    <span style={styles.detailValue}>{details?.number || 'N/A'}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>Email</span>
                                    <span style={styles.detailValue}>{details?.email || 'N/A'}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>Address</span>
                                    <span style={styles.detailValue}>
                                        {details?.address}, {details?.city}, {details?.state} - {details?.pinCode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>💳 Payment Info</h3>
                            <div style={styles.paymentInfo}>
                                <div style={styles.paymentMethod}>
                                    <span style={styles.paymentIcon}>
                                        {order.paymentMethod === 'cash' ? '💵' : '📱'}
                                    </span>
                                    <span style={styles.paymentLabel}>
                                        {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'UPI Payment'}
                                    </span>
                                </div>
                                <span style={styles.paymentStatus}>Pending</span>
                            </div>
                        </div>

                        {/* Delivery Timeline */}
                        <div style={styles.timeline}>
                            <div style={styles.timelineItem}>
                                <div style={{...styles.timelineDot, background: '#43e97b'}} />
                                <div style={styles.timelineContent}>
                                    <span style={styles.timelineLabel}>Order Placed</span>
                                    <span style={styles.timelineDate}>
                                        {new Date().toLocaleDateString('en-IN', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div style={styles.timelineLine} />
                            <div style={styles.timelineItem}>
                                <div style={{...styles.timelineDot, background: 'rgba(255,255,255,0.2)'}} />
                                <div style={styles.timelineContent}>
                                    <span style={styles.timelineLabel}>Estimated Delivery</span>
                                    <span style={styles.timelineDate}>
                                        {estimatedDate.toLocaleDateString('en-IN', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actions}>
                    <button onClick={() => navigate('/user/order-status')} style={styles.trackBtn}>
                        <span>📦</span>
                        Track Order
                    </button>
                    <button onClick={() => navigate('/user')} style={styles.continueBtn}>
                        Continue Shopping
                        <span>→</span>
                    </button>
                </div>

                {/* Help Text */}
                <p style={styles.helpText}>
                    Need help? Contact our support team at <strong>support@nexus.com</strong>
                </p>
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
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '60%',
        background: 'radial-gradient(ellipse at center, rgba(67, 233, 123, 0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    confettiContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden'
    },
    confetti: {
        position: 'absolute',
        top: '-10px',
        width: '10px',
        height: '10px',
        borderRadius: '2px',
        animation: 'confettiFall 3s linear forwards'
    },
    errorState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem'
    },
    homeBtn: {
        padding: '0.85rem 2rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer'
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '3rem',
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center'
    },
    successIcon: {
        marginBottom: '2rem',
        animation: 'scaleIn 0.5s ease-out'
    },
    iconOuter: {
        width: '120px',
        height: '120px',
        margin: '0 auto',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 2s infinite'
    },
    iconInner: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkmark: {
        fontSize: '2.5rem',
        color: '#000',
        fontWeight: 'bold'
    },
    title: {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: 700,
        marginBottom: '0.5rem',
        animation: 'fadeInUp 0.5s ease-out 0.2s both'
    },
    subtitle: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '2.5rem',
        animation: 'fadeInUp 0.5s ease-out 0.3s both'
    },
    orderCard: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        textAlign: 'left',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.5s ease-out 0.4s both'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    },
    orderInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    orderLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '0.1rem'
    },
    orderId: {
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: 'monospace'
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.85rem',
        background: 'rgba(67, 233, 123, 0.15)',
        border: '1px solid rgba(67, 233, 123, 0.3)',
        borderRadius: '20px',
        fontSize: '0.8rem',
        color: '#43e97b'
    },
    statusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#43e97b',
        animation: 'pulse 2s infinite'
    },
    orderBody: {
        padding: '1.5rem'
    },
    section: {
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    },
    sectionTitle: {
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: '#fff'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0'
    },
    itemName: {
        flex: 1,
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.8)'
    },
    itemQty: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)',
        marginRight: '1rem'
    },
    itemPrice: {
        fontSize: '0.9rem',
        color: '#fff',
        fontWeight: 500
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px dashed rgba(255,255,255,0.1)',
        fontSize: '0.95rem'
    },
    totalAmount: {
        fontSize: '1.25rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem'
    },
    detailLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)'
    },
    detailValue: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.8)'
    },
    paymentInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    paymentMethod: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    paymentIcon: {
        fontSize: '1.5rem'
    },
    paymentLabel: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.8)'
    },
    paymentStatus: {
        padding: '0.3rem 0.75rem',
        background: 'rgba(240, 147, 251, 0.15)',
        borderRadius: '4px',
        fontSize: '0.8rem',
        color: '#f093fb'
    },
    timeline: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '10px'
    },
    timelineItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    timelineDot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%'
    },
    timelineContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    timelineLabel: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.6)'
    },
    timelineDate: {
        fontSize: '0.9rem',
        fontWeight: 500
    },
    timelineLine: {
        flex: 1,
        height: '2px',
        background: 'rgba(255,255,255,0.1)'
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.5s ease-out 0.5s both'
    },
    trackBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.85rem 1.5rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 500,
        cursor: 'pointer'
    },
    continueBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.85rem 1.5rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
    },
    helpText: {
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.4)',
        animation: 'fadeInUp 0.5s ease-out 0.6s both'
    }
};

// Add keyframes to document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes confettiFall {
            0% { 
                transform: translateY(0) rotate(0deg); 
                opacity: 1;
            }
            100% { 
                transform: translateY(100vh) rotate(720deg); 
                opacity: 0;
            }
        }
        @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default OrderSuccess;
