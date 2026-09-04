const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getPendingHospitals, approveHospital,
  getAllUsers, toggleUserStatus, getAllAppointments
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/hospitals/pending', getPendingHospitals);
router.put('/hospitals/:id/status', approveHospital);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/appointments', getAllAppointments);

module.exports = router;
