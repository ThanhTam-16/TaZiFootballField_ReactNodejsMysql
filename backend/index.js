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

// Những origin mặc định cho dev + production
const defaultOrigins = [
  'http://localhost:5173', // VITE DEV SERVER
  'https://tzfootballfield.vercel.app', // FRONTEND VERCEL CHÍNH THỨC
];

// Ưu tiên lấy từ biến môi trường nếu có
if (process.env.CLIENT_URL) defaultOrigins.push(process.env.CLIENT_URL);
if (process.env.ADMIN_URL) defaultOrigins.push(process.env.ADMIN_URL);

// Cho phép thêm danh sách origin qua CORS_ORIGINS="https://a.com,https://b.com"
const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Loại trùng
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

// Cấu hình CORS “đẹp” cho production
const corsOptions = {
  origin: (origin, callback) => {
    // Request không có origin (Postman, server-to-server, health check) → cho luôn
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked origin:', origin);
    console.log('✅ Allowed origins:', allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// Bật CORS cho mọi request + preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
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
  console.log('✅ CORS allowed origins:', allowedOrigins);
});

module.exports = app;
