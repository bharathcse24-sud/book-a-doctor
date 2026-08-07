import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner container">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🩺 BookADoctor</Link>
          <p>Connecting patients with the right doctors, instantly. Your health, our priority.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/doctors">Find Doctors</Link></li>
            <li><Link to="/my-appointments">My Appointments</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        {/* Specialties */}
        <div className="footer-col">
          <h4>Specialties</h4>
          <ul>
            <li><Link to="/doctors?specialty=Cardiology">Cardiology</Link></li>
            <li><Link to="/doctors?specialty=Dermatology">Dermatology</Link></li>
            <li><Link to="/doctors?specialty=Orthopedics">Orthopedics</Link></li>
            <li><Link to="/doctors?specialty=Pediatrics">Pediatrics</Link></li>
            <li><Link to="/doctors?specialty=Neurology">Neurology</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li>📧 deepansr007@gmail.com</li>
            <li>📞 +91 7373265454</li>
            <li>📍 Dharmapuri, Tamil Nadu, India</li>
            <li>🕐 Mon – Sat: 9AM – 8PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BookADoctor. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
