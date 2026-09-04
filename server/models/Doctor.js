const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  specialization: { type: String, required: true },
  qualifications: [String],
  experience: { type: Number, default: 0 },
  registrationNumber: String,
  languages: [String],
  consultationFee: { type: Number, default: 0 },
  isFreeConsultation: { type: Boolean, default: false },
  availability: [{
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
    slots: [{ startTime: String, endTime: String, maxPatients: { type: Number, default: 10 } }]
  }],
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
