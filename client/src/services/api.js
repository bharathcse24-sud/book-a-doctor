import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});

// ─── AUTH ───────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── DOCTORS ─────────────────────────────────────────────
export const getDoctors = (params) => API.get('/doctors', { params });
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const createDoctor = (data) => API.post('/doctors', data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

// ─── APPOINTMENTS ─────────────────────────────────────────
export const bookAppointment = (data) => API.post('/appointments', data);
export const getMyAppointments = () => API.get('/appointments/my');
export const cancelAppointment = (id) => API.put(`/appointments/${id}/cancel`);
export const getAllAppointments = () => API.get('/appointments/all');

// ─── UPLOADS ──────────────────────────────────────────────
export const uploadReport = (appointmentId, formData) =>
  API.post(`/upload/${appointmentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── ADMIN ────────────────────────────────────────────────
export const getDashboardStats = () => API.get('/admin/stats');
export const getUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminAppointments = (params) => API.get('/admin/appointments', { params });
export const updateAppointmentStatus = (id, data) => API.put(`/admin/appointments/${id}/status`, data);

export default API;
