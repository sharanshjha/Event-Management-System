import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { userApi } from '../services/api';

const UserCheckout = () => {
    const { cart, getTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Processing
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        email: '',
        paymentMethod: '',
        address: '',
        state: '',
        city: '',
        pinCode: '',
        // Payment specific fields
        upiId: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        cardName: '',
        bankName: '',
        walletType: '',
        emiTenure: 6  // Default 6 months
    });
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.trim().length < 3 ? 'Name must be at least 3 characters' : '';
            case 'number':
                const isRepetitive = /^(.)\1{9}$/.test(value);
                if (isRepetitive) return 'Invalid phone number';
                return !/^[0-9]{10}$/.test(value) ? 'Enter a valid 10-digit number' : '';
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email' : '';
            case 'pinCode':
                return !/^[0-9]{6}$/.test(value) ? 'Enter a valid 6-digit PIN' : '';
            case 'address':
                return value.trim().length < 5 ? 'Enter a complete address' : '';
            case 'upiId':
                return !/^[\w.-]+@[\w]+$/.test(value) ? 'Enter valid UPI ID (e.g., name@upi)' : '';
            case 'cardNumber':
                return !/^[0-9]{16}$/.test(value.replace(/\s/g, '')) ? 'Enter valid 16-digit card number' : '';
            case 'cardExpiry':
                return !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value) ? 'Enter valid expiry (MM/YY)' : '';
            case 'cardCvv':
                return !/^[0-9]{3,4}$/.test(value) ? 'Enter valid CVV' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'number' || name === 'cardCvv') {
            processedValue = value.replace(/\D/g, '').slice(0, name === 'number' ? 10 : 4);
        } else if (name === 'pinCode') {
            processedValue = value.replace(/\D/g, '').slice(0, 6);
        } else if (name === 'cardNumber') {
            processedValue = value.replace(/\D/g, '').slice(0, 16);
        } else if (name === 'cardExpiry') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
            if (processedValue.length >= 2) {
                processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2);
            }
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) setErrors(prev => ({ ...prev, [name]: error }));
        setFocusedField(null);
    };

    const validateStep1 = () => {
        const fields = ['name', 'email', 'number', 'address', 'city', 'state', 'pinCode'];
        const newErrors = {};
        fields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePayment = () => {
        if (!formData.paymentMethod) {
            setErrors({ payment: 'Please select a payment method' });
            return false;
        }
        
        if (formData.paymentMethod === 'upi') {
            const error = validateField('upiId', formData.upiId);
            if (error) { setErrors({ upiId: error }); return false; }
        }
        
        if (formData.paymentMethod === 'card') {
            const newErrors = {};
            ['cardNumber', 'cardExpiry', 'cardCvv'].forEach(field => {
                const error = validateField(field, formData[field]);
                if (error) newErrors[field] = error;
            });
            if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return false; }
        }
        
        if (formData.paymentMethod === 'netbanking' && !formData.bankName) {
            setErrors({ bankName: 'Please select a bank' });
            return false;
        }
        
        if (formData.paymentMethod === 'wallet' && !formData.walletType) {
            setErrors({ walletType: 'Please select a wallet' });
            return false;
        }
        
        return true;
    };

    const simulatePayment = async () => {
        setPaymentProcessing(true);
        
        // Simulate payment processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success (90% success rate for demo)
        const success = Math.random() > 0.1;
        
        if (!success) {
            setPaymentProcessing(false);
            setErrors({ payment: 'Payment failed. Please try again or use a different method.' });
            return false;
        }
        
        setPaymentSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePayment()) return;
        
        // For non-COD payments, simulate payment
        if (formData.paymentMethod !== 'cod') {
            const paymentOk = await simulatePayment();
            if (!paymentOk) return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                paymentMethod: formData.paymentMethod,
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.pinCode,
                    country: 'India'
                },
                guestName: formData.name,
                guestEmail: formData.email
            };

            const order = await userApi.placeOrder(orderData);
            clearCart();
            navigate('/user/order-success', { state: { order, details: formData } });
        } catch (err) {
            setErrors({ submit: 'Order failed: ' + err.message });
        } finally {
            setLoading(false);
            setPaymentProcessing(false);
        }
    };

    const paymentMethods = [
        { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive', color: '#43e97b' },
        { value: 'upi', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm', color: '#667eea' },
        { value: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay', color: '#f093fb' },
        { value: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks', color: '#4facfe' },
        { value: 'wallet', label: 'Wallets', icon: '👛', desc: 'Amazon Pay, Paytm, etc.', color: '#38f9d7' },
        { value: 'emi', label: 'EMI', icon: '📊', desc: 'Easy monthly installments', color: '#ff9a9e' }
    ];

    const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank', 'Bank of Baroda', 'Yes Bank'];
    const wallets = ['Amazon Pay', 'Paytm Wallet', 'PhonePe Wallet', 'Freecharge', 'MobiKwik', 'Airtel Money'];
    const upiApps = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'];

    const inputFields = [
        { name: 'name', label: 'Full Name', type: 'text', icon: '👤', placeholder: 'Rahul Sharma' },
        { name: 'email', label: 'Email', type: 'email', icon: '📧', placeholder: 'rahul@example.com' },
        { name: 'number', label: 'Phone', type: 'text', icon: '📱', placeholder: '10-digit number' },
        { name: 'address', label: 'Address', type: 'text', icon: '🏠', placeholder: 'House no, Street, Area' },
        { name: 'city', label: 'City', type: 'text', icon: '🏙️', placeholder: 'Mumbai' },
        { name: 'state', label: 'State', type: 'text', icon: '📍', placeholder: 'Maharashtra' },
        { name: 'pinCode', label: 'PIN Code', type: 'text', icon: '📮', placeholder: '400001' }
    ];

    // Payment Processing Overlay
    if (paymentProcessing) {
        return (
            <div style={styles.processingOverlay}>
                <div style={styles.processingCard}>
                    {!paymentSuccess ? (
                        <>
                            <div style={styles.processingSpinner} />
                            <h2 style={styles.processingTitle}>Processing Payment...</h2>
                            <p style={styles.processingText}>Please do not close this window</p>
                            <div style={styles.processingAmount}>₹{getTotal().toLocaleString()}</div>
                        </>
                    ) : (
                        <>
                            <div style={styles.successIcon}>✓</div>
                            <h2 style={styles.successTitle}>Payment Successful!</h2>
                            <p style={styles.processingText}>Creating your order...</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.bgPattern} />
            <div style={styles.bgGlow} />

            {/* Navigation */}
            <nav style={styles.nav}>
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/user/cart')} style={styles.backBtn}>
                    <span>←</span>
                    <span>{step > 1 ? 'Back' : 'Back to Cart'}</span>
                </button>
                <Link to="/" style={styles.navCenter}>
                    <span style={styles.logoIcon}>✨</span>
                    <span style={styles.logoText}>Nexus</span>
                </Link>
                <div style={styles.navRight}>
                    <span style={styles.secureTag}>🔒 Secure Checkout</span>
                </div>
            </nav>

            {/* Progress Steps */}
            <div style={styles.progressBar}>
                {['Delivery Details', 'Payment', 'Confirmation'].map((label, i) => (
                    <div key={i} style={styles.progressStep}>
                        <div style={{
                            ...styles.progressDot,
                            background: step > i ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : 
                                        step === i + 1 ? 'linear-gradient(135deg, #667eea, #764ba2)' : 
                                        'rgba(255,255,255,0.1)',
                            color: step > i || step === i + 1 ? '#fff' : 'rgba(255,255,255,0.4)'
                        }}>
                            {step > i + 1 ? '✓' : i + 1}
                        </div>
                        <span style={{...styles.progressLabel, color: step >= i + 1 ? '#fff' : 'rgba(255,255,255,0.4)'}}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            <main style={styles.main}>
                <div style={styles.checkoutGrid}>
                    {/* Left: Forms */}
                    <div style={styles.formSection}>
                        {/* Step 1: Delivery Details */}
                        {step === 1 && (
                            <div style={styles.formCard}>
                                <h2 style={styles.formTitle}>
                                    <span>📦</span> Delivery Details
                                </h2>
                                <div style={styles.formGrid}>
                                    {inputFields.map(field => (
                                        <div key={field.name} style={{
                                            ...styles.inputGroup,
                                            gridColumn: ['address'].includes(field.name) ? '1 / -1' : 'auto'
                                        }}>
                                            <label style={styles.label}>{field.label}</label>
                                            <div style={{
                                                ...styles.inputWrapper,
                                                borderColor: errors[field.name] ? '#ff5252' : 
                                                             focusedField === field.name ? '#667eea' : 'rgba(255,255,255,0.1)'
                                            }}>
                                                <span style={styles.inputIcon}>{field.icon}</span>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField(field.name)}
                                                    onBlur={handleBlur}
                                                    placeholder={field.placeholder}
                                                    style={styles.input}
                                                />
                                            </div>
                                            {errors[field.name] && (
                                                <span style={styles.errorText}>{errors[field.name]}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => validateStep1() && setStep(2)} style={styles.continueBtn}>
                                    Continue to Payment →
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div style={styles.formCard}>
                                <h2 style={styles.formTitle}>
                                    <span>💳</span> Payment Method
                                </h2>
                                
                                {errors.payment && (
                                    <div style={styles.errorBox}>{errors.payment}</div>
                                )}

                                <div style={styles.paymentGrid}>
                                    {paymentMethods.map(method => (
                                        <button
                                            key={method.value}
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                                            style={{
                                                ...styles.paymentCard,
                                                borderColor: formData.paymentMethod === method.value ? method.color : 'rgba(255,255,255,0.1)',
                                                background: formData.paymentMethod === method.value ? `${method.color}15` : 'rgba(255,255,255,0.03)'
                                            }}
                                        >
                                            <span style={styles.paymentIcon}>{method.icon}</span>
                                            <div style={styles.paymentInfo}>
                                                <span style={styles.paymentLabel}>{method.label}</span>
                                                <span style={styles.paymentDesc}>{method.desc}</span>
                                            </div>
                                            {formData.paymentMethod === method.value && (
                                                <span style={{...styles.paymentCheck, background: method.color}}>✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* UPI Details */}
                                {formData.paymentMethod === 'upi' && (
                                    <div style={styles.paymentDetails}>
                                        <h4 style={styles.detailsTitle}>Enter UPI Details</h4>
                                        <div style={styles.upiApps}>
                                            {upiApps.map(app => (
                                                <span key={app} style={styles.upiApp}>{app}</span>
                                            ))}
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>UPI ID</label>
                                            <div style={{
                                                ...styles.inputWrapper,
                                                borderColor: errors.upiId ? '#ff5252' : 'rgba(255,255,255,0.1)'
                                            }}>
                                                <span style={styles.inputIcon}>📱</span>
                                                <input
                                                    type="text"
                                                    name="upiId"
                                                    value={formData.upiId}
                                                    onChange={handleChange}
                                                    placeholder="yourname@upi"
                                                    style={styles.input}
                                                />
                                            </div>
                                            {errors.upiId && <span style={styles.errorText}>{errors.upiId}</span>}
                                        </div>
                                        <p style={styles.upiNote}>
                                            📌 A payment request will be sent to your UPI app
                                        </p>
                                    </div>
                                )}

                                {/* Card Details */}
                                {formData.paymentMethod === 'card' && (
                                    <div style={styles.paymentDetails}>
                                        <h4 style={styles.detailsTitle}>Card Details</h4>
                                        <div style={styles.cardLogos}>
                                            <span>💳 Visa</span>
                                            <span>💳 Mastercard</span>
                                            <span>💳 RuPay</span>
                                        </div>
                                        <div style={styles.cardFields}>
                                            <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                                                <label style={styles.label}>Card Number</label>
                                                <div style={styles.inputWrapper}>
                                                    <span style={styles.inputIcon}>💳</span>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        style={styles.input}
                                                    />
                                                </div>
                                                {errors.cardNumber && <span style={styles.errorText}>{errors.cardNumber}</span>}
                                            </div>
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>Expiry</label>
                                                <div style={styles.inputWrapper}>
                                                    <input
                                                        type="text"
                                                        name="cardExpiry"
                                                        value={formData.cardExpiry}
                                                        onChange={handleChange}
                                                        placeholder="MM/YY"
                                                        style={styles.input}
                                                    />
                                                </div>
                                                {errors.cardExpiry && <span style={styles.errorText}>{errors.cardExpiry}</span>}
                                            </div>
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>CVV</label>
                                                <div style={styles.inputWrapper}>
                                                    <input
                                                        type="password"
                                                        name="cardCvv"
                                                        value={formData.cardCvv}
                                                        onChange={handleChange}
                                                        placeholder="***"
                                                        style={styles.input}
                                                    />
                                                </div>
                                                {errors.cardCvv && <span style={styles.errorText}>{errors.cardCvv}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Net Banking */}
                                {formData.paymentMethod === 'netbanking' && (
                                    <div style={styles.paymentDetails}>
                                        <h4 style={styles.detailsTitle}>Select Your Bank</h4>
                                        <div style={styles.bankGrid}>
                                            {banks.map(bank => (
                                                <button
                                                    key={bank}
                                                    onClick={() => setFormData(prev => ({ ...prev, bankName: bank }))}
                                                    style={{
                                                        ...styles.bankBtn,
                                                        borderColor: formData.bankName === bank ? '#4facfe' : 'rgba(255,255,255,0.1)',
                                                        background: formData.bankName === bank ? 'rgba(79,172,254,0.15)' : 'rgba(255,255,255,0.03)'
                                                    }}
                                                >
                                                    🏦 {bank}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.bankName && <span style={styles.errorText}>{errors.bankName}</span>}
                                    </div>
                                )}

                                {/* Wallets */}
                                {formData.paymentMethod === 'wallet' && (
                                    <div style={styles.paymentDetails}>
                                        <h4 style={styles.detailsTitle}>Select Wallet</h4>
                                        <div style={styles.walletGrid}>
                                            {wallets.map(wallet => (
                                                <button
                                                    key={wallet}
                                                    onClick={() => setFormData(prev => ({ ...prev, walletType: wallet }))}
                                                    style={{
                                                        ...styles.walletBtn,
                                                        borderColor: formData.walletType === wallet ? '#38f9d7' : 'rgba(255,255,255,0.1)',
                                                        background: formData.walletType === wallet ? 'rgba(56,249,215,0.15)' : 'rgba(255,255,255,0.03)'
                                                    }}
                                                >
                                                    👛 {wallet}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.walletType && <span style={styles.errorText}>{errors.walletType}</span>}
                                    </div>
                                )}

                                {/* EMI */}
                                {formData.paymentMethod === 'emi' && (
                                    <div style={styles.paymentDetails}>
                                        <h4 style={styles.detailsTitle}>Select EMI Tenure</h4>
                                        <div style={styles.emiOptions}>
                                            {[3, 6, 9, 12].map(months => (
                                                <button 
                                                    key={months} 
                                                    onClick={() => setFormData(prev => ({ ...prev, emiTenure: months }))}
                                                    style={{
                                                        ...styles.emiCard,
                                                        borderColor: formData.emiTenure === months ? '#ff9a9e' : 'rgba(255,255,255,0.1)',
                                                        background: formData.emiTenure === months ? 'rgba(255,154,158,0.15)' : 'rgba(255,255,255,0.03)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <span style={styles.emiMonths}>{months} months</span>
                                                    <span style={styles.emiAmount}>
                                                        ₹{Math.round(getTotal() / months).toLocaleString()}/mo
                                                    </span>
                                                    <span style={styles.emiInterest}>@ 12% p.a.</span>
                                                    {formData.emiTenure === months && (
                                                        <span style={{position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderRadius: '50%', background: '#ff9a9e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff'}}>✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <p style={styles.emiNote}>
                                            💡 EMI available on credit cards. You'll need to enter card details to proceed.
                                        </p>
                                    </div>
                                )}

                                {errors.submit && (
                                    <div style={styles.errorBox}>{errors.submit}</div>
                                )}

                                <button 
                                    onClick={handleSubmit} 
                                    disabled={loading || !formData.paymentMethod}
                                    style={{
                                        ...styles.payBtn,
                                        opacity: loading || !formData.paymentMethod ? 0.5 : 1
                                    }}
                                >
                                    {loading ? 'Processing...' : `Pay ₹${getTotal().toLocaleString()}`}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div style={styles.summarySection}>
                        <div style={styles.summaryCard}>
                            <h3 style={styles.summaryTitle}>Order Summary</h3>
                            
                            <div style={styles.summaryItems}>
                                {cart.map(item => (
                                    <div key={item._id} style={styles.summaryItem}>
                                        <div style={styles.itemImage}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={styles.itemImg} />
                                            ) : (
                                                <span>📦</span>
                                            )}
                                        </div>
                                        <div style={styles.itemDetails}>
                                            <span style={styles.itemName}>{item.name}</span>
                                            <span style={styles.itemQty}>Qty: {item.quantity}</span>
                                        </div>
                                        <span style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.summaryDivider} />

                            <div style={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{getTotal().toLocaleString()}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Delivery</span>
                                <span style={styles.freeTag}>FREE</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Tax (18% GST)</span>
                                <span>₹{Math.round(getTotal() * 0.18).toLocaleString()}</span>
                            </div>

                            <div style={styles.summaryDivider} />

                            <div style={styles.totalRow}>
                                <span>Total</span>
                                <span style={styles.totalAmount}>₹{Math.round(getTotal() * 1.18).toLocaleString()}</span>
                            </div>

                            <div style={styles.securityInfo}>
                                <span>🔒</span>
                                <span>Your payment is secured with 256-bit SSL encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0f', color: '#fff', position: 'relative' },
    bgPattern: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 0 },
    bgGlow: { position: 'fixed', top: '-30%', right: '-20%', width: '70%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 },
    
    nav: { position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer' },
    navCenter: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
    logoIcon: { fontSize: '1.5rem' },
    logoText: { fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    navRight: {},
    secureTag: { padding: '0.4rem 0.8rem', background: 'rgba(67, 233, 123, 0.1)', border: '1px solid rgba(67, 233, 123, 0.3)', borderRadius: '20px', fontSize: '0.8rem', color: '#43e97b' },
    
    progressBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', padding: '1.5rem', position: 'relative' },
    progressStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
    progressDot: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' },
    progressLabel: { fontSize: '0.75rem', fontWeight: 500 },
    
    main: { position: 'relative', zIndex: 1, padding: '1.5rem 3rem 4rem', maxWidth: '1200px', margin: '0 auto' },
    checkoutGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' },
    
    formSection: {},
    formCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem' },
    formTitle: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
    inputGroup: { marginBottom: '0.5rem' },
    label: { display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontWeight: 500 },
    inputWrapper: { display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', transition: 'all 0.3s ease' },
    inputIcon: { fontSize: '0.9rem', marginRight: '0.6rem' },
    input: { flex: 1, padding: '0.75rem 0', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' },
    errorText: { fontSize: '0.75rem', color: '#ff5252', marginTop: '0.25rem', display: 'block' },
    errorBox: { padding: '0.75rem 1rem', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)', borderRadius: '8px', color: '#ff5252', fontSize: '0.9rem', marginBottom: '1rem' },
    continueBtn: { width: '100%', marginTop: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
    
    paymentGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
    paymentCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: '1px solid', cursor: 'pointer', textAlign: 'left', position: 'relative' },
    paymentIcon: { fontSize: '1.5rem' },
    paymentInfo: { display: 'flex', flexDirection: 'column' },
    paymentLabel: { fontSize: '0.9rem', fontWeight: 600, color: '#fff' },
    paymentDesc: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
    paymentCheck: { position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff' },
    
    paymentDetails: { padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '1.5rem' },
    detailsTitle: { fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' },
    upiApps: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
    upiApp: { padding: '0.35rem 0.75rem', background: 'rgba(102,126,234,0.15)', borderRadius: '20px', fontSize: '0.75rem', color: '#667eea' },
    upiNote: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' },
    
    cardLogos: { display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' },
    cardFields: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
    
    bankGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' },
    bankBtn: { padding: '0.75rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', color: '#fff', textAlign: 'left' },
    
    walletGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' },
    walletBtn: { padding: '0.75rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', color: '#fff', textAlign: 'left' },
    
    emiOptions: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' },
    emiCard: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' },
    emiMonths: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' },
    emiAmount: { fontSize: '1rem', fontWeight: 600, color: '#43e97b', margin: '0.25rem 0' },
    emiInterest: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' },
    emiNote: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '1rem' },
    
    payBtn: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #43e97b, #38f9d7)', border: 'none', borderRadius: '12px', color: '#000', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' },
    
    summarySection: { position: 'sticky', top: '100px' },
    summaryCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' },
    summaryTitle: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' },
    summaryItems: { maxHeight: '200px', overflowY: 'auto' },
    summaryItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    itemImage: { width: '50px', height: '50px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
    itemDetails: { flex: 1, display: 'flex', flexDirection: 'column' },
    itemName: { fontSize: '0.85rem', fontWeight: 500, color: '#fff' },
    itemQty: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
    itemPrice: { fontSize: '0.9rem', fontWeight: 600, color: '#43e97b' },
    summaryDivider: { height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' },
    freeTag: { color: '#43e97b', fontWeight: 500 },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '1rem', fontWeight: 600 },
    totalAmount: { fontSize: '1.25rem', background: 'linear-gradient(135deg, #43e97b, #38f9d7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    securityInfo: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(67, 233, 123, 0.05)', borderRadius: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
    
    processingOverlay: { position: 'fixed', inset: 0, background: 'rgba(10, 10, 15, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    processingCard: { textAlign: 'center', padding: '3rem' },
    processingSpinner: { width: '60px', height: '60px', border: '3px solid rgba(102,126,234,0.2)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' },
    processingTitle: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' },
    processingText: { color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' },
    processingAmount: { fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    successIcon: { width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #43e97b, #38f9d7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#000' },
    successTitle: { fontSize: '1.5rem', fontWeight: 600, color: '#43e97b' }
};

export default UserCheckout;
