const Watermark = () => {
    return (
        <div style={{
            padding: '10px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#888',
            opacity: 0.6,
            fontStyle: 'italic',
            marginTop: '20px'
        }}>
            Developed with ❤️ by <span style={{ fontWeight: 'bold' }}>Sharansh Jha</span>
        </div>
    );
};

export default Watermark;
