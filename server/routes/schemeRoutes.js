const express = require('express');
const router = express.Router();
const { getSchemes } = require('../controllers/otherControllers');
router.get('/', getSchemes);
module.exports = router;
