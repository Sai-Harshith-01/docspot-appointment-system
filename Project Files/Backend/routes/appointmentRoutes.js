const express = require('express');
const router = express.Router();
const { 
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment
} = require('../controllers/appointmentController');
const { protect, doctor, optionalProtect } = require('../middleware/authMiddleware');
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

// @route   POST api/appointments/book
// @desc    Book an appointment (guest or logged-in)
// @access  Public/Private
router.post('/book', optionalProtect, upload.array('documents'), createAppointment);

// @route   GET api/appointments/my-appointments
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get('/my-appointments', protect, getUserAppointments);

// @route   GET api/appointments/doctor-appointments
// @desc    Get all appointments for the logged-in doctor
// @access  Private (Doctor)
router.get('/doctor-appointments', protect, doctor, getDoctorAppointments);

// @route   PUT api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Doctor)
router.put('/:id/status', protect, doctor, updateAppointmentStatus);

// @route   DELETE api/appointments/:id
// @desc    Cancel an appointment
// @access  Private
router.delete('/:id', protect, cancelAppointment);

// @route   PUT api/appointments/:id/reschedule
// @desc    Reschedule an appointment
// @access  Private
router.put('/:id/reschedule', protect, rescheduleAppointment);

module.exports = router; 