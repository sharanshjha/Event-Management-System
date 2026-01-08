const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const users = [
    { name: 'Admin User', email: 'admin@event.com', password: 'password123', role: 'admin' },
    { name: 'John User', email: 'user@event.com', password: 'password123', role: 'user' },
    { name: 'Royal Catering', email: 'catering@event.com', password: 'password123', role: 'vendor', category: 'Catering' },
    { name: 'Fresh Florist', email: 'florist@event.com', password: 'password123', role: 'vendor', category: 'Florist' },
    { name: 'Grand Decoration', email: 'decoration@event.com', password: 'password123', role: 'vendor', category: 'Decoration' },
    { name: 'Bright Lighting', email: 'lighting@event.com', password: 'password123', role: 'vendor', category: 'Lighting' }
];

async function seed() {
    console.log('--- RESETTING AND SEEDING DB ---');
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management';
        console.log(`Connecting to: ${uri}`);
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data.');

        // Use individual saves to trigger pre-save hashing
        const createdUsers = [];
        for (let u of users) {
            const user = new User(u);
            await user.save();
            createdUsers.push(user);
            console.log(`Created: ${user.email}`);
        }

        const vendors = createdUsers.filter(u => u.role === 'vendor');
        const products = [
            { name: 'Full Wedding Buffet', price: 45000, category: 'Catering' },
            { name: 'Birthday Snacks', price: 10000, category: 'Catering' },
            { name: 'Rose Decoration Arche', price: 15000, category: 'Florist' },
            { name: 'Main Stage Lighting', price: 12000, category: 'Lighting' },
            { name: 'Lounge Decor', price: 20000, category: 'Decoration' }
        ];

        for (let p of products) {
            const vendor = vendors.find(v => v.category === p.category);
            if (vendor) {
                await Product.create({
                    ...p,
                    vendorId: vendor._id,
                    description: 'Generated dummy product for testing'
                });
                console.log(`Created Product: ${p.name}`);
            }
        }

        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED:', err);
        process.exit(1);
    }
}

seed();
