const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// ডাটাবেজ সিমুলেশন
let products = [
    { id: 101, name: "Wireless Mouse", price: 1200, category: "tech", img: "https://images.unsplash.com/photo-1527698266440-12104e498b76?w=200" },
    { id: 102, name: "Mechanical Keyboard", price: 3500, category: "tech", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200" },
    { id: 103, name: "Smart Watch", price: 2500, category: "fashion", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" }
];
let userInterests = {}; // ইউজার আইডি অনুযায়ী ক্যাটাগরি ট্র্যাকিং

// লগইন এবং ডাটা রিট্রিভ
app.post('/api/login', (req, res) => {
    const { userId } = req.body;
    if (!userInterests[userId]) userInterests[userId] = [];
    res.json({ success: true, history: userInterests[userId] });
});

// ইউজারের ক্লিক ট্র্যাক করা (পর্যালোচনা)
app.post('/api/track-click', (req, res) => {
    const { userId, category } = req.body;
    if (userId && userInterests[userId]) {
        userInterests[userId].push(category); // কোন ক্যাটাগরিতে ক্লিক করছে তা সেভ হচ্ছে
    }
    res.json({ success: true });
});

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/add-product', upload.single('image'), (req, res) => {
    const product = {
        id: Date.now(),
        name: req.body.name,
        category: req.body.category || "general",
        price: req.body.price,
        img: req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/150'
    };
    products.push(product);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Smart Daraz running on ${PORT}`));
