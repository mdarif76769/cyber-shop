const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

// ডাটা স্টোর (ডাটাবেজ হিসেবে কাজ করবে)
let products = [];
let orders = [];

// ১. সেলারের জন্য প্রোডাক্ট পোস্ট করা
app.post('/api/seller/post', (req, res) => {
    const product = {
        id: "P" + Date.now(),
        name: req.body.name,
        price: req.body.price,
        img: req.body.img || "https://via.placeholder.com/150",
        sales: 0 // শুরুতে ০ সেল
    };
    products.push(product);
    res.json({ success: true, product });
});

// ২. বায়ারের জন্য প্রোডাক্ট কেনা (অর্ডার আসা)
app.post('/api/buyer/order', (req, res) => {
    const { productId, customerName, address } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (product) {
        product.sales += 1; // সেলারের ঐ প্রোডাক্টের সেল ১ বাড়লো
        const newOrder = {
            orderId: "ORD" + Date.now(),
            productName: product.name,
            customer: customerName,
            address: address,
            amount: product.price,
            date: new Date().toLocaleString()
        };
        orders.push(newOrder);
        res.json({ success: true, order: newOrder });
    } else {
        res.status(404).json({ success: false, msg: "Product not found" });
    }
});

// ৩. সেলারের ড্যাশবোর্ড ডাটা (কয়টা প্রোডাক্ট, কয়টা অর্ডার)
app.get('/api/seller/dashboard', (req, res) => {
    res.json({
        totalProducts: products.length,
        totalOrders: orders.length,
        allOrders: orders,
        myProducts: products
    });
});

app.get('/api/products', (req, res) => res.json(products));

app.listen(PORT, () => console.log(`Smart Marketplace Live on ${PORT}`));
