const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const doctors = require('./data/doctors');
const connectDB = require('./config/config');

dotenv.config();

const importData = async () => {
  await connectDB();
  try {
    // First, get all user IDs for existing doctors
    const doctorUsers = await User.find({ role: 'doctor' });
    const doctorUserIds = doctorUsers.map(u => u._id);

    // Delete all associated data
    await Appointment.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({ role: { $in: ['doctor', 'admin'] } });

    // Create a new admin user
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('adminpassword', adminSalt);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminHashedPassword,
      role: 'admin',
      isApproved: true,
    });
    await adminUser.save();
    console.log(`Admin user created: ${adminUser.email}`);

    // Create new doctor users and profiles
    for (const doctorData of doctors) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(doctorData.password, salt);

      const user = new User({
        name: doctorData.name,
        email: doctorData.email,
        password: hashedPassword,
        role: 'doctor',
        isApproved: true,
      });

      const createdUser = await user.save();
      console.log(`Doctor user created: ${createdUser.email} - Hashed Password: ${hashedPassword}`);

      const doctor = new Doctor({
        user: createdUser._id,
        specialty: doctorData.specialty,
        qualifications: doctorData.qualifications,
        experience: doctorData.experience,
        consultationHours: doctorData.consultationHours,
        profileImageUrl: doctorData.profileImageUrl,
        contactPhone: doctorData.contactPhone,
        location: doctorData.location,
        rating: doctorData.rating,
        numReviews: doctorData.numReviews,
        reviews: doctorData.reviews,
      });

      await doctor.save();
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Appointment.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({});
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 