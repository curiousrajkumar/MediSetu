const express = require('express');
const router = express.Router();
const {
  getHospitals, getHospital, registerHospital,
  updateHospital, getNearbyHospitals, searchByDisease
} = require('../controllers/hospitalController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getHospitals);
router.get('/nearby', getNearbyHospitals);
router.get('/search-by-disease', searchByDisease);
router.get('/:id', optionalAuth, getHospital);
router.post('/register', protect, authorize('user', 'hospital_admin', 'admin'), registerHospital);
router.put('/:id', protect, authorize('hospital_admin', 'admin'), updateHospital);

module.exports = router;
