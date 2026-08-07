const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { memoryUser } = require('../utils/memoryStore');

const generateToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtkey_book_a_doctor_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

const isConnected = () => mongoose.connection.readyState === 1;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = isConnected() ? User : memoryUser;
    const userExists = await db.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await db.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'patient',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = isConnected() ? User : memoryUser;
    const user = await db.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'patient',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const db = isConnected() ? User : memoryUser;
    let user;
    if (isConnected()) {
      user = await db.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    } else {
      user = await memoryUser.findByIdAndUpdate(req.user._id, req.body);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };

