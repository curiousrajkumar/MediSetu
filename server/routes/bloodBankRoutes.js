// bloodBankRoutes.js
const express = require('express');
const r1 = express.Router();
const { getBloodBanks } = require('../controllers/otherControllers');
r1.get('/', getBloodBanks);
module.exports = r1;
