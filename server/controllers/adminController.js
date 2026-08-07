const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { memoryUser, memoryDoctor, memoryAppointment } = require('../utils/memoryStore');

const isConnected = () => mongoose.connection.readyState === 1;

const getDashboardStats = async (req, res) => {
  try {
    const userDb = isConnected() ? User : memoryUser;
    const docDb = isConnected() ? Doctor : memoryDoctor;
    const appDb = isConnected() ? Appointment : memoryAppointment;

    const [totalUsers, totalDoctors, totalAppointments, pendingAppointments, confirmedAppointments, completedAppointments, cancelledAppointments] = await Promise.all([
      userDb.countDocuments(),
      docDb.countDocuments(),
      appDb.countDocuments(),
      appDb.countDocuments({ status: 'pending' }),
      appDb.countDocuments({ status: 'confirmed' }),
      appDb.countDocuments({ status: 'completed' }),
      appDb.countDocuments({ status: 'cancelled' }),
    ]);
    res.json({
      totalUsers,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageUsers = async (req, res) => {
  try {
    if (isConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    }
    const users = await memoryUser.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    if (isConnected()) {
      let query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      const appointments = await Appointment.find(query)
        .populate('patient', 'name email phone')
        .populate('doctor', 'name specialty avatar')
        .sort({ createdAt: -1 });

      let result = appointments;
      if (search) {
        const s = search.toLowerCase();
        result = appointments.filter(
          (a) =>
            a.patient?.name?.toLowerCase().includes(s) ||
            a.patient?.email?.toLowerCase().includes(s) ||
            a.doctor?.name?.toLowerCase().includes(s) ||
            a.doctor?.specialty?.toLowerCase().includes(s)
        );
      }
      return res.json(result);
    }
    const result = await memoryAppointment.findAll({ status, search });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (isConnected()) {
      const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status, ...(notes && { notes }) },
        { new: true }
      )
        .populate('patient', 'name email')
        .populate('doctor', 'name specialty');

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      return res.json(appointment);
    }

    const appointment = await memoryAppointment.findByIdAndUpdate(id, { status, notes });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userDb = isConnected() ? User : memoryUser;
    const user = await userDb.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin user' });
    await userDb.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  manageUsers,
  getAllAppointmentsAdmin,
  updateAppointmentStatus,
  deleteUser,
};

