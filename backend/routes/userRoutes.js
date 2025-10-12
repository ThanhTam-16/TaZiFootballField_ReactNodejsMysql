// backend/routes/userRoutes.js - User Management (Legacy - có thể deprecated)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== USER PROFILE ROUTES ===============
router.get('/:id', userController.getUserProfile);
router.put('/:id', userController.updateUserProfile);


module.exports = router;