const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

// অটোমেটেড প্রোডাক্ট লিস্ট
let products = [
    { id: 1, name: "Gaming Headset", price: 2500, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
    { id: 2, name: "Mechanical Keyboard", price: 3500, img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300" },
    { id: 3, name: "Cyberpunk Mouse", price: 1800, img: "https://images.unsplash.com/photo-1527698266440-12104e498b76?w=300" },
    { id: 4, name: "Smart Watch Pro", price: 4200, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" }
];

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/checkout', (req, res) => {
    const order = {
        orderId: "DARAZ-" + Math.floor(Math.random() * 900000 + 100000),
        customer: req.body.name,
        address: req.body.address,
        total: req.body.total,
        status: "Processing",
        date: new Date().toLocaleString()
    };
    res.json({ success: true, bill: order });
});

app.listen(PORT, () => console.log(`Daraz Clone running on ${PORT}`));
