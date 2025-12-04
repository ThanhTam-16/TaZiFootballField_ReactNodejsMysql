// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireSuperAdmin } = require('../middleware/adminAuth');
const Admin = require('../models/Admin');

// Import các routes admin cần thiết
const dashboardRoutes = require('./dashboardRoutes');
const bookingRoutes = require('./bookingRoutes');
const fieldRoutes = require('./fieldRoutes');
const customerRoutes = require('./customerRoutes');
const matchRoutes = require('./matchRoutes');
const teamJoinRoutes = require('./teamJoinRoutes');
const serviceRoutes = require('./serviceRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const revenueRoutes = require('./revenueRoutes');

// Mount admin sub-routes với prefix (/api/admin/...)
router.use('/dashboard', dashboardRoutes);
router.use('/bookings', bookingRoutes);
router.use('/fields', fieldRoutes);
router.use('/customers', customerRoutes);
router.use('/matches', matchRoutes);
router.use('/team-joins', teamJoinRoutes);
router.use('/services', serviceRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/revenue', revenueRoutes);

// Legacy user management routes (keep for backward compatibility)
router.get(
  '/users',
  requireAuth,
  require('../controllers/customerController').getCustomers
);

// ========== ADMIN MANAGEMENT (chỉ super admin) ==========

// Danh sách admin
router.get('/admins', requireAuth, requireSuperAdmin, (req, res) => {
  Admin.findAll((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Lỗi lấy danh sách admin' });
    }
    res.json(results);
  });
});

// Tạo admin mới
router.post('/admins', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const adminId = await Admin.create(req.body);
    res
      .status(201)
      .json({ message: 'Tạo admin thành công', adminId });
  } catch (err) {
    console.error('Create admin error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    res.status(500).json({ error: 'Lỗi tạo admin' });
  }
});

module.exports = router;
