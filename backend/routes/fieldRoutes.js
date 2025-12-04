// backend/routes/fieldRoutes.js
const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER FIELD ROUTES ===============
router.get('/', fieldController.getAllFields);
router.get('/available', fieldController.getAvailableFields);

// =============== ADMIN FIELD ROUTES ===============
router.get(
  '/admin',
  requireAuth,
  requirePermission('fields'),
  fieldController.getFieldsForAdmin
);
router.get(
  '/admin/with-bookings',
  requireAuth,
  requirePermission('fields'),
  fieldController.getFieldsWithBookings
);
router.post(
  '/admin',
  requireAuth,
  requirePermission('fields'),
  fieldController.createField
);
router.put(
  '/admin/:fieldId',
  requireAuth,
  requirePermission('fields'),
  fieldController.updateField
);
// Nếu sau này muốn dùng xoá sân:
// router.delete('/admin/:fieldId', requireAuth, requirePermission('fields'), fieldController.deleteField);

module.exports = router;
