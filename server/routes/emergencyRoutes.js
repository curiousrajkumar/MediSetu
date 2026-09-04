const express = require('express');
const router = express.Router();
const { getEmergencyData } = require('../controllers/otherControllers');
router.get('/', getEmergencyData);
module.exports = router;
