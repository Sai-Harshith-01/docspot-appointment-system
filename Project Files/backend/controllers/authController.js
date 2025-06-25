const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    // Automatically approve users, but not doctors
    const isApproved = role === 'user';
    const user = new User({ name, email, password: hashedPassword, role, isApproved });
    await user.save();
    // Automatically create a Doctor profile if the user is a doctor
    if (role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doctorProfile = new Doctor({
        user: user._id,
        specialty: 'Not set',
        qualifications: ['Not set'],
        experience: 0,
        consultationHours: { start: '09:00', end: '17:00' }
      });
      await doctorProfile.save();
    }
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error); // For debugging

    // Check for duplicate email error (MongoDB code 11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ message: 'An account with this email address already exists. Please use a different email.' });
    }
    
    // Generic server error
    res.status(500).json({ message: 'An internal server error occurred during registration. Please try again later.' });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isApproved) {
    return res.status(403).json({ message: 'Your registration is pending approval from the admin.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ _id: user._id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET);
  res.json({ token, role: user.role, isApproved: user.isApproved });
}; 