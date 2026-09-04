const express = require('express');
const router = express.Router();
const { getMedicines } = require('../controllers/otherControllers');
router.get('/', getMedicines);
module.exports = router;
