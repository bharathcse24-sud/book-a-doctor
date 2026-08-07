import React, { useState, useEffect } from 'react';
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard';
import { getMyAppointments, cancelAppointment } from '../../services/api';
import './MyAppointments.css';

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? appointments.length : appointments.filter((a) => a.status === f).length;
    return acc;
  }, {});

  return (
    <div className="my-appts-page page-content">
      <div className="container">
        <div className="my-appts-header">
          <h1>My Appointments</h1>
          <p className="my-appts-subtitle">{appointments.length} total appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="appt-filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`appt-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {counts[f] > 0 && <span className="filter-count">{counts[f]}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <h3>No {filter !== 'all' ? filter : ''} Appointments</h3>
            <p>You have no {filter !== 'all' ? filter : ''} appointments yet.</p>
          </div>
        ) : (
          <div className="appts-grid">
            {filtered.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
