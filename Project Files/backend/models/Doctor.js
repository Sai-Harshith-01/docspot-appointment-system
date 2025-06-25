const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  qualifications: {
    type: [String], // Array of strings for multiple qualifications
    required: true,
  },
  experience: {
    type: Number, // Experience in years
    required: true,
  },
  consultationHours: {
    // Example: { start: '09:00', end: '17:00' }
    start: String,
    end: String,
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
  contactPhone: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  // You can add more profile fields here later, like clinicAddress, etc.
});

module.exports = mongoose.model('Doctor', doctorSchema); 