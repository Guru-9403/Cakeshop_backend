const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const requireAdminAuth = require('../middleware/authMiddleware');

const router = express.Router();

// Public: list all products (used by the storefront)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });
        res.json(products);
    } catch (err) {
        console.error('Fetch products error:', err);
        res.status(500).json({ error: 'Could not fetch products' });
    }
});

// Protected: create a new product (multipart/form-data with an "image" file)
router.post('/', requireAdminAuth, upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, unit } = req.body;
        if (!name || !price || !category || !unit || !req.file) {
            return res.status(400).json({ error: 'Name, price, category, unit, and image are all required' });
        }

        const product = await Product.create({
            name,
            price: parseFloat(price),
            category,
            unit,
            image: `/uploads/${req.file.filename}`
        });

        res.status(201).json(product);
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ error: 'Could not create product' });
    }
});

// Protected: update a product. New image is optional — if omitted, the old one is kept.
router.put('/:id', requireAdminAuth, upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, unit } = req.body;
        const existing = await Product.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updates = { name, price: parseFloat(price), category, unit };

        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
            // Best-effort cleanup of the old uploaded file (ignore if it doesn't exist / isn't ours)
            if (existing.image && existing.image.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '..', existing.image);
                fs.unlink(oldPath, () => {});
            }
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updated);
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ error: 'Could not update product' });
    }
});

// Protected: delete a product (and its uploaded image file, if we own it)
router.delete('/:id', requireAdminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.image && product.image.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', product.image);
            fs.unlink(filePath, () => {});
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ error: 'Could not delete product' });
    }
});

module.exports = router;
