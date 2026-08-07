const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
require('dotenv').config();

// Additional doctors data - 5 doctors each for Dentistry and General
const additionalDoctorsData = [
  // Dentistry
  {
    name: "Dr. William Parker",
    email: "william.parker@hospital.com",
    specialty: "Dentistry",
    experience: 15,
    qualifications: ["DDS", "BDS", "Fellowship in Oral Surgery"],
    bio: "Experienced dentist specializing in oral surgery, dental implants, and complex extractions.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    fees: 400,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "11:00", "14:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. Sandra Cooper",
    email: "sandra.cooper@hospital.com",
    specialty: "Dentistry",
    experience: 12,
    qualifications: ["DDS", "BDS", "Certificate in Orthodontics"],
    bio: "Orthodontist specializing in braces, clear aligners, and bite correction for all ages.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    fees: 450,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Richard Hughes",
    email: "richard.hughes@hospital.com",
    specialty: "Dentistry",
    experience: 18,
    qualifications: ["DDS", "BDS", "Fellowship in Periodontics"],
    bio: "Periodontist specializing in gum disease treatment, dental cleaning, and gum surgery.",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    fees: 500,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "11:00"] },
      { day: "Friday", times: ["14:00", "15:00", "16:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Nancy Rivera",
    email: "nancy.rivera@hospital.com",
    specialty: "Dentistry",
    experience: 10,
    qualifications: ["DDS", "BDS", "Certificate in Pediatric Dentistry"],
    bio: "Pediatric dentist specializing in children's dental care, cavity prevention, and dental anxiety management.",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
    fees: 350,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Charles Ward",
    email: "charles.ward@hospital.com",
    specialty: "Dentistry",
    experience: 14,
    qualifications: ["DDS", "BDS", "Fellowship in Cosmetic Dentistry"],
    bio: "Cosmetic dentist specializing in veneers, teeth whitening, smile makeovers, and aesthetic dentistry.",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    fees: 550,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00", "15:00"] }
    ],
    rating: 4.8
  },

  // General
  {
    name: "Dr. Karen Mitchell",
    email: "karen.mitchell@hospital.com",
    specialty: "General",
    experience: 16,
    qualifications: ["MBBS", "MD Family Medicine", "Board Certified Family Physician"],
    bio: "Family medicine physician providing comprehensive primary care for patients of all ages.",
    avatar: "https://images.unsplash.com/photo-1594824694996-997053bb02a5?w=400&h=400&fit=crop&crop=face",
    fees: 300,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "11:00", "14:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Eric Barnes",
    email: "eric.barnes@hospital.com",
    specialty: "General",
    experience: 13,
    qualifications: ["MBBS", "MD Internal Medicine", "Board Certified Internist"],
    bio: "Internal medicine physician specializing in adult primary care, chronic disease management, and preventive medicine.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    fees: 350,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Helen Cox",
    email: "helen.cox@hospital.com",
    specialty: "General",
    experience: 20,
    qualifications: ["MBBS", "MD Family Medicine", "Fellowship in Geriatric Medicine"],
    bio: "Senior family physician with expertise in geriatric care, diabetes management, and hypertension treatment.",
    avatar: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face",
    fees: 400,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "11:00"] },
      { day: "Friday", times: ["14:00", "15:00", "16:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Timothy Rogers",
    email: "timothy.rogers@hospital.com",
    specialty: "General",
    experience: 11,
    qualifications: ["MBBS", "MD Family Medicine", "Certificate in Sports Medicine"],
    bio: "Family physician with sports medicine training, specializing in injury prevention and athletic health.",
    avatar: "https://images.unsplash.com/photo-1654611323352-8d5a8471c52e?w=400&h=400&fit=crop&crop=face",
    fees: 320,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.5
  },
  {
    name: "Dr. Angela Ross",
    email: "angela.ross@hospital.com",
    specialty: "General",
    experience: 15,
    qualifications: ["MBBS", "MD Internal Medicine", "Fellowship in Women's Health"],
    bio: "Primary care physician specializing in women's health, reproductive health, and wellness programs.",
    avatar: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop&crop=face",
    fees: 380,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00"] }
    ],
    rating: 4.8
  }
];

const seedAdditionalDoctors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Insert additional doctors
    const insertedDoctors = await Doctor.insertMany(additionalDoctorsData);
    console.log(`Successfully inserted ${insertedDoctors.length} additional doctors`);

    // Display summary
    const specialties = [...new Set(additionalDoctorsData.map(doc => doc.specialty))];
    specialties.forEach(specialty => {
      const count = additionalDoctorsData.filter(doc => doc.specialty === specialty).length;
      console.log(`${specialty}: ${count} doctors added`);
    });

    // Show total doctors in database
    const totalDoctors = await Doctor.countDocuments();
    console.log(`Total doctors in database: ${totalDoctors}`);

    // Show doctors count by specialty
    const allSpecialties = await Doctor.distinct('specialty');
    console.log('\nDoctors count by specialty:');
    for (const specialty of allSpecialties) {
      const count = await Doctor.countDocuments({ specialty });
      console.log(`${specialty}: ${count} doctors`);
    }

    console.log('\nAdditional doctors seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding additional doctors:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAdditionalDoctors();