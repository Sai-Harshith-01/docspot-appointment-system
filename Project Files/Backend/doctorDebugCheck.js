// doctorDebugCheck.js
// Usage: node doctorDebugCheck.js

const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor'; // Adjust if needed
const API_URL = 'http://localhost:5000/api/doctors';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // 1. Find the 5 most recent doctors
  const recentDoctors = await User.find({ role: 'doctor' }).sort({ _id: -1 }).limit(5);
  console.log('\nRecent doctor users:');
  for (const user of recentDoctors) {
    console.log(`- Name: ${user.name}, Email: ${user.email}, isApproved: ${user.isApproved}, _id: ${user._id}`);
    // 2. Check for Doctor profile
    const profile = await Doctor.findOne({ user: user._id });
    if (profile) {
      console.log(`  Doctor profile found. Specialty: ${profile.specialty}, Experience: ${profile.experience}`);
    } else {
      console.log('  No Doctor profile found.');
    }
  }

  // 3. Check API response
  try {
    const res = await axios.get(API_URL);
    const apiDoctors = res.data;
    console.log(`\nDoctors returned by /api/doctors (${apiDoctors.length}):`);
    for (const user of recentDoctors) {
      const found = apiDoctors.find(doc => doc.user && (doc.user._id === String(user._id)));
      if (found) {
        console.log(`- ${user.name} (${user.email}) is VISIBLE in API.`);
      } else {
        console.log(`- ${user.name} (${user.email}) is NOT visible in API.`);
      }
    }
  } catch (err) {
    console.error('Error fetching from API:', err.message);
  }
}

async function checkHarika() {
  const user = await User.findOne({ name: /harika/i });
  if (!user) {
    console.log("No user named 'harika' found.");
    await mongoose.disconnect();
    return;
  }
  // Auto-approve if not approved
  if (!user.isApproved) {
    user.isApproved = true;
    await user.save();
    console.log("'harika' user is now approved.");
  } else {
    console.log("'harika' user is already approved.");
  }

  let profile = await Doctor.findOne({ user: user._id });
  if (!profile) {
    // Create a new profile if missing
    profile = new Doctor({
      user: user._id,
      specialty: 'Cardiologist',
      qualifications: ['MBBS', 'MD'],
      experience: 5,
      consultationHours: { start: '09:00', end: '17:00' }
    });
    await profile.save();
    console.log('Doctor profile created for harika.');
  } else {
    // Update profile if incomplete
    let updated = false;
    if (profile.specialty === 'Not set') { profile.specialty = 'Cardiologist'; updated = true; }
    if (JSON.stringify(profile.qualifications) === JSON.stringify(['Not set'])) { profile.qualifications = ['MBBS', 'MD']; updated = true; }
    if (!profile.experience || profile.experience <= 0) { profile.experience = 5; updated = true; }
    if (updated) {
      await profile.save();
      console.log('Doctor profile for harika updated to be complete.');
    } else {
      console.log('Doctor profile for harika is already complete.');
    }
  }

  // Check completeness
  const isComplete = profile.specialty !== 'Not set' &&
    JSON.stringify(profile.qualifications) !== JSON.stringify(['Not set']) &&
    profile.experience > 0;
  console.log(`Profile complete: ${isComplete}`);

  // Check API
  try {
    const res = await axios.get(API_URL);
    const apiDoctors = res.data;
    const found = apiDoctors.find(doc => doc.user && (doc.user._id === String(user._id)));
    if (found) {
      console.log("'harika' is VISIBLE in /api/doctors API response.");
    } else {
      console.log("'harika' is NOT visible in /api/doctors API response.");
    }
  } catch (err) {
    console.error('Error fetching from API:', err.message);
  }
  await mongoose.disconnect();
}

async function printAllDoctors() {
  const allDoctors = await User.find({ role: 'doctor' });
  if (!allDoctors.length) {
    console.log('No users with role doctor found in the database.');
  } else {
    console.log('\nAll users with role doctor:');
    allDoctors.forEach(u => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, isApproved: ${u.isApproved}, _id: ${u._id}`);
    });
  }
}

main().then(printAllDoctors).then(checkHarika).catch(err => {
  console.error('Script error:', err);
  mongoose.disconnect();
  process.exit(1);
}); 