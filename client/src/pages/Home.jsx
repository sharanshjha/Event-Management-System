import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            background: '#4a76c5', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
        }}>
            <div style={{ 
                background: '#e0e0e0', 
                padding: '40px 80px', 
                borderRadius: '10px', 
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
                <h1 style={{ color: '#333', marginBottom: '40px' }}>Welcome To Event Management System</h1>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                    <button 
                        style={btnStyle}
                        onClick={() => navigate('/login')}
                    >
                        User Login
                    </button>
                    <button 
                        style={btnStyle}
                        onClick={() => navigate('/login')}
                    >
                        Vendor Login
                    </button>
                    <button 
                        style={btnStyle}
                        onClick={() => navigate('/login')}
                    >
                        Admin Login
                    </button>
                </div>
            </div>
        </div>
    );
};

const btnStyle = {
    background: '#4a76c5',
    color: 'white',
    border: 'none',
    padding: '12px 60px',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '250px'
};

export default Home;
