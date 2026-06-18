require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Catches multer errors (bad file type, too large) and anything else thrown in routes
app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        return res.status(400).json({ error: err.message || 'Something went wrong' });
    }
    next();
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
