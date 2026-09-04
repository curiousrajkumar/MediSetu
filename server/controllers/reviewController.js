const { Review } = require('../models/Other');
const Hospital = require('../models/Hospital');

exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.' });

    const existing = await Review.findOne({ hospital: hospitalId, user: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this hospital.' });

    const review = await Review.create({
      hospital: hospitalId, user: req.user.id, rating, title, comment
    });

    // Update hospital average rating
    const reviews = await Review.find({ hospital: hospitalId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Hospital.findByIdAndUpdate(hospitalId, {
      'rating.average': Math.round(avgRating * 10) / 10,
      'rating.count': reviews.length
    });

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHospitalReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const reviews = await Review.find({ hospital: req.params.hospitalId, isApproved: true })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ hospital: req.params.hospitalId, isApproved: true });
    res.json({ success: true, count: reviews.length, total, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
