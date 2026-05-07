const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ফাইল আপলোড সেটিংস (প্রোডাক্ট ইমেজের জন্য)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// ডেমো ডাটাবেজ (সার্ভার রিস্টার্ট দিলে এটি মুছে যাবে, তবে টেস্ট করার জন্য পারফেক্ট)
let products = [
    { id: 1, name: "WiFi Pineapple", price: 5000, img: "https://via.placeholder.com/150" },
    { id: 2, name: "Rubber Ducky", price: 1200, img: "https://via.placeholder.com/150" }
];
let orders = [];

// প্রোডাক্ট লিস্ট দেখা
app.get('/api/products', (req, res) => res.json(products));

// নতুন প্রোডাক্ট অ্যাড করা (সেলার প্যানেল)
app.post('/api/add-product', upload.single('image'), (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        img: req.file ? `/uploads/${req.file.filename}` : "https://via.placeholder.com/150"
    };
    products.push(newProduct);
    res.json({ success: true });
});

// অর্ডার এবং বিলিং প্রসেস
app.post('/api/checkout', (req, res) => {
    const order = {
        orderId: "ORD" + Date.now(),
        customer: req.body.name,
        total: req.body.total,
        date: new Date().toLocaleString()
    };
    orders.push(order);
    res.json({ success: true, bill: order });
});

app.listen(PORT, () => console.log(`E-commerce Shop Live on ${PORT}`));
