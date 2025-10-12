// backend/routes/inventoryRoutes.js - Inventory Management (Admin only)
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(requireAuth);
router.use(requirePermission('inventory'));

// =============== PRODUCT ROUTES ===============
router.get('/products', inventoryController.getProducts);
router.get('/products/:id', inventoryController.getProduct);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// =============== STATISTICS ===============
router.get('/stats', inventoryController.getStats);

// =============== TRANSACTION ROUTES ===============
router.post('/transactions', inventoryController.createTransaction);
router.get('/transactions', inventoryController.getTransactionHistory);
router.post('/quick-update', inventoryController.quickStockUpdate);

module.exports = router;