const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { Review } = require('../models/Other');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalHospitals, pendingHospitals, totalUsers, totalAppointments, todayAppointments] = await Promise.all([
      Hospital.countDocuments({ status: 'approved' }),
      Hospital.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'user' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      })
    ]);

    res.json({
      success: true,
      data: { totalHospitals, pendingHospitals, totalUsers, totalAppointments, todayAppointments }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: 'pending' })
      .populate('registeredBy', 'name email phone')
      .sort('-createdAt');
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveHospital = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected.' });
    }
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id, { status, adminNotes }, { new: true }
    );
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.' });
    res.json({ success: true, message: `Hospital ${status}.`, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
    const users = await User.find(query)
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, count: users.length, total, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};
    if (status) query.status = status;
    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone')
      .populate('hospital', 'name')
      .populate('doctor', 'name specialization')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    const total = await Appointment.countDocuments(query);
    res.json({ success: true, count: appointments.length, total, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
