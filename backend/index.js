// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Gom tất cả routes public
const apiRoutes = require('./routes/indexRoutes');
// Routes admin
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const db = require('./config/db');
const app = express();

// Cấu hình CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://tzfootballfield.vercel.app'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

// Public API (client)
app.use('/api', apiRoutes);
// Admin
app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📊 Admin panel will be available at http://localhost:3000/admin`);
});