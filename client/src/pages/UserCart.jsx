import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const UserCart = () => {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart, getItemCount } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        navigate('/user/checkout');
    };

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <button onClick={() => navigate('/user')} style={styles.backBtn}>
                        <span>←</span>
                        <span>Back</span>
                    </button>
                </div>
                <div style={styles.navCenter}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.cartCount}>{getItemCount()} items</span>
                </div>
            </nav>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Header */}
                <section style={styles.header}>
                    <div style={styles.headerContent}>
                        <h1 style={styles.title}>Shopping Cart</h1>
                        <p style={styles.subtitle}>
                            Review your items before checkout
                        </p>
                    </div>
                    {cart.length > 0 && (
                        <button onClick={() => clearCart()} style={styles.clearBtn}>
                            <span>🗑️</span>
                            Clear All
                        </button>
                    )}
                </section>

                <div style={styles.content}>
                    {/* Cart Items */}
                    <div style={styles.cartSection}>
                        {cart.length === 0 ? (
                            <div style={styles.emptyCart}>
                                <span style={styles.emptyIcon}>🛒</span>
                                <h3 style={styles.emptyTitle}>Your cart is empty</h3>
                                <p style={styles.emptyText}>
                                    Discover amazing products from our vendors
                                </p>
                                <button onClick={() => navigate('/user')} style={styles.shopBtn}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div style={styles.itemsList}>
                                {cart.map((item, index) => (
                                    <div 
                                        key={item._id} 
                                        style={{
                                            ...styles.cartItem,
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <div style={styles.itemImage}>
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    style={styles.image}
                                                />
                                            ) : (
                                                <div style={styles.imagePlaceholder}>
                                                    <span>📦</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.itemDetails}>
                                            <div style={styles.itemInfo}>
                                                <h4 style={styles.itemName}>{item.name}</h4>
                                                <span style={styles.itemCategory}>{item.category}</span>
                                            </div>
                                            <div style={styles.priceSection}>
                                                <span style={styles.itemPrice}>₹{item.price}</span>
                                                <span style={styles.priceLabel}>per unit</span>
                                            </div>
                                        </div>
                                        <div style={styles.quantitySection}>
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                style={styles.qtyBtn}
                                            >
                                                −
                                            </button>
                                            <span style={styles.qtyValue}>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                style={styles.qtyBtn}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div style={styles.itemTotal}>
                                            <span style={styles.totalValue}>
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            style={styles.removeBtn}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {cart.length > 0 && (
                        <div style={styles.summarySection}>
                            <div style={styles.summaryCard}>
                                <h3 style={styles.summaryTitle}>Order Summary</h3>
                                
                                <div style={styles.summaryDetails}>
                                    <div style={styles.summaryRow}>
                                        <span>Subtotal ({getItemCount()} items)</span>
                                        <span>₹{getTotal().toLocaleString()}</span>
                                    </div>
                                    <div style={styles.summaryRow}>
                                        <span>Delivery</span>
                                        <span style={styles.freeTag}>FREE</span>
                                    </div>
                                    <div style={styles.summaryRow}>
                                        <span>Tax (included)</span>
                                        <span>₹0</span>
                                    </div>
                                </div>

                                <div style={styles.summaryTotal}>
                                    <div style={styles.totalRow}>
                                        <span style={styles.totalLabel}>Total</span>
                                        <span style={styles.totalAmount}>
                                            ₹{getTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={handleCheckout} style={styles.checkoutBtn}>
                                    <span>Proceed to Checkout</span>
                                    <span style={styles.checkoutArrow}>→</span>
                                </button>

                                <div style={styles.securityNote}>
                                    <span style={styles.securityIcon}>🔒</span>
                                    <span style={styles.securityText}>
                                        Secure checkout with encrypted data
                                    </span>
                                </div>
                            </div>

                            {/* Promo Section */}
                            <div style={styles.promoCard}>
                                <span style={styles.promoIcon}>🎁</span>
                                <div style={styles.promoText}>
                                    <strong>Free delivery</strong> on all orders!
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#fff',
        position: 'relative'
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
        top: '-30%',
        right: '-20%',
        width: '70%',
        height: '70%',
        background: 'radial-gradient(ellipse at center, rgba(240, 147, 251, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
    },
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 3rem',
        background: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    navBrand: {
        flex: 1
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    navCenter: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
    },
    logoIcon: {
        fontSize: '1.5rem'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    navRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    cartCount: {
        padding: '0.5rem 1rem',
        background: 'rgba(240, 147, 251, 0.15)',
        border: '1px solid rgba(240, 147, 251, 0.3)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#f093fb'
    },
    main: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem 3rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    headerContent: {},
    title: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        marginBottom: '0.25rem',
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.5)'
    },
    clearBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.25rem',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: '10px',
        color: '#ff5252',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2rem',
        alignItems: 'start'
    },
    cartSection: {},
    emptyCart: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
        display: 'block'
    },
    emptyTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: '#fff'
    },
    emptyText: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '2rem'
    },
    shopBtn: {
        padding: '0.85rem 2rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.3s ease'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.25rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'fadeInUp 0.5s ease-out both',
        position: 'relative'
    },
    itemImage: {
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem'
    },
    itemDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    itemInfo: {},
    itemName: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '0.1rem'
    },
    itemCategory: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'capitalize'
    },
    priceSection: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.25rem',
        marginTop: '0.5rem'
    },
    itemPrice: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#f093fb'
    },
    priceLabel: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)'
    },
    quantitySection: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    qtyBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: '1.1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    qtyValue: {
        fontSize: '1rem',
        fontWeight: 600,
        minWidth: '30px',
        textAlign: 'center'
    },
    itemTotal: {
        minWidth: '100px',
        textAlign: 'right'
    },
    totalValue: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#fff'
    },
    removeBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(255, 82, 82, 0.1)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        color: '#ff5252',
        fontSize: '0.85rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    summarySection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    summaryCard: {
        padding: '1.75rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)'
    },
    summaryTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
        color: '#fff'
    },
    summaryDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)'
    },
    freeTag: {
        color: '#43e97b',
        fontWeight: 600
    },
    summaryTotal: {
        paddingTop: '1.25rem',
        marginBottom: '1.5rem'
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalLabel: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.8)'
    },
    totalAmount: {
        fontSize: '1.75rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #667eea, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    checkoutBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        border: 'none',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
        transition: 'all 0.3s ease',
        marginBottom: '1rem'
    },
    checkoutArrow: {
        fontSize: '1.2rem'
    },
    securityNote: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
    },
    securityIcon: {
        fontSize: '0.9rem'
    },
    securityText: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.4)'
    },
    promoCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1), rgba(56, 249, 215, 0.1))',
        borderRadius: '12px',
        border: '1px solid rgba(67, 233, 123, 0.2)'
    },
    promoIcon: {
        fontSize: '1.5rem'
    },
    promoText: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.8)'
    }
};

export default UserCart;
