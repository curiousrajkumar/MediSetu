const express = require('express');
const router = express.Router();
const { analyzeSymptoms, chatbot } = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

router.post('/analyze', optionalAuth, analyzeSymptoms);
router.post('/chat', optionalAuth, chatbot);

module.exports = router;
