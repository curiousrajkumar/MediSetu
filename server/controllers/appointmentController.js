const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

// @desc Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { hospitalId, doctorId, appointmentDate, timeSlot, symptoms, appointmentType } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || hospital.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });

    // Check for slot conflicts
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This slot is already booked.' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      hospital: hospitalId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      symptoms,
      appointmentType: appointmentType || 'OPD',
      isFree: doctor.isFreeConsultation,
      fee: doctor.isFreeConsultation ? 0 : doctor.consultationFee,
    });

    await appointment.populate([
      { path: 'hospital', select: 'name address contact' },
      { path: 'doctor', select: 'name specialization photo' },
      { path: 'patient', select: 'name phone email' }
    ]);

    res.status(201).json({ success: true, message: 'Appointment booked successfully!', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { patient: req.user.id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('hospital', 'name address.city coverImage')
      .populate('doctor', 'name specialization photo')
      .sort('-appointmentDate')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);
    res.json({ success: true, count: appointments.length, total, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });

    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${appointment.status} appointment.` });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = req.body.reason || 'Cancelled by patient';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled.', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get hospital appointments (for hospital admin)
exports.getHospitalAppointments = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { date, status, page = 1, limit = 20 } = req.query;

    let query = { hospital: hospitalId };
    if (status) query.status = status;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialization')
      .sort('appointmentDate')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
