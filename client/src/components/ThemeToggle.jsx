import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
        }}>
            <button 
                onClick={toggleDarkMode}
                style={{
                    background: darkMode ? '#ffffff' : '#4a76c5',
                    color: darkMode ? '#4a76c5' : '#ffffff',
                    border: 'none',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                }}
            >
                {darkMode ? '☀️' : '🌙'}
            </button>
            <span style={{ 
                fontSize: '0.7rem', 
                color: darkMode ? 'white' : '#666', 
                background: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
                padding: '2px 8px',
                borderRadius: '10px'
            }}>
                Mode
            </span>
        </div>
    );
};

export default ThemeToggle;
