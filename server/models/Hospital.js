const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  type: { type: String, enum: ['government', 'private', 'trust', 'clinic', 'ayurvedic'], required: true },
  description: { type: String, default: '' },
  images: [String],
  coverImage: { type: String, default: '' },
  address: {
    street: String, city: { type: String, required: true },
    state: { type: String, required: true }, pincode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  contact: {
    phone: [String], email: String,
    website: String, whatsapp: String
  },
  hours: {
    monday: { open: String, close: String, is24h: Boolean },
    tuesday: { open: String, close: String, is24h: Boolean },
    wednesday: { open: String, close: String, is24h: Boolean },
    thursday: { open: String, close: String, is24h: Boolean },
    friday: { open: String, close: String, is24h: Boolean },
    saturday: { open: String, close: String, is24h: Boolean },
    sunday: { open: String, close: String, is24h: Boolean },
  },
  isOpen24x7: { type: Boolean, default: false },
  hasEmergency: { type: Boolean, default: false },
  hasAmbulance: { type: Boolean, default: false },
  specializations: [String],
  treatmentTypes: [String],
  facilities: [String],
  treatments: [{
    name: String, description: String,
    isFree: { type: Boolean, default: false },
    cost: { min: Number, max: Number }, duration: String
  }],
  governmentSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
  hasFreeOPD: { type: Boolean, default: false },
  hasFreeMedicine: { type: Boolean, default: false },
  hasFreeEmergency: { type: Boolean, default: false },
  totalBeds: { type: Number, default: 0 },
  icuBeds: { type: Number, default: 0 },
  rating: { average: { type: Number, default: 0, min: 0, max: 5 }, count: { type: Number, default: 0 } },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'approved' },
  adminNotes: String,
  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

hospitalSchema.index({ 'address.location': '2dsphere' });
hospitalSchema.index({ name: 'text', description: 'text', specializations: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);
