// backend/routes/maintenanceRoutes.js - Customer & Admin Maintenance
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER MAINTENANCE ROUTES ===============
router.get('/schedule', maintenanceController.getMaintenanceSchedule);
router.get('/active', maintenanceController.getActiveMaintenances);

// =============== ADMIN MAINTENANCE ROUTES ===============
router.get('/admin', requireAuth, requirePermission('fields'), maintenanceController.getAllMaintenances);
router.get('/admin/stats', requireAuth, requirePermission('fields'), maintenanceController.getMaintenanceStats);
router.get('/admin/:id', requireAuth, requirePermission('fields'), maintenanceController.getMaintenanceById);
router.post('/admin', requireAuth, requirePermission('fields'), maintenanceController.createMaintenance);
router.put('/admin/:id', requireAuth, requirePermission('fields'), maintenanceController.updateMaintenance);
router.delete('/admin/:id', requireAuth, requirePermission('fields'), maintenanceController.deleteMaintenance);

module.exports = router;