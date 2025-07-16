const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiter to prevent brute-force attacks on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

// Register route with validation
router.post('/register', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], registerUser);

// Login route with validation and rate limiting
router.post('/login', [
  loginLimiter,
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], loginUser);

module.exports = router; 