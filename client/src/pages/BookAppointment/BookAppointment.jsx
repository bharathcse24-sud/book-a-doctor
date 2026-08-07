import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, bookAppointment } from '../../services/api';
import './BookAppointment.css';

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ date: '', time: '', reason: '', notes: '' });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getDoctorById(id);
        setDoctor(data);
      } catch {
        setError('Doctor not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) return setError('Please select a date and time.');
    setSubmitting(true);
    setError('');
    try {
      await bookAppointment({ doctor: id, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/my-appointments'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-container" style={{ paddingTop: '140px' }}><div className="spinner" /></div>;

  if (success) {
    return (
      <div className="book-page page-content">
        <div className="container">
          <div className="success-card animate-fadeInUp">
            <div className="success-icon">🎉</div>
            <h2>Appointment Booked!</h2>
            <p>Your appointment with Dr. {doctor?.name} has been confirmed. Redirecting to your appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page page-content">
      <div className="container">
        <div className="book-grid">
          {/* Doctor Summary */}
          {doctor && (
            <div className="book-doctor-card animate-fadeInUp">
              <div className="book-doctor-header">
                <div className="book-avatar">
                  {doctor.avatar
                    ? <img src={doctor.avatar} alt={doctor.name} />
                    : <div className="book-avatar-ph">{doctor.name?.charAt(0)}</div>
                  }
                </div>
                <div>
                  <h2>Dr. {doctor.name}</h2>
                  <p className="book-specialty">{doctor.specialty}</p>
                </div>
              </div>
              <div className="book-doctor-details">
                <div className="book-detail-item">
                  <span>🏥</span><span>{doctor.experience} years experience</span>
                </div>
                <div className="book-detail-item">
                  <span>💰</span><span>Consultation Fee: ₹{doctor.fees}</span>
                </div>
                <div className="book-detail-item">
                  <span>⭐</span><span>Rating: {doctor.rating || 4.5}/5</span>
                </div>
              </div>
              <div className="book-info-box">
                <h4>📌 Important Notes</h4>
                <ul>
                  <li>Please arrive 10 minutes early.</li>
                  <li>Bring your medical history & reports.</li>
                  <li>Cancellations must be done 24hrs prior.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="book-form-card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="book-form-title">Book Your Slot</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>📅 Select Date</label>
                <input
                  type="date"
                  id="appt-date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>⏰ Select Time Slot</label>
                <div className="time-slots-grid">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`time-slot-btn ${form.time === t ? 'selected' : ''}`}
                      onClick={() => setForm({ ...form, time: t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>📝 Reason for Visit</label>
                <input
                  type="text"
                  id="appt-reason"
                  placeholder="e.g. Chest pain, Routine checkup"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>🗒️ Additional Notes (Optional)</label>
                <textarea
                  id="appt-notes"
                  placeholder="Any additional information for the doctor..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                id="confirm-booking-btn"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : '✅ Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
