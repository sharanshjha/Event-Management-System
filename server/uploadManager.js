const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require('dotenv');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// High-quality public source images (Pexels/Pixabay direct)
const sourceImages = {
    // Catering
    'catering_1': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800', // Indian Food
    'catering_2': 'https://images.pexels.com/photos/9609846/pexels-photo-9609846.jpeg?auto=compress&cs=tinysrgb&w=800', // Biryani
    'catering_3': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800', // Sweet
    'catering_4': 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=800', // Curry

    // Florist
    'florist_1': 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800', // Roses
    'florist_2': 'https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=800', // Wedding Decor
    'florist_3': 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=800', // Arch
    'florist_4': 'https://images.pexels.com/photos/1035665/pexels-photo-1035665.jpeg?auto=compress&cs=tinysrgb&w=800', // Flowers

    // Decoration
    'decor_1': 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800', // Balloons
    'decor_2': 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800', // Wedding Stage
    'decor_3': 'https://images.pexels.com/photos/341372/pexels-photo-341372.jpeg?auto=compress&cs=tinysrgb&w=800', // Lights
    'decor_4': 'https://images.pexels.com/photos/3358873/pexels-photo-3358873.jpeg?auto=compress&cs=tinysrgb&w=800', // Candles

    // Lighting
    'light_1': 'https://images.pexels.com/photos/220583/pexels-photo-220583.jpeg?auto=compress&cs=tinysrgb&w=800', // Fairy Lights
    'light_2': 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', // Party Lights
    'light_3': 'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=800', // Neon
    'light_4': 'https://images.pexels.com/photos/281184/pexels-photo-281184.jpeg?auto=compress&cs=tinysrgb&w=800'  // Chandelier
};

async function uploadImages() {
    console.log('🚀 Starting Cloudinary Upload Process...');
    const uploadedUrls = {};

    for (const [key, url] of Object.entries(sourceImages)) {
        try {
            console.log(`Uploading ${key}...`);
            const result = await cloudinary.uploader.upload(url, {
                folder: 'nexus-v2-assets',
                public_id: key,
                overwrite: true
            });
            uploadedUrls[key] = result.secure_url;
            console.log(`✅ Uploaded ${key}`);
        } catch (error) {
            console.error(`❌ Failed ${key}:`, error);
            // Fallback to original if upload fails
            uploadedUrls[key] = url;
        }
    }

    console.log('\n✨ Upload Complete!');
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'imageMap.json'), JSON.stringify(uploadedUrls, null, 2));
    console.log('💾 Map saved to server/imageMap.json');
    
    return uploadedUrls;
}

if (require.main === module) {
    uploadImages();
}

module.exports = { sourceImages: uploadImages };
