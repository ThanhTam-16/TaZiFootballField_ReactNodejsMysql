// backend/routes/serviceRoutes.js - Customer & Admin Service
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER SERVICE ROUTES ===============
router.get('/', serviceController.getAllServices);
router.get('/:category', serviceController.getServicesByCategory);
router.get('/detail/:id', serviceController.getServiceById);

// =============== ADMIN SERVICE ROUTES ===============
router.get('/admin/stats', requireAuth, requirePermission('inventory'), serviceController.getServiceStats);
router.post('/admin', requireAuth, requirePermission('inventory'), serviceController.createService);
router.put('/admin/:id', requireAuth, requirePermission('inventory'), serviceController.updateService);
router.delete('/admin/:id', requireAuth, requirePermission('inventory'), serviceController.deleteService);

module.exports = router;