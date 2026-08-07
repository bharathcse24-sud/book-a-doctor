import React from 'react';
import { Link } from 'react-router-dom';
import './AppointmentCard.css';

const STATUS_ICONS = {
  pending: '🕐', confirmed: '✅', cancelled: '❌', completed: '🏁',
};

const AppointmentCard = ({ appointment, onCancel }) => {
  const { _id, doctor, date, time, status, reason } = appointment;
  const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className={`appt-card appt-card--${status}`}>
      <div className="appt-card__header">
        <div className="appt-doctor-info">
          <div className="appt-avatar">
            {doctor?.avatar
              ? <img src={doctor.avatar} alt={doctor.name} />
              : <div className="appt-avatar-ph">{doctor?.name?.charAt(0)}</div>
            }
          </div>
          <div>
            <h3>Dr. {doctor?.name}</h3>
            <p className="appt-specialty">{doctor?.specialty}</p>
          </div>
        </div>
        <span className={`badge-status badge-${status}`}>
          {STATUS_ICONS[status]} {status}
        </span>
      </div>

      <div className="appt-card__body">
        <div className="appt-detail">
          <span className="appt-detail__icon">📅</span>
          <div>
            <span className="appt-detail__label">Date</span>
            <span className="appt-detail__value">{formattedDate}</span>
          </div>
        </div>
        <div className="appt-detail">
          <span className="appt-detail__icon">⏰</span>
          <div>
            <span className="appt-detail__label">Time</span>
            <span className="appt-detail__value">{time}</span>
          </div>
        </div>
        {reason && (
          <div className="appt-detail">
            <span className="appt-detail__icon">📝</span>
            <div>
              <span className="appt-detail__label">Reason</span>
              <span className="appt-detail__value">{reason}</span>
            </div>
          </div>
        )}
      </div>

      <div className="appt-card__actions">
        <Link to={`/upload-reports/${_id}`} className="btn-upload">📂 Upload Reports</Link>
        {status === 'pending' || status === 'confirmed' ? (
          <button onClick={() => onCancel(_id)} className="btn-cancel-appt">Cancel</button>
        ) : null}
      </div>
    </div>
  );
};

export default AppointmentCard;
