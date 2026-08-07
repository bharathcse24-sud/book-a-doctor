const mongoose = require('mongoose');
const seedAdmin = require('../seedAdmin');
const { seedDoctors } = require('../seedDoctors');


// Disable Mongoose query buffering so operations fail fast if disconnected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book-a-doctor';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial data
    await seedAdmin();
    await seedDoctors();
  } catch (error) {
    console.error(`⚠️  MongoDB connection failed: ${error.message}`);
    console.error('   → Make sure MongoDB is running locally (e.g. mongodb://127.0.0.1:27017) or set MONGO_URI in server/.env');
    console.error('   → API requests will return HTTP 503 until MongoDB is connected.');
  }
};

module.exports = connectDB;

