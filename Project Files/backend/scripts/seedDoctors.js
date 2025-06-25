const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const connectDB = require('../config/config');

dotenv.config();

const doctors = [
  {
    name: 'Dr. Arjun Mehta',
    gender: 'Male',
    specialty: 'Cardiologist',
    email: 'arjun.mehta@clinic.com',
    phone: '9876543210',
    availableDays: 'Mon, Wed, Fri',
  },
  {
    name: 'Dr. Priya Sharma',
    gender: 'Female',
    specialty: 'Pediatrician',
    email: 'priya.sharma@clinic.com',
    phone: '9876501234',
    availableDays: 'Tue, Thu, Sat',
  },
  {
    name: 'Dr. Rohan Kulkarni',
    gender: 'Male',
    specialty: 'Dermatologist',
    email: 'rohan.k@clinic.com',
    phone: '9988776655',
    availableDays: 'Mon to Fri',
  },
  {
    name: 'Dr. Ananya Rao',
    gender: 'Female',
    specialty: 'Gynecologist',
    email: 'ananya.rao@clinic.com',
    phone: '8765432109',
    availableDays: 'Tue, Thu, Sat',
  },
  {
    name: 'Dr. Kiran Iyer',
    gender: 'Male',
    specialty: 'General Physician',
    email: 'kiran.iyer@clinic.com',
    phone: '9123456789',
    availableDays: 'All Days (except Sun)',
  },
  {
    name: 'Dr. Meera Desai',
    gender: 'Female',
    specialty: 'Psychiatrist',
    email: 'meera.desai@clinic.com',
    phone: '9012345678',
    availableDays: 'Mon, Wed, Fri',
  },
  {
    name: 'Dr. Aditya Reddy',
    gender: 'Male',
    specialty: 'Orthopedic Surgeon',
    email: 'aditya.reddy@clinic.com',
    phone: '9001122334',
    availableDays: 'Mon to Thu',
  },
  {
    name: 'Dr. Sneha Nair',
    gender: 'Female',
    specialty: 'ENT Specialist',
    email: 'sneha.nair@clinic.com',
    phone: '9234567890',
    availableDays: 'Mon, Wed, Fri',
  },
];

const seedDoctors = async () => {
  try {
    await connectDB();
    for (const doc of doctors) {
      // Check if user already exists
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = new User({
          name: doc.name,
          email: doc.email,
          password: hashedPassword,
          role: 'doctor',
          isApproved: true,
        });
        await user.save();
      }
      // Check if doctor profile already exists
      let doctorProfile = await Doctor.findOne({ user: user._id });
      if (!doctorProfile) {
        doctorProfile = new Doctor({
          user: user._id,
          specialty: doc.specialty,
          qualifications: ['MBBS'],
          experience: 5,
          consultationHours: { start: '09:00', end: '17:00' },
          contactPhone: doc.phone,
          gender: doc.gender,
          availableDays: doc.availableDays,
        });
        await doctorProfile.save();
      }
    }
    console.log('Doctors seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding doctors:', err);
    process.exit(1);
  }
};

seedDoctors(); 