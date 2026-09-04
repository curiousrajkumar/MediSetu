const express = require('express');
const router = express.Router();
const { getHospitalDoctors, addDoctor } = require('../controllers/otherControllers');
const { protect, authorize } = require('../middleware/auth');

router.get('/hospital/:hospitalId', getHospitalDoctors);
router.post('/hospital/:hospitalId', protect, authorize('hospital_admin', 'admin'), addDoctor);

module.exports = router;
