const express = require('express');
const router = express.Router();

// These controller functions will be created in the next step
const { getUnapprovedDoctors, approveDoctor, getAllUsers, getAllDoctors, getAllAppointments, deleteDoctor } = require('../controllers/adminController');

// This middleware will be updated to protect routes based on role
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET api/admin/unapproved-doctors
// @desc    Get all doctors pending approval
// @access  Private/Admin
router.get('/unapproved-doctors', protect, admin, getUnapprovedDoctors);

// @route   PUT api/admin/approve-doctor/:id
// @desc    Approve a doctor's registration
// @access  Private/Admin
router.put('/approve-doctor/:id', protect, admin, approveDoctor);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, getAllUsers);

// @route   GET api/admin/doctors
// @desc    Get all doctors
// @access  Private/Admin
router.get('/doctors', protect, admin, getAllDoctors);

// @route   GET api/admin/appointments
// @desc    Get all appointments
// @access  Private/Admin
router.get('/appointments', protect, admin, getAllAppointments);

// @route   DELETE api/admin/doctor/:id
// @desc    Delete a doctor
// @access  Private/Admin
router.delete('/doctor/:id', protect, admin, deleteDoctor);

module.exports = router; 