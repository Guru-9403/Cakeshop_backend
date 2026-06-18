const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'yara-cakes',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        // Cloudinary will generate a unique public_id automatically if we don't set one
    }
});

const allowedTypes = /jpeg|jpg|png|webp|gif/;

function fileFilter(req, file, cb) {
    const mimeOk = allowedTypes.test(file.mimetype);
    if (mimeOk) {
        return cb(null, true);
    }
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed'));
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
