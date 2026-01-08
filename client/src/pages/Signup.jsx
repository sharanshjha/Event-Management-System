import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup({ name, email, password, role, category });
            navigate(role === 'vendor' ? '/vendor' : '/user');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#4a76c5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <h1 style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem', textAlign: 'center' }}>Welcome To Event Management System</h1>
            
            <div className="card-container" style={{ background: '#e0e0e0', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#4a76c5', color: 'white', padding: '10px 40px', borderRadius: '5px', fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center' }}>
                    {role === 'user' ? 'Signup User' : 'Vender Sign Up'}
                </div>

                {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button onClick={() => setRole('user')} style={{...roleBtnStyle, background: role === 'user' ? '#4a76c5' : 'white', color: role === 'user' ? 'white' : '#333'}}>User</button>
                    <button onClick={() => setRole('vendor')} style={{...roleBtnStyle, background: role === 'vendor' ? '#4a76c5' : 'white', color: role === 'vendor' ? 'white' : '#333'}}>Vendor</button>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Name</label>
                        <input className="form-input" style={inputStyle} value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>E-mail</label>
                        <input className="form-input" type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    {role === 'vendor' && (
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Category</label>
                            <select className="form-input" style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} required>
                                <option value="">Select Category</option>
                                <option value="Catering">Catering</option>
                                <option value="Florist">Florist</option>
                                <option value="Decoration">Decoration</option>
                                <option value="Lighting">Lighting</option>
                            </select>
                        </div>
                    )}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input className="form-input" type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    
                    <button type="submit" style={signupBtnStyle} disabled={loading}>
                        {loading ? '...' : 'Signup'}
                    </button>
                </form>

                <p style={{ marginTop: '20px' }}>
                    Already have an account? <Link to="/login" style={{ color: '#4a76c5' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { color: '#333', fontWeight: 'bold' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '2px solid #4a76c5', fontSize: '1rem' };
const roleBtnStyle = { padding: '8px 20px', borderRadius: '5px', border: '1px solid #4a76c5', cursor: 'pointer' };
const signupBtnStyle = { background: '#4a76c5', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default Signup;
