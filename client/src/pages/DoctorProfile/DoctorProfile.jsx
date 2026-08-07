import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoctorById } from '../../services/api';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="spinner-container" style={{ paddingTop: '140px' }}><div className="spinner" /></div>;
  if (!doctor) return <div className="empty-state" style={{ paddingTop: '140px' }}><div className="icon">😕</div><h3>Doctor not found</h3></div>;

  const stars = Math.round(doctor.rating || 4.5);

  return (
    <div className="doctor-profile-page page-content">
      <div className="container">
        {/* Hero Card */}
        <div className="profile-hero-card animate-fadeInUp">
          <div className="profile-hero-bg" />
          <div className="profile-hero-content">
            <div className="profile-avatar-wrap">
              {doctor.avatar
                ? <img src={doctor.avatar} alt={doctor.name} className="profile-avatar" />
                : <div className="profile-avatar-ph">{doctor.name?.charAt(0)}</div>
              }
              {doctor.available && <span className="profile-available-badge">● Available</span>}
            </div>
            <div className="profile-info">
              <h1>Dr. {doctor.name}</h1>
              <p className="profile-specialty">{doctor.specialty}</p>
              <div className="profile-stats">
                <div className="profile-stat">
                  <strong>{doctor.experience}+</strong>
                  <span>Years Exp.</span>
                </div>
                <div className="profile-stat">
                  <strong>{doctor.reviews?.length || 0}</strong>
                  <span>Reviews</span>
                </div>
                <div className="profile-stat">
                  <strong>{'★'.repeat(stars)}</strong>
                  <span>Rating</span>
                </div>
              </div>
              <div className="profile-quals">
                {doctor.qualifications?.map((q, i) => (
                  <span key={i} className="qual-tag">{q}</span>
                ))}
              </div>
            </div>
            <div className="profile-book-side">
              <div className="profile-fee-card">
                <p className="fee-label">Consultation Fee</p>
                <p className="fee-amount">₹{doctor.fees}</p>
                <Link to={`/book/${doctor._id}`} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  📅 Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {['about', 'slots', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'about' ? '📋 About' : tab === 'slots' ? '🕐 Available Slots' : '⭐ Reviews'}
            </button>
          ))}
        </div>

        <div className="profile-tab-content animate-fadeIn">
          {activeTab === 'about' && (
            <div className="profile-about card" style={{ padding: '32px' }}>
              <h2>About Dr. {doctor.name}</h2>
              <p>{doctor.bio || 'This doctor has not added a bio yet.'}</p>
            </div>
          )}
          {activeTab === 'slots' && (
            <div className="profile-slots card" style={{ padding: '32px' }}>
              <h2>Available Time Slots</h2>
              {doctor.availableSlots?.length ? (
                <div className="slots-grid">
                  {doctor.availableSlots.map((slot, i) => (
                    <div key={i} className="slot-day">
                      <h4>{slot.day}</h4>
                      <div className="slot-times">
                        {slot.times.map((t, j) => (
                          <span key={j} className="slot-time">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No slots configured yet.</p>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="profile-reviews card" style={{ padding: '32px' }}>
              <h2>Patient Reviews</h2>
              {doctor.reviews?.length ? (
                <div className="reviews-list">
                  {doctor.reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <div className="review-avatar">{r.user?.name?.charAt(0) || 'P'}</div>
                        <div>
                          <strong>{r.user?.name || 'Anonymous'}</strong>
                          <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </div>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">💬</div>
                  <h3>No Reviews Yet</h3>
                  <p>Be the first to review this doctor.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
