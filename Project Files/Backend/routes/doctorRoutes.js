const express = require('express');
const router = express.Router();
const { getDoctorProfile, updateDoctorProfile, getAllApprovedDoctors, createDoctorReview, getDoctorById } = require('../controllers/doctorController');
const { protect, doctor } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// @route   GET api/doctors
// @desc    Get all approved doctors' profiles
// @access  Public
router.get('/', getAllApprovedDoctors);

// @route   GET api/doctors/profile
// @desc    Get current doctor's profile
// @access  Private (Doctor only)
router.get('/profile', protect, doctor, getDoctorProfile);

// @route   PUT api/doctors/profile
// @desc    Update doctor profile
// @access  Private (Doctor only)
router.put('/profile', protect, doctor, upload.single('profileImage'), updateDoctorProfile);

// @route   POST api/doctors/:id/reviews
// @desc    Add a review for a doctor
// @access  Private
router.post('/:id/reviews', protect, createDoctorReview);

// @route   GET api/doctors/:id
// @desc    Get a doctor's public profile by ID
// @access  Public
router.get('/:id', getDoctorById);

module.exports = router; 