import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { order, details } = location.state || {};

    if (!order) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>Order details not found.</div>;
    }

    return (
        <div className="page-shell" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '50px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div className="card-container" style={{ 
                background: '#d0d0d0', 
                width: '100%', 
                maxWidth: '700px', 
                padding: '40px', 
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#333', marginBottom: '30px', paddingTop: '20px' }}>THANK YOU</h1>

                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 50px', borderRadius: '5px', display: 'inline-block', marginBottom: '40px', fontWeight: 'bold' }}>
                    Grand Total: {order.totalAmount || order.total || 0}/-
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', textAlign: 'left', marginBottom: '50px' }}>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>Name</div>
                        <div style={infoValueStyle}>{details?.name}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>Number</div>
                        <div style={infoValueStyle}>{details?.number}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>E-mail</div>
                        <div style={infoValueStyle}>{details?.email}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>Payment Method</div>
                        <div style={infoValueStyle}>{details?.paymentMethod}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>Address</div>
                        <div style={infoValueStyle}>{details?.address}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>State</div>
                        <div style={infoValueStyle}>{details?.state}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>City</div>
                        <div style={infoValueStyle}>{details?.city}</div>
                    </div>
                    <div style={infoBoxStyle}>
                        <div style={infoLabelStyle}>PinCode</div>
                        <div style={infoValueStyle}>{details?.pinCode}</div>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/user')}
                    style={{
                        background: '#4a76c5',
                        color: 'white',
                        border: 'none',
                        padding: '15px 60px',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

const infoBoxStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const infoLabelStyle = { background: '#4a76c5', color: 'white', padding: '10px', borderRadius: '15px', textAlign: 'center', minWidth: '150px' };
const infoValueStyle = { background: '#4a76c5', color: 'white', padding: '10px', borderRadius: '15px', textAlign: 'center', minWidth: '150px', opacity: 0.9 };

export default OrderSuccess;
