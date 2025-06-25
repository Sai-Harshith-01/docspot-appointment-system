const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/emailService');

// @desc    Get all users with role 'doctor' that are not yet approved
exports.getUnapprovedDoctors = async (req, res) => {
  try {
    const unapprovedDoctors = await User.find({ role: 'doctor', isApproved: false });
    res.json(unapprovedDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve a doctor's registration by setting isApproved to true
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (doctor && doctor.role === 'doctor') {
      // Auto-complete Doctor profile if incomplete
      let profile = await Doctor.findOne({ user: doctor._id });
      if (profile) {
        let updated = false;
        if (profile.specialty === 'Not set') { profile.specialty = 'Cardiologist'; updated = true; }
        if (JSON.stringify(profile.qualifications) === JSON.stringify(['Not set'])) { profile.qualifications = ['MBBS', 'MD']; updated = true; }
        if (!profile.experience || profile.experience <= 0) { profile.experience = 5; updated = true; }
        if (updated) {
          await profile.save();
        }
      } else {
        // Create a profile if missing (shouldn't happen, but for safety)
        profile = new Doctor({
          user: doctor._id,
          specialty: 'Cardiologist',
          qualifications: ['MBBS', 'MD'],
          experience: 5,
          consultationHours: { start: '09:00', end: '17:00' }
        });
        await profile.save();
      }
      // Send notification email to doctor
      try {
        await sendEmail({
          to: doctor.email,
          subject: 'Your Doctor Account Has Been Approved!',
          html: `<h3>Congratulations, Dr. ${doctor.name}!</h3>
            <p>Your account has been approved by the admin. Please <a href="http://localhost:3000/login">log in</a> and complete your profile to start receiving appointments.</p>
            <p>Make sure to fill in your specialty, qualifications, experience, and other details so patients can find and book you.</p>
            <p>Thank you for joining our platform!</p>`
        });
      } catch (emailErr) {
        console.error('Failed to send approval email to doctor:', emailErr);
      }
      res.json({ message: 'Doctor approved successfully, profile auto-completed if needed, and notification sent.' });
    } else {
      res.status(404).json({ message: 'Doctor not found or user is not a doctor' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all doctors (users with doctor role)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', ['name', 'email'])
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.id });

    if (doctor) {
      await doctor.remove();
      await User.findByIdAndRemove(req.params.id);
      res.json({ message: 'Doctor removed' });
    } else {
      // If there's no Doctor entry, maybe the user is just a user account
      // that was created but not fully registered as a doctor.
      // Still, we should remove the User account if the intent is to delete the doctor.
      const user = await User.findByIdAndRemove(req.params.id);
      if(user) {
        res.json({ message: 'Doctor user account removed' });
      } else {
        res.status(404).json({ message: 'Doctor not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
