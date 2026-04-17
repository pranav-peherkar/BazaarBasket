import { Product } from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';

// ==========================
// GET all products
// ==========================
export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// ==========================
// POST create product
// ==========================
export const createProduct = async (req, res, next) => {
    try {
        let imageUrl = null;

        // ✅ Upload image to Cloudinary (if exists)
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "products",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                stream.end(req.file.buffer);
            });

            // ✅ ALWAYS use secure_url (important)
            imageUrl = result.secure_url;
        }

        const { name, description, category, oldPrice, price } = req.body;

        // ✅ Validate required fields
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Name and price are required",
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            oldPrice: Number(oldPrice) || 0,
            price: Number(price),
            imageUrl, // Cloudinary URL
        });

        res.status(201).json({
            success: true,
            product,
        });

    } catch (err) {
        console.error("Create Product Error:", err);
        next(err);
    }
};

// ==========================
// DELETE product
// ==========================
export const deleteProduct = async (req, res, next) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            message: 'Product removed',
        });

    } catch (err) {
        next(err);
    }
};