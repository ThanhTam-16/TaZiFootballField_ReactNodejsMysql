// backend/routes/customerRoutes.js - Customer Management (Admin only)
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== ADMIN CUSTOMER MANAGEMENT ROUTES ===============
router.get('/', requireAuth, requirePermission('users'), customerController.getCustomers);
router.get('/stats', requireAuth, requirePermission('users'), customerController.getCustomerStats);
router.get('/:customerId', requireAuth, requirePermission('users'), customerController.getCustomerById);
router.post('/', requireAuth, requirePermission('users'), customerController.createCustomer);
router.put('/:customerId', requireAuth, requirePermission('users'), customerController.updateCustomer);
router.delete('/:customerId', requireAuth, requirePermission('users'), customerController.deleteCustomer);
router.patch('/bulk', requireAuth, requirePermission('users'), customerController.bulkUpdateCustomers);

module.exports = router;