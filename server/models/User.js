const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: { type: String, required: [true, 'Phone is required'], match: [/^[6-9]\d{9}$/, 'Enter valid Indian mobile number'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['user', 'hospital_admin', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  address: {
    city: String, state: String, pincode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  medicalHistory: [{ condition: String, since: Date, notes: String }],
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  language: { type: String, enum: ['en', 'hi', 'gu', 'ur'], default: 'en' },
  fcmToken: String,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
