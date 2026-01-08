import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            background: '#e0e0e0', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center'
        }}>
            <h1 style={{ color: '#d9534f', fontSize: '3rem' }}>Access Denied</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>You do not have permission to view this page.</p>
            <button 
                onClick={() => navigate('/')}
                style={{
                    background: '#4a76c5',
                    color: 'white',
                    border: 'none',
                    padding: '10px 40px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Go to Home
            </button>
        </div>
    );
};

export default Unauthorized;
