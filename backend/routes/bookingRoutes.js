// backend/routes/bookingRoutes.js - UPDATED with cancel booking route
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER BOOKING ROUTES ===============
router.post('/', bookingController.createBooking);
router.get('/date', bookingController.getBookingsByDate);
router.get('/user/:userId', bookingController.getUserBookings);

// Cancel booking by user
router.put('/user/:bookingId/cancel', bookingController.cancelUserBooking);

// Price calculation endpoint
router.get('/calculate-price', bookingController.calculatePrice);

// =============== ADMIN BOOKING ROUTES ===============
router.get('/admin', requireAuth, requirePermission('bookings'), bookingController.getAllBookings);
router.get('/admin/recent', requireAuth, bookingController.getRecentBookings);
router.post('/admin/manual', requireAuth, requirePermission('bookings'), bookingController.createManualBooking);
router.put('/admin/:bookingId/status', requireAuth, requirePermission('bookings'), bookingController.updateBookingStatus);
router.put('/admin/:bookingId', requireAuth, requirePermission('bookings'), bookingController.updateBooking);
router.delete('/admin/:bookingId', requireAuth, requirePermission('bookings'), bookingController.deleteBooking);

module.exports = router;