const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    // Either a full Cloudinary URL (new uploads) or a legacy "/uploads/xyz.jpg" path
    image: { type: String, required: true },
    // Cloudinary public_id, used to delete the image from Cloudinary when the product is removed/replaced
    imagePublicId: { type: String },
    category: { type: String, required: true, trim: true },
    unit: { type: String, required: true, enum: ['kg', 'pcs', 'pkt'] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
