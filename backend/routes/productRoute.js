// backend/routes/productRoute.js

import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import pkg from 'multer-storage-cloudinary';
const CloudinaryStorage = pkg.default || pkg;
import {
    getProducts,
    createProduct,
    deleteProduct,
} from '../controllers/productController.js';

const itemrouter = express.Router();


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage });

// GET all products
itemrouter.get('/', getProducts);

// POST create a new product (with optional image upload)
itemrouter.post('/', upload.single('image'), createProduct);

// DELETE a product by ID
itemrouter.delete('/:id', deleteProduct);

export default itemrouter;
