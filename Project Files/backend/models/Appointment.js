const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  guestEmail: {
    type: String,
    required: false,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending',
  },
  documents: [String],
  notes: {
    type: String,
    default: '',
  },
  symptoms: {
    type: String,
    default: '',
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Generate booking ID before saving
appointmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.bookingId = `APT${year}${month}${day}${random}`;
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema); 