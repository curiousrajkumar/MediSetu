const mongoose = require('mongoose');

// Review Model
const reviewSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  comment: { type: String, required: true, trim: true },
  isVerifiedPatient: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
  reply: { text: String, repliedAt: Date },
}, { timestamps: true });

reviewSchema.index({ hospital: 1, user: 1 }, { unique: true });

// Blood Bank Model
const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  address: {
    city: String, state: String, pincode: String,
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] }
  },
  contact: { phone: [String], email: String },
  availability: [{
    bloodGroup: { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
    units: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  isOpen24x7: { type: Boolean, default: false },
  hours: String,
  isFree: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

bloodBankSchema.index({ 'address.location': '2dsphere' });

// Medicine Model
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  manufacturer: String,
  category: String,
  description: String,
  mrp: Number,
  prescriptionRequired: { type: Boolean, default: false },
  availability: [{
    pharmacy: { name: String, address: String, phone: String,
      location: { type: { type: String, default: 'Point' }, coordinates: [Number] }
    },
    price: Number, stock: Number, lastUpdated: Date
  }],
  isGenericAvailable: { type: Boolean, default: false },
  genericPrice: Number,
}, { timestamps: true });

// Scheme Model
const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortName: String,
  launchedBy: { type: String, enum: ['central', 'state', 'ngo'], default: 'central' },
  state: String,
  description: String,
  benefits: [String],
  eligibility: [String],
  requiredDocuments: [String],
  coverageAmount: Number,
  website: String,
  helplineNumber: String,
  icon: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  BloodBank: mongoose.model('BloodBank', bloodBankSchema),
  Medicine: mongoose.model('Medicine', medicineSchema),
  Scheme: mongoose.model('Scheme', schemeSchema),
};
