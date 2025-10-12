// backend/routes/revenueRoutes.js - Revenue Reports
const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== ADMIN REVENUE ROUTES ===============
router.get('/', requireAuth, requirePermission('reports'), revenueController.getRevenue);
router.get('/by-field', requireAuth, requirePermission('reports'), revenueController.getRevenueByField);
router.get('/by-month', requireAuth, requirePermission('reports'), revenueController.getRevenueByMonth);

module.exports = router;