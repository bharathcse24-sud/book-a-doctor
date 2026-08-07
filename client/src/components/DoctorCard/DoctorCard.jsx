import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const stars = Math.round(doctor.rating || 4.5);
  return (
    <div className="doctor-card animate-fadeInUp">
      <div className="doctor-card__header">
        <div className="doctor-card__avatar">
          {doctor.avatar
            ? <img src={doctor.avatar} alt={doctor.name} />
            : <div className="avatar-placeholder">{doctor.name?.charAt(0)}</div>
          }
          {doctor.available && <span className="available-dot" title="Available" />}
        </div>
        <div className="doctor-card__rating">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          <span>({doctor.reviews?.length || 0})</span>
        </div>
      </div>

      <div className="doctor-card__body">
        <h3 className="doctor-name">Dr. {doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <div className="doctor-meta">
          <span>🏥 {doctor.experience} yrs exp</span>
          <span>💰 ₹{doctor.fees}</span>
        </div>
        {doctor.qualifications?.length > 0 && (
          <div className="doctor-quals">
            {doctor.qualifications.slice(0, 2).map((q, i) => (
              <span key={i} className="qual-tag">{q}</span>
            ))}
          </div>
        )}
      </div>

      <div className="doctor-card__actions">
        <Link to={`/doctors/${doctor._id}`} className="btn-view-profile">View Profile</Link>
        <Link to={`/book/${doctor._id}`} className="btn-book-now">Book Now</Link>
      </div>
    </div>
  );
};

export default DoctorCard;
