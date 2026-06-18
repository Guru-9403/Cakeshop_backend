const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    // Either "/uploads/xyz.jpg" (uploaded via admin panel) or a legacy filename/URL
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    unit: { type: String, required: true, enum: ['kg', 'pcs', 'pkt'] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
