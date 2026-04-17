import './config/env.js';

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

import authMiddleware from './middleware/auth.js';
import userRouter from './routes/userRoute.js';
import itemrouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderrouter from './routes/orderRoute.js';

const app = express();

// ✅ IMPORTANT: Render PORT fix
const port = process.env.PORT || 4000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Better CORS (SAFE + flexible)
app.use(
  cors({
    origin: [
      "https://bazaar-basket.vercel.app",
      "https://bazaar-basket-admin.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB (with log)
connectDB()
  .then(() => console.log("DB CONNECTED ✅"))
  .catch(err => console.log("DB ERROR ❌", err));

// Routes
app.use("/api/user", userRouter);
app.use('/api/cart', authMiddleware, cartRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/items', itemrouter);
app.use('/api/orders', orderrouter);

// Test route
app.get('/', (req, res) => {
  res.send('API Working');
});

// ✅ IMPORTANT: listen properly
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});