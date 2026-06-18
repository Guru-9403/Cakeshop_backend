require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Product = require('./models/Product');

// Carried over from the original hardcoded array in index.html, so the
// storefront keeps working immediately after the switch to MongoDB.
// Note: these "image" values are the original filenames, expected to sit
// alongside index.html on your web host (NOT under /uploads — that folder
// is only used for new images uploaded through the admin panel from now on).
const initialProducts = [
    { name: 'blueberrycake', price: 800, image: 'blueberrycake.jpg', category: 'cake', unit: 'kg' },
    { name: 'butterscotchCake', price: 800, image: 'buttercream cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'pineapple cake', price: 800, image: 'pineapple cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'starawberry cake', price: 800, image: 'starawberry cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'vancho cake', price: 800, image: 'vancho cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'Mango cake', price: 800, image: 'Mango cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'vannila cake', price: 800, image: 'vannila cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'Chocolate Cake', price: 800, image: 'Chocolate cake.jpg', category: 'cake', unit: 'kg' },
    { name: 'black forest Cake', price: 700, image: 'black forest.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'buleberry Cake', price: 800, image: 'Blueberry.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'butterscotch Cake', price: 800, image: 'Butterscotch Cake.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'choco&butterscotch Cake', price: 900, image: 'choco&butterscotch.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'Mango Cake', price: 800, image: 'Mango ice cake.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'nutty bubble Cake', price: 800, image: 'nutty bubble.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'Chocolate truffle Cake', price: 900, image: 'chocolate truffels.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'honey Cake', price: 900, image: 'Honey cake.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'lotus Cake', price: 1300, image: 'lotus biscof.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'Red velvet Cake', price: 900, image: 'Red Velvet Cake.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'Starwberry Cake', price: 800, image: 'strawberry icecake.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'WhiteForest Cake', price: 700, image: 'White Forest Cake.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'WhiteTruffle Cake', price: 800, image: 'white truffle.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'Pineapple Cake', price: 800, image: 'Pineapple.jpg', category: 'FreshCakes', unit: 'kg' },
    { name: 'Veg puff', price: 25, image: 'Veg Puff.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Mushroom puff', price: 30, image: 'Mushroom puff.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Egg puff', price: 30, image: 'Egg puff.jpg', category: 'puffs', unit: 'pcs' },
    { name: 'Panner puff', price: 35, image: 'Paneer puff.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Chicken puff', price: 35, image: 'Chicken puff.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Cheese Onion Roll', price: 70, image: 'Cheese Onion Roll.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Cheese Paneer Roll', price: 70, image: 'PaneerCheese  Roll.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Chicken sauage Roll', price: 70, image: 'Chicken Sauage Roll.jpeg', category: 'puffs', unit: 'pcs' },
    { name: 'Milk Bread', price: 70, image: 'Milk Bread.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'Wheat Bread', price: 70, image: 'Wheat Bread.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'Coconut Bread', price: 70, image: 'Coconut Bread.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'Topping Wheat Bread', price: 70, image: 'Topping Wheat Bread.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'Round bun', price: 70, image: 'Round bun.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'MultiGrains Bread', price: 70, image: 'MultiGrains Bread.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'Fruit Cake', price: 70, image: 'Fruit Cake.jpeg', category: 'Fresh Breads', unit: 'pkt' },
    { name: 'Chocolate Cookie', price: 600, image: 'chocolate cookie.jpeg', category: 'Cookies', unit: 'kg' },
    { name: 'Cashew cookie', price: 600, image: 'Cashew cookie.jpeg', category: 'Cookies', unit: 'kg' },
    { name: 'Red Velvet Cookie', price: 600, image: 'Red Velvet Cookie.jpeg', category: 'Cookies', unit: 'kg' },
    { name: 'butter cookie', price: 600, image: 'butter cookie.jpeg', category: 'Cookies', unit: 'kg' },
    { name: 'Pista cookie', price: 600, image: 'Pista cookie.jpeg', category: 'Cookies', unit: 'kg' }
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // --- Seed admin user ---
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.log('Skipping admin seed: ADMIN_USERNAME / ADMIN_PASSWORD not set in .env');
    } else {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log(`Admin "${username}" already exists, skipping`);
        } else {
            const passwordHash = await bcrypt.hash(password, 10);
            await Admin.create({ username, passwordHash });
            console.log(`Created admin user "${username}"`);
        }
    }

    // --- Seed products (only if the collection is currently empty) ---
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
        console.log(`Products collection already has ${productCount} item(s), skipping product seed`);
    } else {
        await Product.insertMany(initialProducts);
        console.log(`Inserted ${initialProducts.length} starter products`);
    }

    await mongoose.disconnect();
    console.log('Seeding complete');
}

seed().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});
