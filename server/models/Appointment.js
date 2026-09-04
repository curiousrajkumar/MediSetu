const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { startTime: String, endTime: String },
  symptoms: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  appointmentType: { type: String, enum: ['OPD', 'IPD', 'Emergency', 'Teleconsult'], default: 'OPD' },
  isFree: { type: Boolean, default: false },
  fee: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'waived', 'refunded'], default: 'pending' },
  prescription: { medicines: [String], notes: String, issuedAt: Date },
  cancelReason: String,
  confirmedAt: Date,
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
