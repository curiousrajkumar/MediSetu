const express = require('express');
const router = express.Router();
const { addReview, getHospitalReviews, deleteReview } = require('../controllers/reviewController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/hospital/:hospitalId', protect, addReview);
router.get('/hospital/:hospitalId', optionalAuth, getHospitalReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
