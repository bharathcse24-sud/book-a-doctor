const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  experience: { type: Number, default: 0 },
  qualifications: [String],
  bio: { type: String },
  avatar: { type: String },
  fees: { type: Number, required: true },
  available: { type: Boolean, default: true },
  availableSlots: [{ day: String, times: [String] }],
  rating: { type: Number, default: 0 },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, comment: String, rating: Number }],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
