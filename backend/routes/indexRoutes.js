// backend/routes/indexRoutes.js
// Gom tất cả routes public (client) lại để index.js mount vào `/api`
const express = require('express');
const router = express.Router();

// Import các routes đã có sẵn
const authRoutes = require('./authRoutes');
const bookingRoutes = require('./bookingRoutes');
const fieldRoutes = require('./fieldRoutes');
const matchRoutes = require('./matchRoutes');
const teamJoinRoutes = require('./teamJoinRoutes');
const serviceRoutes = require('./serviceRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const contactRoutes = require('./contactRoutes');
const userRoutes = require('./userRoutes');

// Mount routes: path đầy đủ sẽ là `/api/...`
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/fields', fieldRoutes);
router.use('/matches', matchRoutes);
router.use('/team-joins', teamJoinRoutes);
router.use('/services', serviceRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/contact', contactRoutes);
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Football Field Management API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;