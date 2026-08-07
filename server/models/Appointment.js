const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  reason: { type: String },
  notes: { type: String },
  reports: [{ name: String, url: String, uploadedAt: Date }],
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
