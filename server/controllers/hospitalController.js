const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

// @desc Get all approved hospitals with filters
exports.getHospitals = async (req, res) => {
  try {
    const {
      search, city, state, type, specialization,
      isFree, hasEmergency, isOpen24x7, scheme,
      lat, lng, radius = 50,
      sort = '-rating.average', page = 1, limit = 12
    } = req.query;

    let query = { status: 'approved' };

    if (search) query.$text = { $search: search };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (type) query.type = type;
    if (specialization) query.specializations = { $in: [new RegExp(specialization, 'i')] };
    if (isFree === 'true') query.hasFreeOPD = true;
    if (hasEmergency === 'true') query.hasEmergency = true;
    if (isOpen24x7 === 'true') query.isOpen24x7 = true;

    // Geo-based query
    if (lat && lng) {
      query['address.location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const hospitals = await Hospital.find(query)
      .select('-adminNotes')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Hospital.countDocuments(query);

    res.json({
      success: true,
      count: hospitals.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: hospitals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single hospital
exports.getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('governmentSchemes');

    if (!hospital || hospital.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Hospital not found.' });
    }

    await Hospital.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const doctors = await Doctor.find({ hospital: hospital._id, isActive: true });

    res.json({ success: true, data: { ...hospital.toObject(), doctors } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Register new hospital (by hospital admin)
exports.registerHospital = async (req, res) => {
  try {
    const hospitalData = { ...req.body, registeredBy: req.user.id, status: 'approved' };
    const hospital = await Hospital.create(hospitalData);
    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully! It is now live.',
      data: hospital
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update hospital (owner or admin)
exports.updateHospital = async (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.' });

    if (hospital.registeredBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get nearby hospitals
exports.getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng, radius = 10, limit = 10 } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'Latitude and longitude required.' });

    const hospitals = await Hospital.find({
      status: 'approved',
      'address.location': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    }).limit(parseInt(limit));

    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Search hospitals by disease/symptoms
exports.searchByDisease = async (req, res) => {
  try {
    const { disease, lat, lng } = req.query;
    let query = { status: 'approved', $text: { $search: disease } };

    if (lat && lng) {
      query['address.location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 50000
        }
      };
    }

    const hospitals = await Hospital.find(query).limit(20);
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
