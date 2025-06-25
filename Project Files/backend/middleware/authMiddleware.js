const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select('-password');
    } catch (error) {
      // Invalid token, but we don't throw an error, just proceed without user
      req.user = null;
    }
  }
  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const doctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor' && req.user.isApproved) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an approved doctor' });
  }
};

const user = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a user' });
  }
};

module.exports = { protect, admin, doctor, user, optionalProtect }; 