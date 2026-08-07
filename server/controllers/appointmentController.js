const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { memoryAppointment } = require('../utils/memoryStore');

const isConnected = () => mongoose.connection.readyState === 1;

const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;
    if (isConnected()) {
      const appointment = await Appointment.create({ patient: req.user._id, doctor, date, time, reason });
      return res.status(201).json(appointment);
    }
    const appointment = await memoryAppointment.create({ patient: req.user._id, doctor, date, time, reason });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    if (isConnected()) {
      const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialty avatar');
      return res.json(appointments);
    }
    const appointments = await memoryAppointment.findByPatient(req.user._id);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    if (isConnected()) {
      const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
      return res.json(appointment);
    }
    const appointment = await memoryAppointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    if (isConnected()) {
      const appointments = await Appointment.find().populate('patient', 'name email').populate('doctor', 'name specialty');
      return res.json(appointments);
    }
    const appointments = await memoryAppointment.findAll();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookAppointment, getMyAppointments, cancelAppointment, getAllAppointments };

