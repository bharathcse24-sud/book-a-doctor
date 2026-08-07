const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending transactional emails for the BookADoctor platform.
 * Configure SMTP settings in server/.env
 */

// Create reusable transporter
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/**
 * Send a generic email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"BookADoctor" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

/**
 * Send appointment confirmation email to patient
 * @param {Object} params
 */
const sendAppointmentConfirmation = async ({ patientEmail, patientName, doctorName, date, time }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8faff; padding: 32px; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🩺 BookADoctor</h1>
      </div>
      <h2 style="color: #1e293b;">Appointment Confirmed! ✅</h2>
      <p style="color: #475569;">Hi <strong>${patientName}</strong>,</p>
      <p style="color: #475569;">Your appointment has been successfully booked. Here are the details:</p>
      <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin: 20px 0;">
        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">Please arrive 10 minutes early and bring your medical history.</p>
      <p style="color: #64748b; font-size: 14px;">To cancel or reschedule, visit <a href="${process.env.CLIENT_URL}/my-appointments" style="color: #2563eb;">My Appointments</a>.</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        © ${new Date().getFullYear()} BookADoctor. All rights reserved.
      </p>
    </div>
  `;
  return sendEmail({
    to: patientEmail,
    subject: `Appointment Confirmed – Dr. ${doctorName} on ${date}`,
    html,
  });
};

/**
 * Send appointment cancellation email
 */
const sendAppointmentCancellation = async ({ patientEmail, patientName, doctorName, date }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #ef4444;">Appointment Cancelled ❌</h2>
      <p>Hi <strong>${patientName}</strong>,</p>
      <p>Your appointment with Dr. ${doctorName} on ${date} has been cancelled.</p>
      <p>You can book a new appointment at any time from our platform.</p>
      <a href="${process.env.CLIENT_URL}/doctors" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">
        Book New Appointment
      </a>
    </div>
  `;
  return sendEmail({
    to: patientEmail,
    subject: `Appointment Cancelled – Dr. ${doctorName}`,
    html,
  });
};

/**
 * Send welcome email to newly registered user
 */
const sendWelcomeEmail = async ({ email, name }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #2563eb;">Welcome to BookADoctor! 🎉</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your account has been created successfully. You can now:</p>
      <ul>
        <li>🔍 Browse 500+ verified doctors</li>
        <li>📅 Book appointments instantly</li>
        <li>📂 Upload medical reports securely</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/doctors" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">
        Find a Doctor Now →
      </a>
    </div>
  `;
  return sendEmail({
    to: email,
    subject: 'Welcome to BookADoctor! 🩺',
    html,
  });
};

module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
  sendWelcomeEmail,
};
