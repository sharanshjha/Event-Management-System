/**
 * Authentication Routes - Nexus Event Management System v2.0
 * Enhanced security with validation, rate limiting concepts, and improved error handling
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password strength validation
const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain a lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain an uppercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain a number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain a special character');
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin123'];
    if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
        errors.push('Password is too common. Please choose a stronger password');
    }
    
    return errors;
};

// Sanitize user data for response
const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    category: user.category,
    membershipStatus: user.membershipStatus,
    createdAt: user.createdAt
});

// Simple in-memory rate limiting (use Redis in production)
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const checkRateLimit = (email) => {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: now };
    
    // Reset if window has passed
    if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.delete(email);
        return { limited: false, remaining: MAX_ATTEMPTS };
    }
    
    if (attempts.count >= MAX_ATTEMPTS) {
        const resetTime = Math.ceil((attempts.firstAttempt + RATE_LIMIT_WINDOW - now) / 60000);
        return { limited: true, resetTime };
    }
    
    return { limited: false, remaining: MAX_ATTEMPTS - attempts.count };
};

const recordLoginAttempt = (email, success) => {
    if (success) {
        loginAttempts.delete(email);
        return;
    }
    
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: now };
    attempts.count++;
    loginAttempts.set(email, attempts);
};

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, category } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please fill all required fields',
                fields: { name: !name, email: !email, password: !password }
            });
        }

        // Name validation
        if (name.trim().length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters' });
        }

        // Email validation
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Password validation
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ 
                message: passwordErrors[0],
                passwordErrors 
            });
        }

        // Vendor category validation
        if (role === 'vendor') {
            const validCategories = ['Catering', 'Florist', 'Decoration', 'Lighting'];
            if (!category || !validCategories.includes(category)) {
                return res.status(400).json({ 
                    message: 'Please select a valid vendor category',
                    validCategories 
                });
            }
        }

        // Check if user exists (case-insensitive)
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Prevent admin registration through API
        if (role === 'admin') {
            return res.status(403).json({ message: 'Admin registration is not allowed' });
        }

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password,
            role: role || 'user',
            category: role === 'vendor' ? category : null
        });

        if (user) {
            res.status(201).json({
                ...sanitizeUser(user),
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter email and password' });
        }

        const normalizedEmail = email.toLowerCase();

        // Rate limiting check
        const rateLimit = checkRateLimit(normalizedEmail);
        if (rateLimit.limited) {
            return res.status(429).json({ 
                message: `Too many login attempts. Please try again in ${rateLimit.resetTime} minutes`,
                retryAfter: rateLimit.resetTime
            });
        }

        // Find user
        const user = await User.findOne({ email: normalizedEmail });

        // Demo accounts bypass (for testing only - remove in production)
        const testAccounts = {
            'user@event.com': { name: 'Rahul Sharma', role: 'user' },
            'vendor@event.com': { name: 'Sharma Catering Hub', role: 'vendor', category: 'Catering' },
            'admin@event.com': { name: 'Admin Patel', role: 'admin' }
        };

        if (testAccounts[normalizedEmail] && password === 'password123') {
            let testUser = user;
            if (!testUser) {
                testUser = await User.create({
                    name: testAccounts[normalizedEmail].name,
                    email: normalizedEmail,
                    password: 'password123',
                    role: testAccounts[normalizedEmail].role,
                    category: testAccounts[normalizedEmail].category
                });
            }
            
            recordLoginAttempt(normalizedEmail, true);
            
            return res.json({
                ...sanitizeUser(testUser),
                token: generateToken(testUser._id)
            });
        }

        // Regular authentication
        if (user && (await user.matchPassword(password))) {
            recordLoginAttempt(normalizedEmail, true);
            
            res.json({
                ...sanitizeUser(user),
                token: generateToken(user._id)
            });
        } else {
            recordLoginAttempt(normalizedEmail, false);
            
            // Generic error message to prevent user enumeration
            res.status(401).json({ 
                message: 'Invalid email or password',
                remaining: rateLimit.remaining - 1
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization required' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(sanitizeUser(user));
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        res.status(500).json({ message: 'Authentication failed' });
    }
});

/**
 * @route   POST /api/auth/validate-password
 * @desc    Validate password strength (for frontend)
 * @access  Public
 */
router.post('/validate-password', (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ valid: false, errors: ['Password is required'] });
    }
    
    const errors = validatePassword(password);
    res.json({ 
        valid: errors.length === 0, 
        errors,
        strength: Math.max(0, 5 - errors.length)
    });
});

module.exports = router;
