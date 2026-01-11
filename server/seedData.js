/**
 * Seed Script for Nexus Event Management System
 * Populates the database with realistic Indian users, vendors, and products
 * Run: node server/seedData.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus_event';

// Indian Names Data
const indianNames = {
    firstNames: [
        'Aarav', 'Arjun', 'Vivaan', 'Aditya', 'Vihaan', 'Reyansh', 'Krishna', 'Ishaan',
        'Shaurya', 'Atharv', 'Advait', 'Ayaan', 'Dhruv', 'Kabir', 'Rishi', 'Yash',
        'Priya', 'Ananya', 'Diya', 'Aditi', 'Kiara', 'Saanvi', 'Ishita', 'Aanya',
        'Mira', 'Kavya', 'Riya', 'Neha', 'Pooja', 'Shreya', 'Tanvi', 'Simran',
        'Rohan', 'Karan', 'Rahul', 'Amit', 'Vikram', 'Nikhil', 'Sanjay', 'Rajesh',
        'Meera', 'Anjali', 'Sakshi', 'Nisha', 'Deepika', 'Sneha', 'Kritika', 'Divya'
    ],
    lastNames: [
        'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Agarwal', 'Joshi',
        'Shah', 'Reddy', 'Rao', 'Iyer', 'Nair', 'Menon', 'Pillai', 'Desai',
        'Mehta', 'Jain', 'Chopra', 'Malhotra', 'Kapoor', 'Khanna', 'Bhatia', 'Bansal',
        'Chauhan', 'Yadav', 'Mishra', 'Pandey', 'Tiwari', 'Saxena', 'Sinha', 'Thakur'
    ],
    businessSuffixes: ['Events', 'Creations', 'Services', 'Solutions', 'Studio', 'Hub', 'Works', 'Craft']
};

// Product Data by Category
const productsByCategory = {
    Catering: [
        { name: 'Paneer Tikka Platter', price: 2500, description: 'Serves 25 guests. Marinated cottage cheese with mint chutney' },
        { name: 'Biryani (Veg)', price: 3500, description: 'Aromatic basmati rice with vegetables. Serves 30 guests' },
        { name: 'Biryani (Chicken)', price: 4500, description: 'Hyderabadi style chicken biryani. Serves 30 guests' },
        { name: 'Butter Chicken', price: 4000, description: 'Creamy tomato curry with tender chicken. Serves 25 guests' },
        { name: 'Dal Makhani', price: 2000, description: 'Slow-cooked black lentils in butter cream. Serves 25 guests' },
        { name: 'Gulab Jamun', price: 1500, description: 'Traditional milk solid dessert. 50 pieces' },
        { name: 'Rasmalai', price: 2000, description: 'Soft paneer in sweet saffron milk. 40 pieces' },
        { name: 'Live Chaat Counter', price: 8000, description: 'Pani puri, bhel, dahi puri station for 100 guests' },
        { name: 'South Indian Breakfast', price: 5000, description: 'Dosa, idli, vada with chutneys. Serves 50 guests' },
        { name: 'Tandoori Roti Set', price: 1200, description: 'Assortment of naan, roti, paratha. 50 pieces' },
        { name: 'Pav Bhaji Counter', price: 3500, description: 'Mumbai style pav bhaji for 50 guests' },
        { name: 'Ice Cream Sundae Bar', price: 4500, description: 'Premium ice creams with toppings for 75 guests' }
    ],
    Florist: [
        { name: 'Marigold Garland Set', price: 1500, description: '20 feet of fresh marigold decorations' },
        { name: 'Rose Bouquet Premium', price: 2500, description: '50 premium red roses with baby breath' },
        { name: 'Jasmine Veni Set', price: 800, description: 'Traditional jasmine strings for bride' },
        { name: 'Stage Flower Decoration', price: 15000, description: 'Complete stage backdrop with fresh flowers' },
        { name: 'Car Decoration', price: 5000, description: 'Wedding car flower decoration with ribbons' },
        { name: 'Table Centerpiece Set', price: 6000, description: '10 elegant table arrangements' },
        { name: 'Orchid Arrangement', price: 8000, description: 'Exotic orchids in premium ceramic vase' },
        { name: 'Mandap Decoration', price: 25000, description: 'Traditional wedding mandap with flowers' },
        { name: 'Welcome Arch', price: 12000, description: 'Floral entrance arch (8ft x 6ft)' },
        { name: 'Haldi Decoration Set', price: 8000, description: 'Yellow flowers & marigold for haldi ceremony' }
    ],
    Decoration: [
        { name: 'Balloon Arch Kit', price: 3500, description: 'Premium latex balloons with stand. 6ft arch' },
        { name: 'LED Curtain Lights', price: 2500, description: '10ft x 10ft warm white fairy lights' },
        { name: 'Paper Lantern Set', price: 1800, description: '25 assorted colorful paper lanterns' },
        { name: 'Photo Booth Props', price: 2000, description: '50+ fun props with booth frame' },
        { name: 'Rangoli Stickers', price: 500, description: 'Traditional rangoli floor stickers. 5 designs' },
        { name: 'Toran Set', price: 1200, description: 'Door hangings with beads and fabric' },
        { name: 'Table Runner Set', price: 3000, description: '10 premium silk table runners' },
        { name: 'Backdrop Stand', price: 4500, description: 'Adjustable backdrop frame with curtain' },
        { name: 'Floating Candles', price: 800, description: '50 floating tea lights for urlis' },
        { name: 'Ganesh Idol Decor', price: 2500, description: 'Decorated Ganesh setup for entrance' },
        { name: 'Name Board Customized', price: 3500, description: 'LED name board with couple names' },
        { name: 'Sangeet Stage Setup', price: 18000, description: 'Complete sangeet decoration package' }
    ],
    Lighting: [
        { name: 'Fairy Light Bundle', price: 1500, description: '100m warm white fairy lights' },
        { name: 'DJ Lights Set', price: 8000, description: 'Moving head lights for party atmosphere' },
        { name: 'Uplighting Package', price: 12000, description: '20 uplights for venue walls' },
        { name: 'Chandeliers Rental', price: 15000, description: '4 crystal chandeliers for mandap' },
        { name: 'Neon Sign Custom', price: 5000, description: 'Custom text neon sign (up to 10 letters)' },
        { name: 'Paper Lamp Strings', price: 2000, description: '50 decorative paper lamps' },
        { name: 'Spotlight Set', price: 6000, description: '4 spotlights with stands' },
        { name: 'Candle Stand Set', price: 3500, description: '15 vintage candle stands' },
        { name: 'LED Dance Floor', price: 25000, description: '10x10 ft LED dance floor rental' },
        { name: 'Laser Light Show', price: 15000, description: 'Professional laser effects for 3 hours' }
    ]
};

// Cities for addresses
const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 
    'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Indore', 'Surat'
];

const indianStates = {
    'Mumbai': 'Maharashtra', 'Delhi': 'Delhi', 'Bangalore': 'Karnataka',
    'Chennai': 'Tamil Nadu', 'Kolkata': 'West Bengal', 'Hyderabad': 'Telangana',
    'Pune': 'Maharashtra', 'Ahmedabad': 'Gujarat', 'Jaipur': 'Rajasthan',
    'Lucknow': 'Uttar Pradesh', 'Chandigarh': 'Punjab', 'Kochi': 'Kerala',
    'Indore': 'Madhya Pradesh', 'Surat': 'Gujarat'
};

// Utility functions
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateEmail = (name) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '');
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    return `${cleanName}${randomNumber(1, 999)}@${randomItem(domains)}`;
};

const generatePhone = () => {
    const prefixes = ['98', '99', '97', '96', '95', '94', '93', '88', '87', '86'];
    return `${randomItem(prefixes)}${randomNumber(10000000, 99999999)}`;
};

const generateBusinessName = (category) => {
    const name = randomItem(indianNames.lastNames);
    const suffix = randomItem(indianNames.businessSuffixes);
    return `${name}'s ${category} ${suffix}`;
};

// Main seeding function
async function seedDatabase() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing)
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({ email: { $nin: ['admin@event.com', 'vendor@event.com', 'user@event.com'] } });
        await Product.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Admin (if not exists)
        const existingAdmin = await User.findOne({ email: 'admin@event.com' });
        if (!existingAdmin) {
            await User.create({
                name: 'Rajesh Kumar (Admin)',
                email: 'admin@event.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('👑 Admin created');
        }

        // Create Users
        console.log('👥 Creating users...');
        const users = [];
        for (let i = 0; i < 25; i++) {
            const firstName = randomItem(indianNames.firstNames);
            const lastName = randomItem(indianNames.lastNames);
            const name = `${firstName} ${lastName}`;
            const city = randomItem(indianCities);
            
            const user = await User.create({
                name,
                email: generateEmail(name),
                password: hashedPassword,
                role: 'user',
                addresses: [{
                    street: `${randomNumber(1, 500)}, ${randomItem(['MG Road', 'Station Road', 'Gandhi Nagar', 'Nehru Street', 'Patel Colony'])}`,
                    city,
                    state: indianStates[city],
                    zipCode: `${randomNumber(100000, 999999)}`,
                    country: 'India',
                    isDefault: true
                }]
            });
            users.push(user);
        }
        console.log(`✅ Created ${users.length} users`);

        // Create Vendors
        console.log('🏪 Creating vendors...');
        const vendors = [];
        const categories = ['Catering', 'Florist', 'Decoration', 'Lighting'];
        
        for (const category of categories) {
            for (let i = 0; i < 4; i++) {
                const businessName = generateBusinessName(category);
                const city = randomItem(indianCities);
                const isActive = Math.random() > 0.3;
                
                const vendor = await User.create({
                    name: businessName,
                    email: generateEmail(businessName),
                    password: hashedPassword,
                    role: 'vendor',
                    category,
                    membershipStatus: isActive ? 'active' : 'inactive',
                    membershipDuration: randomItem(['6months', '1year', '2years']),
                    membershipStart: isActive ? new Date() : null,
                    membershipEnd: isActive ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) : null,
                    addresses: [{
                        street: `Shop ${randomNumber(1, 100)}, ${randomItem(['Commercial Complex', 'Market Road', 'Business Park', 'Trade Center'])}`,
                        city,
                        state: indianStates[city],
                        zipCode: `${randomNumber(100000, 999999)}`,
                        country: 'India',
                        isDefault: true
                    }]
                });
                vendors.push(vendor);
            }
        }
        console.log(`✅ Created ${vendors.length} vendors`);

        // Create Products
        console.log('📦 Creating products...');
        let productCount = 0;
        
        for (const vendor of vendors) {
            const categoryProducts = productsByCategory[vendor.category];
            const numProducts = randomNumber(5, categoryProducts.length);
            
            const shuffled = [...categoryProducts].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffled.slice(0, numProducts);
            
            for (const product of selectedProducts) {
                const priceVariation = randomNumber(-200, 500);
                await Product.create({
                    name: product.name,
                    price: Math.max(100, product.price + priceVariation),
                    description: product.description,
                    category: vendor.category,
                    vendorId: vendor._id,
                    status: Math.random() > 0.15 ? 'active' : 'pending'
                });
                productCount++;
            }
        }
        console.log(`✅ Created ${productCount} products`);

        // Summary
        console.log('\n🎉 Seeding Complete!\n');
        console.log('━'.repeat(40));
        console.log('📊 Database Summary:');
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   🏪 Vendors: ${vendors.length}`);
        console.log(`   📦 Products: ${productCount}`);
        console.log('━'.repeat(40));
        console.log('\n🔐 Demo Accounts:');
        console.log('   Admin:  admin@event.com / password123');
        console.log('   Vendor: vendor@event.com / password123');
        console.log('   User:   user@event.com / password123');
        console.log('\n   All seeded accounts use password: password123');
        
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
}

// Run the seeder
seedDatabase();
