// backend/routes/dashboardRoutes.js - ADD FAST ENDPOINT
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/adminAuth');

// =============== ADMIN DASHBOARD ROUTES ===============
router.get('/', requireAuth, dashboardController.getDashboard);
router.get('/fast', requireAuth, dashboardController.getDashboardFast); // ADD FAST VERSION
router.get('/recent-bookings', requireAuth, dashboardController.getRecentBookings);
router.get('/stats', requireAuth, dashboardController.getSystemStats);
router.get('/quick-stats', requireAuth, dashboardController.getQuickStats);

module.exports = router;