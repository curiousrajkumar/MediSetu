const { BloodBank, Medicine, Scheme } = require('../models/Other');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

// BLOOD BANK
exports.getBloodBanks = async (req, res) => {
  try {
    const { bloodGroup, lat, lng, city } = req.query;
    let query = { isActive: true };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (bloodGroup) query['availability.bloodGroup'] = bloodGroup;
    if (lat && lng) {
      query['address.location'] = {
        $near: { $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, $maxDistance: 50000 }
      };
    }
    const bloodBanks = await BloodBank.find(query).populate('hospital', 'name').limit(20);
    res.json({ success: true, count: bloodBanks.length, data: bloodBanks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MEDICINES
exports.getMedicines = async (req, res) => {
  try {
    const { name, category, lat, lng } = req.query;
    let query = {};
    if (name) query.$text = { $search: name };
    if (category) query.category = new RegExp(category, 'i');
    const medicines = await Medicine.find(query).limit(20);
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SCHEMES
exports.getSchemes = async (req, res) => {
  try {
    const { state, launchedBy } = req.query;
    let query = { isActive: true };
    if (state) query.$or = [{ state: new RegExp(state, 'i') }, { launchedBy: 'central' }];
    if (launchedBy) query.launchedBy = launchedBy;
    const schemes = await Scheme.find(query).sort('name');
    res.json({ success: true, count: schemes.length, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DOCTORS
exports.getHospitalDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospital: req.params.hospitalId, isActive: true });
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({ ...req.body, hospital: req.params.hospitalId });
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EMERGENCY
exports.getEmergencyData = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let hospitals = [];
    if (lat && lng) {
      hospitals = await Hospital.find({
        status: 'approved', hasEmergency: true,
        'address.location': {
          $near: { $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, $maxDistance: 20000 }
        }
      }).limit(5).select('name address contact hasAmbulance isOpen24x7');
    }
    const helplines = [
      { name: 'National Ambulance', number: '108', type: 'ambulance', isFree: true },
      { name: 'Maternity Ambulance', number: '102', type: 'ambulance', isFree: true },
      { name: 'Health Helpline', number: '104', type: 'health', isFree: true },
      { name: 'Blood Emergency', number: '1066', type: 'blood', isFree: true },
      { name: 'NDMA Disaster', number: '1078', type: 'disaster', isFree: true },
      { name: 'Police', number: '100', type: 'police', isFree: true },
      { name: 'Fire Brigade', number: '101', type: 'fire', isFree: true },
    ];
    res.json({ success: true, data: { nearbyHospitals: hospitals, helplines } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
