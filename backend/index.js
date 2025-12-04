// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Khởi tạo kết nối DB (side-effect, không cần dùng biến)
require('./config/db');

// Gom tất cả routes public
const apiRoutes = require('./routes/indexRoutes');
// Routes admin
const adminRoutes = require('./routes/adminRoutes');

const app = express();

/**
 * CORS:
 * - Hỗ trợ tốt cho local (Vite) và môi trường deploy (Vercel/Render)
 * - Cho phép cấu hình thêm origin qua biến môi trường:
 *   - CLIENT_URL
 *   - ADMIN_URL
 *   - CORS_ORIGINS (danh sách, ngăn cách bởi dấu phẩy)
 */
const defaultOrigins = ['http://localhost:5173']; //nếu lỗi thử thêm phần này 'https://tzfootballfield.vercel.app'

if (process.env.CLIENT_URL) defaultOrigins.push(process.env.CLIENT_URL);
if (process.env.ADMIN_URL) defaultOrigins.push(process.env.ADMIN_URL);

const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

// Public API (client)
app.use('/api', apiRoutes);

// Admin API
app.use('/api/admin', adminRoutes);

// Health check root (tiện dùng trên Render)
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Football Field Management API is running',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
