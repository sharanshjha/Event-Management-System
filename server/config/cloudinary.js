const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Diagnostic log (will show in your terminal)
console.log('--- Cloudinary Config Debug ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ MISSING');
console.log('API Secret:', (process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET !== '**********') ? '✅ Set' : '❌ MISSING (or still placeholder)');
console.log('-------------------------------');

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-management-products',
    // Simplified to test if signature issue persists
    resource_type: 'auto'
  }
});

module.exports = { cloudinary, storage };
