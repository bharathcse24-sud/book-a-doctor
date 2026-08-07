const bcrypt = require('bcryptjs');
const { doctorsData } = require('../seedDoctors');

// Pre-seeded in-memory store
const memoryStore = {
  users: [
    {
      _id: 'admin_user_id_123',
      name: 'Administrator',
      email: 'admin@gmail.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
  ],
  doctors: doctorsData.map((d, index) => ({
    _id: `doc_id_${index + 1}`,
    ...d,
    createdAt: new Date().toISOString(),
  })),
  appointments: [],
};

const memoryUser = {
  async findOne({ email }) {
    if (!email) return null;
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      matchPassword: async (enteredPassword) => await bcrypt.compare(enteredPassword, user.passwordHash),
    };
  },
  async findById(id) {
    const user = memoryStore.users.find(u => u._id === String(id));
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },
  async create({ name, email, password, role = 'patient' }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    memoryStore.users.push(newUser);
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      matchPassword: async (entered) => await bcrypt.compare(entered, newUser.passwordHash),
    };
  },
  async findByIdAndUpdate(id, updateData) {
    const index = memoryStore.users.findIndex(u => u._id === String(id));
    if (index === -1) return null;
    memoryStore.users[index] = { ...memoryStore.users[index], ...updateData };
    const { passwordHash, ...safeUser } = memoryStore.users[index];
    return safeUser;
  },
  async find() {
    return memoryStore.users.map(({ passwordHash, ...safe }) => safe);
  },
  async countDocuments() {
    return memoryStore.users.length;
  },
  async findByIdAndDelete(id) {
    const index = memoryStore.users.findIndex(u => u._id === String(id));
    if (index !== -1) {
      const removed = memoryStore.users.splice(index, 1);
      return removed[0];
    }
    return null;
  }
};

const memoryDoctor = {
  async find({ specialty, search } = {}) {
    let list = [...memoryStore.doctors];
    if (specialty) {
      list = list.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(s) || d.specialty.toLowerCase().includes(s));
    }
    return list;
  },
  async findById(id) {
    return memoryStore.doctors.find(d => d._id === String(id)) || null;
  },
  async create(data) {
    const newDoc = {
      _id: 'doc_' + Date.now(),
      available: true,
      rating: 4.5,
      reviews: [],
      ...data,
      createdAt: new Date().toISOString(),
    };
    memoryStore.doctors.push(newDoc);
    return newDoc;
  },
  async findByIdAndUpdate(id, data) {
    const index = memoryStore.doctors.findIndex(d => d._id === String(id));
    if (index === -1) return null;
    memoryStore.doctors[index] = { ...memoryStore.doctors[index], ...data };
    return memoryStore.doctors[index];
  },
  async findByIdAndDelete(id) {
    const index = memoryStore.doctors.findIndex(d => d._id === String(id));
    if (index !== -1) {
      memoryStore.doctors.splice(index, 1);
    }
    return true;
  },
  async countDocuments() {
    return memoryStore.doctors.length;
  }
};

const memoryAppointment = {
  async create({ patient, doctor, date, time, reason }) {
    const docObj = memoryStore.doctors.find(d => d._id === String(doctor)) || { _id: doctor, name: 'Doctor' };
    const newApp = {
      _id: 'app_' + Date.now(),
      patient,
      doctor: docObj,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    memoryStore.appointments.push(newApp);
    return newApp;
  },
  async findByPatient(patientId) {
    return memoryStore.appointments.filter(a => String(a.patient) === String(patientId) || String(a.patient?._id) === String(patientId));
  },
  async findAll({ status, search } = {}) {
    let list = [...memoryStore.appointments];
    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(a => 
        a.patient?.name?.toLowerCase().includes(s) ||
        a.doctor?.name?.toLowerCase().includes(s)
      );
    }
    return list;
  },
  async findByIdAndUpdate(id, { status, notes }) {
    const app = memoryStore.appointments.find(a => a._id === String(id));
    if (!app) return null;
    if (status) app.status = status;
    if (notes) app.notes = notes;
    return app;
  },
  async countDocuments(query = {}) {
    if (query.status) {
      return memoryStore.appointments.filter(a => a.status === query.status).length;
    }
    return memoryStore.appointments.length;
  }
};

module.exports = {
  memoryStore,
  memoryUser,
  memoryDoctor,
  memoryAppointment,
};
