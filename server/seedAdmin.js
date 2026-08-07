/**
 * Seed script to create the admin user
 * Run: node seedAdmin.js
 */
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book-a-doctor');
      console.log('✅ Connected to MongoDB');
    }

    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      // Update role to admin if not already
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('✅ Existing user updated to admin role');
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    } else {
      await User.create({
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created successfully');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email    : admin@gmail.com');
    console.log('   Password : admin123');
    console.log('   Role     : admin\n');
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

if (require.main === module) {
  seedAdmin().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedAdmin;

