const express = require('express');
const router = express.Router();
const { submitContact } = require('../src/controllers/contactController');
const { authenticateToken } = require('../src/middleware/auth');

// Apply authentication middleware to all contact routes
router.use(authenticateToken);

// Submit contact message
router.post('/', submitContact);

module.exports = router;
