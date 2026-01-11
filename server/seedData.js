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

// Product Data by Category with High Quality Images
const productsByCategory = {
    Catering: [
        { name: 'Paneer Tikka Platter', price: 2500, description: 'Serves 25 guests. Marinated cottage cheese with mint chutney', image: 'https://images.unsplash.com/photo-1599487488170-d11ec93a730d?q=80&w=800' },
        { name: 'Biryani (Veg)', price: 3500, description: 'Aromatic basmati rice with vegetables. Serves 30 guests', image: 'https://images.unsplash.com/photo-1589302168068-964694db93a9?q=80&w=800' },
        { name: 'Biryani (Chicken)', price: 4500, description: 'Hyderabadi style chicken biryani. Serves 30 guests', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800' },
        { name: 'Butter Chicken', price: 4000, description: 'Creamy tomato curry with tender chicken. Serves 25 guests', image: 'https://images.unsplash.com/photo-1603894584202-0ca2066c0780?q=80&w=800' },
        { name: 'Dal Makhani', price: 2000, description: 'Slow-cooked black lentils in butter cream. Serves 25 guests', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800' },
        { name: 'Gulab Jamun', price: 1500, description: 'Traditional milk solid dessert. 50 pieces', image: 'https://images.unsplash.com/photo-1605197509751-62447751f85d?q=80&w=800' },
        { name: 'Rasmalai', price: 2000, description: 'Soft paneer in sweet saffron milk. 40 pieces', image: 'https://images.unsplash.com/photo-1626202346584-c7db905d6fd5?q=80&w=800' },
        { name: 'Live Chaat Counter', price: 8000, description: 'Pani puri, bhel, dahi puri station for 100 guests', image: 'https://images.unsplash.com/photo-1601050690597-df056fb1cd2a?q=80&w=800' },
        { name: 'South Indian Breakfast', price: 5000, description: 'Dosa, idli, vada with chutneys. Serves 50 guests', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800' },
        { name: 'Tandoori Roti Set', price: 1200, description: 'Assortment of naan, roti, paratha. 50 pieces', image: 'https://images.unsplash.com/photo-1585937421612-70a0f2fd55c1?q=80&w=800' },
        { name: 'Pav Bhaji Counter', price: 3500, description: 'Mumbai style pav bhaji for 50 guests', image: 'https://images.unsplash.com/photo-1626132646522-3837ad45e7f1?q=80&w=800' },
        { name: 'Ice Cream Sundae Bar', price: 4500, description: 'Premium ice creams with toppings for 75 guests', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800' }
    ],
    Florist: [
        { name: 'Marigold Garland Set', price: 1500, description: '20 feet of fresh marigold decorations', image: 'https://images.unsplash.com/photo-1596434316352-7cd093845f06?q=80&w=800' },
        { name: 'Rose Bouquet Premium', price: 2500, description: '50 premium red roses with baby breath', image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800' },
        { name: 'Jasmine Veni Set', price: 800, description: 'Traditional jasmine strings for bride', image: 'https://images.unsplash.com/photo-1549413280-99419b671a53?q=80&w=800' },
        { name: 'Stage Flower Decoration', price: 15000, description: 'Complete stage backdrop with fresh flowers', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800' },
        { name: 'Car Decoration', price: 5000, description: 'Wedding car flower decoration with ribbons', image: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?q=80&w=800' },
        { name: 'Table Centerpiece Set', price: 6000, description: '10 elegant table arrangements', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800' },
        { name: 'Orchid Arrangement', price: 8000, description: 'Exotic orchids in premium ceramic vase', image: 'https://images.unsplash.com/photo-1567606117528-5febf1ea942b?q=80&w=800' },
        { name: 'Mandap Decoration', price: 25000, description: 'Traditional wedding mandap with flowers', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800' },
        { name: 'Welcome Arch', price: 12000, description: 'Floral entrance arch (8ft x 6ft)', image: 'https://images.unsplash.com/photo-1507038772120-7f415309328c?q=80&w=800' },
        { name: 'Haldi Decoration Set', price: 8000, description: 'Yellow flowers & marigold for haldi ceremony', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800' }
    ],
    Decoration: [
        { name: 'Balloon Arch Kit', price: 3500, description: 'Premium latex balloons with stand. 6ft arch', image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800' },
        { name: 'LED Curtain Lights', price: 2500, description: '10ft x 10ft warm white fairy lights', image: 'https://images.unsplash.com/photo-1543039625-14bc380489a3?q=80&w=800' },
        { name: 'Paper Lantern Set', price: 1800, description: '25 assorted colorful paper lanterns', image: 'https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?q=80&w=800' },
        { name: 'Photo Booth Props', price: 2000, description: '50+ fun props with booth frame', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800' },
        { name: 'Rangoli Stickers', price: 500, description: 'Traditional rangoli floor stickers. 5 designs', image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=800' },
        { name: 'Toran Set', price: 1200, description: 'Door hangings with beads and fabric', image: 'https://images.unsplash.com/photo-1516131397224-33e57f51ee2d?q=80&w=800' },
        { name: 'Table Runner Set', price: 3000, description: '10 premium silk table runners', image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800' },
        { name: 'Backdrop Stand', price: 4500, description: 'Adjustable backdrop frame with curtain', image: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?q=80&w=800' },
        { name: 'Floating Candles', price: 800, description: '50 floating tea lights for urlis', image: 'https://images.unsplash.com/photo-1502990313206-7f37a9514bea?q=80&w=800' },
        { name: 'Ganesh Idol Decor', price: 2500, description: 'Decorated Ganesh setup for entrance', image: 'https://images.unsplash.com/photo-1567591974574-e85263d4ecd4?q=80&w=800' },
        { name: 'Name Board Customized', price: 3500, description: 'LED name board with couple names', image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800' },
        { name: 'Sangeet Stage Setup', price: 18000, description: 'Complete sangeet decoration package', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800' }
    ],
    Lighting: [
        { name: 'Fairy Light Bundle', price: 1500, description: '100m warm white fairy lights', image: 'https://images.unsplash.com/photo-1516450360452-9312b3e8bd10?q=80&w=800' },
        { name: 'DJ Lights Set', price: 8000, description: 'Moving head lights for party atmosphere', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800' },
        { name: 'Uplighting Package', price: 12000, description: '20 uplights for venue walls', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=800' },
        { name: 'Chandeliers Rental', price: 15000, description: '4 crystal chandeliers for mandap', image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800' },
        { name: 'Neon Sign Custom', price: 5000, description: 'Custom text neon sign (up to 10 letters)', image: 'https://images.unsplash.com/photo-1563245394-57d5c0fed619?q=80&w=800' },
        { name: 'Paper Lamp Strings', price: 2000, description: '50 decorative paper lamps', image: 'https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?q=80&w=800' },
        { name: 'Spotlight Set', price: 6000, description: '4 spotlights with stands', image: 'https://images.unsplash.com/photo-1508700115892-45ecd056263c?q=80&w=800' },
        { name: 'Candle Stand Set', price: 3500, description: '15 vintage candle stands', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800' },
        { name: 'LED Dance Floor', price: 25000, description: '10x10 ft LED dance floor rental', image: 'https://images.unsplash.com/photo-1514525253344-f814d0743b1a?q=80&w=800' },
        { name: 'Laser Light Show', price: 15000, description: 'Professional laser effects for 3 hours', image: 'https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=800' }
    ]
};

// Vendor Profile Images by Category
const vendorImages = {
    Catering: [
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400'
    ],
    Florist: [
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400',
        'https://images.unsplash.com/photo-1487070117204-b220b8888b7c?q=80&w=400',
        'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=400',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400'
    ],
    Decoration: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400',
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400'
    ],
    Lighting: [
        'https://images.unsplash.com/photo-1516450360452-9312b3e8bd10?q=80&w=400',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400',
        'https://images.unsplash.com/photo-1508700115892-45ecd056263c?q=80&w=400'
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

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Admin
        await User.create({
            name: 'Rajesh Kumar',
            email: 'admin@event.com',
            password: hashedPassword,
            role: 'admin',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400'
        });
        console.log('👑 Admin created');

        // Create Demo Vendor
        await User.create({
            name: 'Royal Catering Services',
            email: 'vendor@event.com',
            password: hashedPassword,
            role: 'vendor',
            category: 'Catering',
            profileImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400',
            membershipStatus: 'active',
            membershipDuration: '1year',
            membershipStart: new Date(),
            membershipEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            addresses: [{
                street: '123, Luxury Plaza, MG Road',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India',
                isDefault: true
            }]
        });
        console.log('🏪 Demo Vendor created');

        // Create Demo User
        await User.create({
            name: 'Rahul Sharma',
            email: 'user@event.com',
            password: hashedPassword,
            role: 'user',
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
            addresses: [{
                street: '45, Sunshine Apartments, Powai',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400076',
                country: 'India',
                isDefault: true
            }]
        });
        console.log('👥 Demo User created');

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
            const categoryVendorImages = vendorImages[category];
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
                    profileImage: categoryVendorImages[i] || '',
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
                    image: product.image,
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
