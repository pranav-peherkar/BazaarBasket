import express from 'express';
import multer from 'multer';

import {
    getProducts,
    createProduct,
    deleteProduct,
} from '../controllers/productController.js';

const itemrouter = express.Router();

// ✅ Use memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
itemrouter.get('/', getProducts);
itemrouter.post('/', upload.single('image'), createProduct);
itemrouter.delete('/:id', deleteProduct);

export default itemrouter;