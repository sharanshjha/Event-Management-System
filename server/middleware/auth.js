/**
 * Authentication & Authorization Middleware
 * Nexus Event Management System v2.0
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token
 * Adds user object to request if token is valid
 */
const protect = async (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Access token required' 
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Invalid token format' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'User not found' 
            });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Invalid token' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Token expired. Please login again.' 
            });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            error: 'Server Error',
            message: 'Authentication failed' 
        });
    }
};

/**
 * Role-based access control middleware
 * Creates a middleware that checks if user has one of the allowed roles
 */
const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'User not authenticated' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
                yourRole: req.user.role
            });
        }

        next();
    };
};

// Specific role middlewares
const adminOnly = roleCheck('admin');
const vendorOnly = roleCheck('vendor');
const userOnly = roleCheck('user');
const vendorOrAdmin = roleCheck('vendor', 'admin');

/**
 * Optional auth - Doesn't fail if no token, but attaches user if valid
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token && token !== 'null' && token !== 'undefined') {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
            }
        }
    } catch (error) {
        // Silent fail - user just won't be attached
        req.user = null;
    }
    next();
};

/**
 * Active vendor check - Ensures vendor has active membership
 */
const activeVendorOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'User not authenticated' 
        });
    }

    if (req.user.role !== 'vendor') {
        return res.status(403).json({ 
            error: 'Forbidden',
            message: 'Vendor access required' 
        });
    }

    if (req.user.membershipStatus !== 'active') {
        return res.status(403).json({ 
            error: 'Membership Required',
            message: 'Your vendor membership is not active. Please contact admin.',
            membershipStatus: req.user.membershipStatus
        });
    }

    next();
};

/**
 * Request sanitizer - Basic XSS prevention
 */
const sanitizeRequest = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
        }
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                obj[key] = sanitize(obj[key]);
            }
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};

module.exports = { 
    protect, 
    adminOnly, 
    vendorOnly, 
    userOnly,
    vendorOrAdmin,
    optionalAuth,
    activeVendorOnly,
    roleCheck,
    sanitizeRequest
};
