const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'skillshare',
    },
});

module.exports = {
    cloudinary, storage,
};