// backend/routes/fieldRoutes.js - Sửa lỗi
const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER FIELD ROUTES ===============
router.get('/', fieldController.getAllFields);
router.get('/available', fieldController.getAvailableFields);

// =============== ADMIN FIELD ROUTES ===============
// Chỉ sử dụng các method thực sự tồn tại trong controller
router.get('/admin', requireAuth, requirePermission('fields'), fieldController.getFieldsForAdmin);
router.get('/admin/with-bookings', requireAuth, requirePermission('fields'), fieldController.getFieldsWithBookings);

// Các routes này chỉ thêm nếu method tồn tại trong controller
// router.get('/admin/stats', requireAuth, requirePermission('fields'), fieldController.getFieldStats);
router.post('/admin', requireAuth, requirePermission('fields'), fieldController.createField);
router.put('/admin/:fieldId', requireAuth, requirePermission('fields'), fieldController.updateField);
// router.delete('/admin/:fieldId', requireAuth, requirePermission('fields'), fieldController.deleteField);

module.exports = router;