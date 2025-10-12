// ====== backend/routes/adminRoutes.js (Fixed Main File) ======
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { requireAuth, requireSuperAdmin } = require('../middleware/adminAuth');

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

// Mount admin sub-routes với prefix
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
router.get('/users', requireAuth, require('../controllers/customerController').getCustomers);

// Admin management routes (chỉ super admin)
router.get('/admins', requireAuth, requireSuperAdmin, (req, res) => {
  const Admin = require('../models/Admin');
  Admin.findAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi lấy danh sách admin' });
    res.json(results);
  });
});

router.post('/admins', requireAuth, requireSuperAdmin, (req, res) => {
  const Admin = require('../models/Admin');
  Admin.create(req.body, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email đã tồn tại' });
      }
      return res.status(500).json({ error: 'Lỗi tạo admin' });
    }
    res.status(201).json({ message: 'Tạo admin thành công', adminId: result.insertId });
  });
});

module.exports = router;