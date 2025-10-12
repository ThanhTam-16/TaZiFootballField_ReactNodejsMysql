// backend/routes/contactRoutes.js - Contact Form
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.sendContact);

module.exports = router;