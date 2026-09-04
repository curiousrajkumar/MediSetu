const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, cancelAppointment, getHospitalAppointments } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.get('/hospital/:hospitalId', protect, authorize('hospital_admin', 'admin'), getHospitalAppointments);

module.exports = router;
