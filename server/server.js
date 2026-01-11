/**
 * Nexus Event Management System - Server Entry Point
 * Version: 2.0
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const vendorRoutes = require('./routes/vendor');
const userRoutes = require('./routes/user');

// Connect to MongoDB
connectDB();

const app = express();

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging (Development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ═══════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'Nexus Event Management API',
        version: '2.0',
        status: 'running',
        documentation: '/api/health',
        endpoints: {
            auth: '/api/auth',
            admin: '/api/admin',
            vendor: '/api/vendor',
            user: '/api/user'
        }
    });
});

// Health check with system info
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        environment: process.env.NODE_ENV || 'development',
        services: {
            database: 'connected',
            cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/user', userRoutes);

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        availableRoutes: ['/api/auth', '/api/admin', '/api/vendor', '/api/user']
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('━'.repeat(50));
    console.error(`[ERROR] ${new Date().toISOString()}`);
    console.error(`[PATH] ${req.method} ${req.path}`);
    console.error(`[MESSAGE] ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(`[STACK] ${err.stack}`);
    }
    console.error('━'.repeat(50));

    // Handle specific error types
    if (err.name === 'MulterError') {
        return res.status(400).json({ 
            error: 'Upload Error',
            message: err.message 
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Validation Error',
            message: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            error: 'Authentication Error',
            message: 'Invalid token' 
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            error: 'Authentication Error',
            message: 'Token expired, please login again' 
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ 
            error: 'Duplicate Error',
            message: `${field} already exists` 
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: 'Server Error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message
    });
});

// ═══════════════════════════════════════════════════════════════
// SERVER INITIALIZATION
// ═══════════════════════════════════════════════════════════════

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log('\n' + '═'.repeat(50));
    console.log('  ✨ NEXUS EVENT MANAGEMENT SYSTEM v2.0');
    console.log('═'.repeat(50));
    console.log(`  🚀 Server running on port ${PORT}`);
    console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  📅 Started: ${new Date().toLocaleString()}`);
    console.log('═'.repeat(50) + '\n');
});

module.exports = app;
