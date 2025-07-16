const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const path = require('path');
const morgan = require('morgan');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// JWT Secret Check Middleware
app.use((req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server Error: JWT_SECRET not configured.' });
  }
  next();
});

// import routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple ping route for status check
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;



