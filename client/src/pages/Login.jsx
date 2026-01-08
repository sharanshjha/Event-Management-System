import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login({ email, password });
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'vendor') navigate('/vendor');
            else navigate('/user');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#4a76c5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}>Welcome To Event Management System</h1>
            
            <div className="card-container" style={{ background: '#e0e0e0', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 60px', borderRadius: '5px', fontSize: '1.5rem', marginBottom: '40px' }}>
                    LOGIN
                </div>

                {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ color: '#333', fontWeight: 'bold' }}>Name (E-mail)</label>
                        <input 
                            className="form-input"
                            type="email" 
                            style={inputStyle} 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ color: '#333', fontWeight: 'bold' }}>Password</label>
                        <input 
                            className="form-input"
                            type="password" 
                            style={inputStyle} 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" style={loginBtnStyle} disabled={loading}>
                        {loading ? '...' : 'LOGIN'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <Link to="/signup" style={{ color: '#4a76c5' }}>Signup as User</Link>
                    <Link to="/signup" style={{ color: '#4a76c5' }}>Signup as Vendor</Link>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #4a76c5',
    fontSize: '1rem'
};

const loginBtnStyle = {
    background: '#4a76c5',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
};

export default Login;
