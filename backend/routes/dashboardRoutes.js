// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/adminAuth');

// =============== EXISTING DASHBOARD ROUTES ===============
router.get('/', requireAuth, dashboardController.getDashboard);
router.get('/fast', requireAuth, dashboardController.getDashboardFast);
router.get('/recent-bookings', requireAuth, dashboardController.getRecentBookings);
router.get('/stats', requireAuth, dashboardController.getSystemStats);
router.get('/quick-stats', requireAuth, dashboardController.getQuickStats);

// =============== NEW CHART DATA ROUTES ===============
router.get('/charts/revenue', requireAuth, dashboardController.getRevenueChart);
router.get('/charts/popular-fields', requireAuth, dashboardController.getPopularFields);
router.get('/charts/booking-status', requireAuth, dashboardController.getBookingStatusChart);
router.get('/charts/hourly-booking', requireAuth, dashboardController.getHourlyBookingChart);
router.get('/charts/field-type-revenue', requireAuth, dashboardController.getFieldTypeRevenue);
router.get('/charts/customer-growth', requireAuth, dashboardController.getCustomerGrowth);

module.exports = router;