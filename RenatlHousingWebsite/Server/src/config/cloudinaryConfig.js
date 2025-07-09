import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // e.g., 'your_cloud_name'
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g., 'your_api_key'
  api_secret: process.env.CLOUDINARY_API_SECRET  // e.g., 'your_api_secret'
});

export default cloudinary;
