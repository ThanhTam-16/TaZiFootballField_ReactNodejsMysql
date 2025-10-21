// backend/routes/matchRoutes.js - Customer & Admin Match
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { requireAuth, requirePermission } = require('../middleware/adminAuth');

// =============== CUSTOMER MATCH ROUTES ===============
router.post('/', matchController.createMatch);
router.get('/', matchController.listMatches);
router.post('/join', matchController.joinMatch);
router.delete('/:matchId/leave/:userId', matchController.leaveMatch);
router.get('/:matchId/participants', matchController.listParticipants);

router.put('/:id', matchController.updateMatchByCustomer);
router.put('/:id/status', matchController.updateMatchStatus);
router.delete('/:id', matchController.deleteMatchByCustomer);

// =============== ADMIN MATCH ROUTES ===============
router.get('/admin', requireAuth, matchController.getAllMatches);
router.get('/admin/stats', requireAuth, matchController.getMatchStats);
router.get('/admin/:id', requireAuth, matchController.getMatchById);
router.post('/admin', requireAuth, matchController.createMatchByAdmin);
router.put('/admin/:id', requireAuth, matchController.updateMatch);
router.delete('/admin/:id', requireAuth, matchController.deleteMatch);
router.post('/admin/bulk-update', requireAuth, matchController.bulkUpdateMatchStatus);

module.exports = router;