// backend/routes/teamJoinRoutes.js - Team Join (Customer & Admin)
const express = require('express');
const router = express.Router();
const teamJoinController = require('../controllers/teamJoinController');
const { requireAuth } = require('../middleware/adminAuth');

// =============== ADMIN ROUTES (PHẢI ĐẶT TRƯỚC) ===============
// Đặt trước để tránh /admin bị bắt bởi '/:id'
router.get('/admin/stats', requireAuth, teamJoinController.getPostStats);
router.get('/admin', requireAuth, teamJoinController.getAllPosts);
router.get('/admin/:id', requireAuth, teamJoinController.getPostById);
router.post('/admin', requireAuth, teamJoinController.createPost);
router.put(
  '/admin/:id',
  requireAuth,
  teamJoinController.updatePostByAdmin
);
router.delete(
  '/admin/:id',
  requireAuth,
  teamJoinController.deletePostByAdmin
);
router.post(
  '/admin/bulk-update',
  requireAuth,
  teamJoinController.bulkUpdatePostStatus
);

// =============== CUSTOMER ROUTES ===============
router.get('/', teamJoinController.listPosts);
router.post('/', teamJoinController.createPost);
router.get('/:id', teamJoinController.getPostById);
router.put('/:id', teamJoinController.updatePost);
router.delete('/:id', teamJoinController.deletePost);
router.put('/:id/status', teamJoinController.updatePostStatus);

module.exports = router;
