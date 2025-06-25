const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// ... existing code ...
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email',
        },
        select: 'specialty contactPhone',
      })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all appointments for a doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    // First, find the Doctor model ID from the user ID
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found.' });
    }

    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate('user', ['name', 'email']); // Populate with patient info
      
    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an appointment's status
exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const { id: appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Find the doctor profile of the logged-in user
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found.' });
    }

    // Check if the appointment belongs to this doctor
    if (appointment.doctor.toString() !== doctorProfile._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this appointment.' });
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, notes, symptoms, guestEmail } = req.body;
    const files = req.files ? req.files : [];
    const documentPaths = files.map(file => `/uploads/${file.filename}`);

    if (!date) {
      return res.status(400).json({ message: 'A date is required for an appointment.' });
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format provided.' });
    }

    if (appointmentDate <= new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future.' });
    }

    const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    if (!doctor.user) {
      console.error(`Data integrity issue: Doctor ${doctor._id} has no associated user.`);
      return res.status(500).json({ message: 'Could not process appointment due to a server data error.' });
    }

    const conflicting = await Appointment.findOne({ doctor: doctorId, date: appointmentDate, status: { $ne: 'Cancelled' } });
    if (conflicting) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    let patientEmail;
    let patientName = 'Guest';
    const appointmentData = {
      doctor: doctorId,
      date: appointmentDate,
      notes,
      symptoms,
      documents: documentPaths,
      status: 'Pending',
    };

    if (req.user) {
      // Logged-in user
      appointmentData.user = req.user._id;
      const patient = await User.findById(req.user._id);
      patientEmail = patient.email;
      patientName = patient.name;
    } else if (guestEmail) {
      // Guest user
      appointmentData.guestEmail = guestEmail;
      patientEmail = guestEmail;
    } else {
      return res.status(400).json({ message: 'Email is required for guest booking.' });
    }

    const appointment = new Appointment(appointmentData);
    const savedAppointment = await appointment.save();

    // Send confirmation email to the patient
    await sendEmail({
      to: patientEmail,
      subject: 'Your Appointment Confirmation',
      html: `
        <h3>Hello ${patientName},</h3>
        <p>Your appointment with <strong>Dr. ${doctor.user.name}</strong> (${doctor.specialty}) is confirmed!</p>
        <p><strong>Booking ID:</strong> ${savedAppointment.bookingId}</p>
        <p><strong>Date:</strong> ${new Date(savedAppointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(savedAppointment.date).toLocaleTimeString()}</p>
        <p>Thank you for choosing our service!</p>
      `,
    });

    // Send notification email to the doctor
    await sendEmail({
      to: doctor.user.email,
      subject: 'New Appointment Booked',
      html: `
        <h3>Hello Dr. ${doctor.user.name},</h3>
        <p>A new appointment has been booked with you.</p>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Booking ID:</strong> ${savedAppointment.bookingId}</p>
        <p><strong>Date:</strong> ${new Date(savedAppointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(savedAppointment.date).toLocaleTimeString()}</p>
        <p>Please log in to your dashboard to view more details.</p>
      `,
    });

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper function to check appointment ownership
const isAppointmentOwner = (appointment, user) => {
  if (!user) return false;
  return appointment.user?.toString() === user._id.toString();
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (!isAppointmentOwner(appointment, req.user)) {
      return res.status(401).json({ message: 'Not authorized to cancel this appointment.' });
    }
    appointment.status = 'Cancelled';
    await appointment.save();

    // Send cancellation confirmation email
    const patient = await User.findById(req.user._id);
    await sendEmail({
      to: patient.email,
      subject: 'Your Appointment Has Been Cancelled',
      html: `
        <h3>Hello ${patient.name},</h3>
        <p>Your appointment with <strong>Dr. ${appointment.doctor.user.name}</strong> scheduled for ${new Date(appointment.date).toLocaleString()} has been cancelled.</p>
        <p><strong>Booking ID:</strong> ${appointment.bookingId}</p>
        <p>If you did not request this cancellation, please contact our support team immediately.</p>
      `,
    });

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Reschedule an appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (!isAppointmentOwner(appointment, req.user)) {
      return res.status(401).json({ message: 'Not authorized to reschedule this appointment.' });
    }
    
    appointment.date = new Date(date); // Correctly cast to Date
    appointment.status = 'Pending'; // Reset status on reschedule
    await appointment.save();

    // Send reschedule confirmation email
    const patient = await User.findById(req.user._id);
    await sendEmail({
      to: patient.email,
      subject: 'Your Appointment Has Been Rescheduled',
      html: `
        <h3>Hello ${patient.name},</h3>
        <p>Your appointment with <strong>Dr. ${appointment.doctor.user.name}</strong> has been successfully rescheduled.</p>
        <p><strong>Booking ID:</strong> ${appointment.bookingId}</p>
        <p><strong>New Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
        <p><strong>New Time:</strong> ${new Date(appointment.date).toLocaleTimeString()}</p>
        <p>Thank you for choosing our service!</p>
      `,
    });

    res.json({ message: 'Appointment rescheduled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};