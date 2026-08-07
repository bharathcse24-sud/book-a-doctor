import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Doctors from './pages/Doctors/Doctors';
import DoctorProfile from './pages/DoctorProfile/DoctorProfile';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import MyAppointments from './pages/MyAppointments/MyAppointments';
import UploadReports from './pages/UploadReports/UploadReports';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import NotFound from './pages/NotFound/NotFound';
import './assets/styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/book/:id" element={
              <ProtectedRoute><BookAppointment /></ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute><MyAppointments /></ProtectedRoute>
            } />
            <Route path="/upload-reports/:id" element={
              <ProtectedRoute><UploadReports /></ProtectedRoute>
            } />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
