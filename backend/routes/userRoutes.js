// backend/routes/userRoutes.js - User Profile
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// =============== USER PROFILE ROUTES ===============
// Nếu sau này muốn chỉ admin mới được xem/sửa, có thể thêm requireAuth ở đây
router.get('/:id', userController.getUserProfile);
router.put('/:id', userController.updateUserProfile);

module.exports = router;
