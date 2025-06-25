const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors
exports.getAllApprovedDoctors = async (req, res) => {
  try {
    // Find all users who are approved doctors
    const approvedDoctorUsers = await User.find({ role: 'doctor', isApproved: true });

    // Get the user IDs of these approved doctors
    const approvedDoctorUserIds = approvedDoctorUsers.map(user => user._id);

    // Find the profiles for these users, only if profile is complete
    const profiles = await Doctor.find({
      user: { $in: approvedDoctorUserIds },
      specialty: { $ne: 'Not set' },
      qualifications: { $ne: ['Not set'] },
      experience: { $gt: 0 }
    }).populate('user', ['name', 'email']);
    
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get the profile for the logged-in doctor
exports.getDoctorProfile = async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware
    const profile = await Doctor.findOne({ user: req.user._id }).populate('user', ['name', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'No profile for this doctor. Please create one.' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a doctor's profile
exports.updateDoctorProfile = async (req, res) => {
  const { specialty, qualifications, experience, consultationHours } = req.body;

  // Parse qualifications if it's a string (from form-data)
  let qualificationsArray = qualifications;
  if (typeof qualifications === 'string') {
    qualificationsArray = qualifications.split(',').map(q => q.trim());
  }

  // Parse consultationHours if it's a string (from form-data)
  let consultationHoursObj = consultationHours;
  if (typeof consultationHours === 'string') {
    try {
      consultationHoursObj = JSON.parse(consultationHours);
    } catch (e) {
      consultationHoursObj = undefined;
    }
  }

  // Build profile object
  const profileFields = {
    user: req.user._id,
    specialty,
    qualifications: qualificationsArray,
    experience,
    consultationHours: consultationHoursObj,
  };

  // Handle profile image upload
  if (req.file) {
    profileFields.profileImageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    let profile = await Doctor.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    } else {
      // Create new profile if it doesn't exist
      profile = new Doctor(profileFields);
      await profile.save();
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new review
exports.createDoctorReview = async (req, res) => {
  const { rating, comment } = req.body;

  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    const alreadyReviewed = doctor.reviews.find(r => r.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Doctor already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    doctor.reviews.push(review);

    doctor.numReviews = doctor.reviews.length;

    doctor.rating = doctor.reviews.reduce((acc, item) => item.rating + acc, 0) / doctor.reviews.length;

    await doctor.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
};

// @desc    Get a doctor's public profile by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', ['name', 'email', 'avatar']);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
