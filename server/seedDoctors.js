const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
require('dotenv').config();

// Sample doctors data - 5 doctors per specialty
const doctorsData = [
  // Cardiology
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    specialty: "Cardiology",
    experience: 15,
    qualifications: ["MD Cardiology", "MBBS", "Fellowship in Interventional Cardiology"],
    bio: "Experienced cardiologist specializing in heart disease prevention and treatment. Expert in cardiac catheterization and angioplasty procedures.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    fees: 800,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "11:00", "14:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    specialty: "Cardiology",
    experience: 12,
    qualifications: ["MD Cardiology", "MBBS", "Board Certified Cardiologist"],
    bio: "Specializes in non-invasive cardiology and echocardiography. Expert in managing complex heart conditions.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    fees: 750,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@hospital.com",
    specialty: "Cardiology",
    experience: 18,
    qualifications: ["MD Cardiology", "MBBS", "PhD in Cardiac Surgery"],
    bio: "Senior cardiologist with extensive experience in cardiac surgery and heart transplantation.",
    avatar: "https://images.unsplash.com/photo-1594824694996-997053bb02a5?w=400&h=400&fit=crop&crop=face",
    fees: 900,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "11:00"] },
      { day: "Friday", times: ["14:00", "15:00", "16:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@hospital.com",
    specialty: "Cardiology",
    experience: 10,
    qualifications: ["MD Cardiology", "MBBS", "Fellowship in Electrophysiology"],
    bio: "Specializes in heart rhythm disorders and cardiac electrophysiology procedures.",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    fees: 700,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Lisa Park",
    email: "lisa.park@hospital.com",
    specialty: "Cardiology",
    experience: 14,
    qualifications: ["MD Cardiology", "MBBS", "Fellowship in Preventive Cardiology"],
    bio: "Focuses on preventive cardiology and lifestyle medicine for heart disease prevention.",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
    fees: 750,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00", "15:00"] }
    ],
    rating: 4.8
  },

  // Neurology
  {
    name: "Dr. Robert Anderson",
    email: "robert.anderson@hospital.com",
    specialty: "Neurology",
    experience: 16,
    qualifications: ["MD Neurology", "MBBS", "Fellowship in Movement Disorders"],
    bio: "Neurologist specializing in movement disorders, Parkinson's disease, and epilepsy treatment.",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    fees: 850,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Friday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Anna Thompson",
    email: "anna.thompson@hospital.com",
    specialty: "Neurology",
    experience: 13,
    qualifications: ["MD Neurology", "MBBS", "Fellowship in Stroke Medicine"],
    bio: "Expert in stroke prevention, treatment, and rehabilitation. Specializes in cerebrovascular diseases.",
    avatar: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face",
    fees: 800,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "14:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. David Kim",
    email: "david.kim@hospital.com",
    specialty: "Neurology",
    experience: 20,
    qualifications: ["MD Neurology", "MBBS", "PhD in Neuroscience"],
    bio: "Senior neurologist with expertise in multiple sclerosis, headache disorders, and neuroimaging.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    fees: 950,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00"] },
      { day: "Friday", times: ["14:00", "15:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Jennifer Lee",
    email: "jennifer.lee@hospital.com",
    specialty: "Neurology",
    experience: 11,
    qualifications: ["MD Neurology", "MBBS", "Fellowship in Pediatric Neurology"],
    bio: "Specializes in pediatric neurology and developmental disorders in children.",
    avatar: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop&crop=face",
    fees: 750,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Mark Davis",
    email: "mark.davis@hospital.com",
    specialty: "Neurology",
    experience: 17,
    qualifications: ["MD Neurology", "MBBS", "Fellowship in Neuromuscular Disorders"],
    bio: "Expert in neuromuscular diseases, ALS, and muscular dystrophy treatment.",
    avatar: "https://images.unsplash.com/photo-1654611323352-8d5a8471c52e?w=400&h=400&fit=crop&crop=face",
    fees: 850,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00"] }
    ],
    rating: 4.7
  },

  // Orthopedics
  {
    name: "Dr. Kevin Martinez",
    email: "kevin.martinez@hospital.com",
    specialty: "Orthopedics",
    experience: 14,
    qualifications: ["MS Orthopedic Surgery", "MBBS", "Fellowship in Joint Replacement"],
    bio: "Orthopedic surgeon specializing in joint replacement surgery and sports medicine.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    fees: 900,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00"] },
      { day: "Wednesday", times: ["14:00", "15:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00", "15:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. Rachel Green",
    email: "rachel.green@hospital.com",
    specialty: "Orthopedics",
    experience: 12,
    qualifications: ["MS Orthopedic Surgery", "MBBS", "Fellowship in Spine Surgery"],
    bio: "Spine specialist with expertise in minimally invasive spinal procedures and back pain management.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    fees: 850,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Thomas Brown",
    email: "thomas.brown@hospital.com",
    specialty: "Orthopedics",
    experience: 18,
    qualifications: ["MS Orthopedic Surgery", "MBBS", "Fellowship in Trauma Surgery"],
    bio: "Senior orthopedic trauma surgeon with extensive experience in complex fracture management.",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    fees: 950,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00"] },
      { day: "Friday", times: ["14:00", "15:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Amy White",
    email: "amy.white@hospital.com",
    specialty: "Orthopedics",
    experience: 10,
    qualifications: ["MS Orthopedic Surgery", "MBBS", "Fellowship in Pediatric Orthopedics"],
    bio: "Pediatric orthopedic surgeon specializing in children's bone and joint disorders.",
    avatar: "https://images.unsplash.com/photo-1594824694996-997053bb02a5?w=400&h=400&fit=crop&crop=face",
    fees: 750,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Stephen Clark",
    email: "stephen.clark@hospital.com",
    specialty: "Orthopedics",
    experience: 15,
    qualifications: ["MS Orthopedic Surgery", "MBBS", "Fellowship in Hand Surgery"],
    bio: "Hand and wrist specialist with expertise in microsurgery and nerve reconstruction.",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    fees: 800,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00"] }
    ],
    rating: 4.7
  },

  // Pediatrics
  {
    name: "Dr. Maria Lopez",
    email: "maria.lopez@hospital.com",
    specialty: "Pediatrics",
    experience: 13,
    qualifications: ["MD Pediatrics", "MBBS", "Fellowship in Pediatric Cardiology"],
    bio: "Pediatrician specializing in children's heart conditions and general pediatric care.",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
    fees: 600,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Friday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. Daniel Taylor",
    email: "daniel.taylor@hospital.com",
    specialty: "Pediatrics",
    experience: 11,
    qualifications: ["MD Pediatrics", "MBBS", "Fellowship in Neonatology"],
    bio: "Neonatologist specializing in newborn care and premature infant treatment.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    fees: 650,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Susan Miller",
    email: "susan.miller@hospital.com",
    specialty: "Pediatrics",
    experience: 16,
    qualifications: ["MD Pediatrics", "MBBS", "Fellowship in Pediatric Endocrinology"],
    bio: "Pediatric endocrinologist specializing in diabetes and growth disorders in children.",
    avatar: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face",
    fees: 700,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00"] },
      { day: "Friday", times: ["14:00", "15:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Christopher Moore",
    email: "christopher.moore@hospital.com",
    specialty: "Pediatrics",
    experience: 9,
    qualifications: ["MD Pediatrics", "MBBS", "Fellowship in Pediatric Pulmonology"],
    bio: "Pediatric pulmonologist specializing in respiratory conditions in children and asthma management.",
    avatar: "https://images.unsplash.com/photo-1654611323352-8d5a8471c52e?w=400&h=400&fit=crop&crop=face",
    fees: 580,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.5
  },
  {
    name: "Dr. Nicole Adams",
    email: "nicole.adams@hospital.com",
    specialty: "Pediatrics",
    experience: 14,
    qualifications: ["MD Pediatrics", "MBBS", "Fellowship in Pediatric Gastroenterology"],
    bio: "Pediatric gastroenterologist specializing in digestive disorders and nutrition in children.",
    avatar: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop&crop=face",
    fees: 650,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00"] }
    ],
    rating: 4.8
  },

  // Dermatology
  {
    name: "Dr. Jessica Turner",
    email: "jessica.turner@hospital.com",
    specialty: "Dermatology",
    experience: 12,
    qualifications: ["MD Dermatology", "MBBS", "Fellowship in Cosmetic Dermatology"],
    bio: "Dermatologist specializing in skin cancer detection, acne treatment, and cosmetic procedures.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    fees: 700,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Wednesday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Friday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Brian Phillips",
    email: "brian.phillips@hospital.com",
    specialty: "Dermatology",
    experience: 15,
    qualifications: ["MD Dermatology", "MBBS", "Fellowship in Mohs Surgery"],
    bio: "Dermatologic surgeon specializing in Mohs surgery for skin cancer treatment.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    fees: 800,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "14:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. Laura Evans",
    email: "laura.evans@hospital.com",
    specialty: "Dermatology",
    experience: 10,
    qualifications: ["MD Dermatology", "MBBS", "Fellowship in Pediatric Dermatology"],
    bio: "Pediatric dermatologist specializing in skin conditions in children and adolescents.",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
    fees: 650,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00"] },
      { day: "Friday", times: ["14:00", "15:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Ryan Collins",
    email: "ryan.collins@hospital.com",
    specialty: "Dermatology",
    experience: 18,
    qualifications: ["MD Dermatology", "MBBS", "Fellowship in Dermatopathology"],
    bio: "Dermatopathologist with expertise in skin biopsy interpretation and rare skin diseases.",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    fees: 850,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Michelle Stewart",
    email: "michelle.stewart@hospital.com",
    specialty: "Dermatology",
    experience: 13,
    qualifications: ["MD Dermatology", "MBBS", "Fellowship in Immunodermatology"],
    bio: "Specializes in autoimmune skin diseases and complex dermatological conditions.",
    avatar: "https://images.unsplash.com/photo-1594824694996-997053bb02a5?w=400&h=400&fit=crop&crop=face",
    fees: 750,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00"] }
    ],
    rating: 4.7
  },

  // Ophthalmology
  {
    name: "Dr. Andrew Foster",
    email: "andrew.foster@hospital.com",
    specialty: "Ophthalmology",
    experience: 16,
    qualifications: ["MS Ophthalmology", "MBBS", "Fellowship in Retinal Surgery"],
    bio: "Retinal specialist with expertise in diabetic retinopathy and macular degeneration treatment.",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    fees: 850,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00", "11:00"] },
      { day: "Wednesday", times: ["14:00", "15:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00", "15:00"] }
    ],
    rating: 4.8
  },
  {
    name: "Dr. Patricia Reed",
    email: "patricia.reed@hospital.com",
    specialty: "Ophthalmology",
    experience: 14,
    qualifications: ["MS Ophthalmology", "MBBS", "Fellowship in Corneal Surgery"],
    bio: "Corneal specialist with expertise in corneal transplantation and refractive surgery.",
    avatar: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face",
    fees: 800,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "15:00"] },
      { day: "Saturday", times: ["09:00", "10:00"] }
    ],
    rating: 4.7
  },
  {
    name: "Dr. Joseph Murphy",
    email: "joseph.murphy@hospital.com",
    specialty: "Ophthalmology",
    experience: 20,
    qualifications: ["MS Ophthalmology", "MBBS", "Fellowship in Glaucoma"],
    bio: "Glaucoma specialist with extensive experience in glaucoma surgery and management.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    fees: 900,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", times: ["09:00", "10:00"] },
      { day: "Friday", times: ["14:00", "15:00"] }
    ],
    rating: 4.9
  },
  {
    name: "Dr. Catherine Bell",
    email: "catherine.bell@hospital.com",
    specialty: "Ophthalmology",
    experience: 11,
    qualifications: ["MS Ophthalmology", "MBBS", "Fellowship in Pediatric Ophthalmology"],
    bio: "Pediatric ophthalmologist specializing in children's eye conditions and strabismus surgery.",
    avatar: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop&crop=face",
    fees: 750,
    available: true,
    availableSlots: [
      { day: "Tuesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", times: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Saturday", times: ["09:00", "10:00", "11:00"] }
    ],
    rating: 4.6
  },
  {
    name: "Dr. Gregory Price",
    email: "gregory.price@hospital.com",
    specialty: "Ophthalmology",
    experience: 17,
    qualifications: ["MS Ophthalmology", "MBBS", "Fellowship in Oculoplastic Surgery"],
    bio: "Oculoplastic surgeon specializing in eyelid surgery and orbital reconstruction.",
    avatar: "https://images.unsplash.com/photo-1654611323352-8d5a8471c52e?w=400&h=400&fit=crop&crop=face",
    fees: 850,
    available: true,
    availableSlots: [
      { day: "Monday", times: ["09:00", "10:00"] },
      { day: "Wednesday", times: ["14:00", "15:00", "16:00"] },
      { day: "Friday", times: ["09:00", "10:00", "14:00"] }
    ],
    rating: 4.8
  }
];

const seedDoctors = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book-a-doctor');
      console.log('Connected to MongoDB');
    }

    const doctorCount = await Doctor.countDocuments();
    if (doctorCount > 0) {
      console.log(`ℹ️  Doctors already seeded (${doctorCount} doctors in DB)`);
      return;
    }

    // Insert new doctors
    const insertedDoctors = await Doctor.insertMany(doctorsData);
    console.log(`Successfully inserted ${insertedDoctors.length} doctors`);

    // Display summary
    const specialties = [...new Set(doctorsData.map(doc => doc.specialty))];
    specialties.forEach(specialty => {
      const count = doctorsData.filter(doc => doc.specialty === specialty).length;
      console.log(`${specialty}: ${count} doctors`);
    });

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

if (require.main === module) {
  seedDoctors().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedDoctors, doctorsData };