const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5456;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// API Endpoints

// Image Upload Endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ fileName: req.file.filename });
});

// Add Product Endpoint
app.post('/farmers/product', (req, res) => {
    const product = req.body;

    if (!product.prod_Img) {
        return res.status(400).json({ message: 'Image name is required' });
    }

    // Simulate saving to a database (replace with actual DB logic)
    console.log('Product saved:', product);

    res.status(200).json({ message: 'Product added successfully', product });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
