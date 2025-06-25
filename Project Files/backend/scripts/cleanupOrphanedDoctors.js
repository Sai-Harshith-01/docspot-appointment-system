const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Load env vars from the backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const cleanupOrphanedDoctors = async () => {
  await connectDB();
  let orphanedCount = 0;
  try {
    const doctors = await Doctor.find({});
    console.log(`Found ${doctors.length} total doctor records. Starting check...`);

    for (const doctor of doctors) {
      const user = await User.findById(doctor.user);
      if (!user) {
        orphanedCount++;
        console.warn(`Orphaned Doctor Found: Doctor ID ${doctor._id} references non-existent User ID ${doctor.user}`);
        
        // ** UNCOMMENT THE LINE BELOW TO DELETE THE ORPHANED DOCTOR RECORD **
        // await Doctor.findByIdAndDelete(doctor._id);
        // console.log(`Deleted orphaned doctor record: ${doctor._id}`);
      }
    }

    if (orphanedCount === 0) {
      console.log('Scan complete. No orphaned doctor records found.');
    } else {
      console.log(`Scan complete. Found and logged ${orphanedCount} orphaned doctor(s).`);
    }

  } catch (error) {
    console.error('An error occurred during cleanup:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

cleanupOrphanedDoctors(); 