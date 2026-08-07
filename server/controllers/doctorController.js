const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const { memoryDoctor } = require('../utils/memoryStore');

const isConnected = () => mongoose.connection.readyState === 1;

const getDoctors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    if (isConnected()) {
      let query = {};
      if (specialty) query.specialty = specialty;
      if (search) query.name = { $regex: search, $options: 'i' };
      const doctors = await Doctor.find(query);
      return res.json(doctors);
    }
    const doctors = await memoryDoctor.find({ specialty, search });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const db = isConnected() ? Doctor : memoryDoctor;
    const doctor = await db.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const db = isConnected() ? Doctor : memoryDoctor;
    const doctor = await db.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    let doctor;
    if (isConnected()) {
      doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } else {
      doctor = await memoryDoctor.findByIdAndUpdate(req.params.id, req.body);
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const db = isConnected() ? Doctor : memoryDoctor;
    await db.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };

