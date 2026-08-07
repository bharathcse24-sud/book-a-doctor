import React, { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getUsers,
  getAdminAppointments,
  updateAppointmentStatus,
  deleteUser,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './AdminDashboard.css';

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <span className="stat-card-value">{value ?? '—'}</span>
      <span className="stat-card-label">{label}</span>
      {sub && <span className="stat-card-sub">{sub}</span>}
    </div>
  </div>
);

/* ─── Status Badge ───────────────────────────────────────── */
const StatusBadge = ({ status }) => (
  <span className={`badge-status badge-${status}`}>
    {status === 'pending' && '🕐 '}
    {status === 'confirmed' && '✅ '}
    {status === 'completed' && '🏁 '}
    {status === 'cancelled' && '❌ '}
    {status}
  </span>
);

/* ─── Confirm Modal ──────────────────────────────────────── */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="modal-icon">⚠️</div>
      <p className="modal-msg">{message}</p>
      <div className="modal-actions">
        <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-modal-confirm" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>
);

/* ─── Toast Notification ─────────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
      <span>{type === 'success' ? '✅' : '❌'} {message}</span>
      <button onClick={onClose} className="toast-close">✕</button>
    </div>
  );
};

/* ─── Status Action Buttons ──────────────────────────────── */
const statusActions = {
  pending: [
    { label: 'Confirm', next: 'confirmed', cls: 'btn-action-confirm' },
    { label: 'Cancel', next: 'cancelled', cls: 'btn-action-cancel' },
  ],
  confirmed: [
    { label: 'Complete', next: 'completed', cls: 'btn-action-complete' },
    { label: 'Cancel', next: 'cancelled', cls: 'btn-action-cancel' },
  ],
  completed: [],
  cancelled: [
    { label: 'Restore', next: 'pending', cls: 'btn-action-restore' },
  ],
};

/* ═══ MAIN COMPONENT ═══════════════════════════════════════ */
const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  /* ── Fetch Data ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, apptsRes] = await Promise.all([
        getDashboardStats(),
        getUsers(),
        getAdminAppointments(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAppointments(apptsRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Refetch appointments (with filters) ── */
  const fetchAppointments = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await getAdminAppointments(params);
      setAppointments(res.data);
    } catch (err) {
      showToast('Failed to refresh appointments', 'error');
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    if (activeTab === 'appointments') fetchAppointments();
  }, [statusFilter, searchQuery, activeTab, fetchAppointments]);

  /* ── Update Appointment Status ── */
  const handleStatusChange = (appointmentId, newStatus, appointmentInfo) => {
    setConfirmModal({
      message: `Change appointment status to "${newStatus}" for ${appointmentInfo}?`,
      onConfirm: async () => {
        setConfirmModal(null);
        setUpdatingId(appointmentId);
        try {
          const res = await updateAppointmentStatus(appointmentId, { status: newStatus });
          setAppointments((prev) =>
            prev.map((a) => (a._id === appointmentId ? res.data : a))
          );
          // Update stats
          const statsRes = await getDashboardStats();
          setStats(statsRes.data);
          showToast(`Appointment ${newStatus} successfully!`);
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to update status', 'error');
        } finally {
          setUpdatingId(null);
        }
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  /* ── Delete User ── */
  const handleDeleteUser = (userId, userName) => {
    setConfirmModal({
      message: `Delete user "${userName}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await deleteUser(userId);
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          showToast(`User "${userName}" deleted successfully!`);
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to delete user', 'error');
        }
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  /* ── Filter appointments locally for overview tab ── */
  const filteredAppointments = appointments.filter((a) => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.patient?.name?.toLowerCase().includes(q) ||
      a.patient?.email?.toLowerCase().includes(q) ||
      a.doctor?.name?.toLowerCase().includes(q) ||
      a.doctor?.specialty?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading)
    return (
      <div className="spinner-container" style={{ paddingTop: '140px' }}>
        <div className="spinner" />
        <p style={{ color: '#64748b', marginTop: 16, fontSize: '0.95rem' }}>Loading dashboard…</p>
      </div>
    );

  const tabs = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'users', icon: '👥', label: 'Users' },
  ];

  return (
    <div className="admin-page page-content">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
        />
      )}

      <div className="container">
        {/* ── Header ── */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage appointments, users, and platform analytics
            </p>
          </div>
          <div className="admin-header-right">
            <div className="admin-badge">🛡️ Administrator</div>
            <button className="btn-logout" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <div className="admin-stats-grid">
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="blue" />
            <StatCard icon="🩺" label="Doctors" value={stats.totalDoctors} color="green" />
            <StatCard icon="📅" label="Total Appointments" value={stats.totalAppointments} color="purple" />
            <StatCard icon="🕐" label="Pending" value={stats.pendingAppointments} color="orange" sub="Awaiting confirmation" />
            <StatCard icon="✅" label="Confirmed" value={stats.confirmedAppointments} color="teal" />
            <StatCard icon="🏁" label="Completed" value={stats.completedAppointments} color="indigo" />
            <StatCard icon="❌" label="Cancelled" value={stats.cancelledAppointments} color="red" />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="admin-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <button className="admin-refresh-btn" onClick={fetchAll} title="Refresh data">
            🔄 Refresh
          </button>
        </div>

        {/* ── Tab Content ── */}
        <div className="admin-tab-content animate-fadeIn">
          {/* ════ OVERVIEW TAB ════ */}
          {activeTab === 'overview' && (
            <div className="admin-overview">
              {/* Quick stats row */}
              <div className="overview-quick-stats">
                <div className="quick-stat-item">
                  <span className="qs-dot qs-pending"></span>
                  <span>{stats?.pendingAppointments} Pending</span>
                </div>
                <div className="quick-stat-item">
                  <span className="qs-dot qs-confirmed"></span>
                  <span>{stats?.confirmedAppointments} Confirmed</span>
                </div>
                <div className="quick-stat-item">
                  <span className="qs-dot qs-completed"></span>
                  <span>{stats?.completedAppointments} Completed</span>
                </div>
                <div className="quick-stat-item">
                  <span className="qs-dot qs-cancelled"></span>
                  <span>{stats?.cancelledAppointments} Cancelled</span>
                </div>
              </div>

              <div className="overview-section">
                <div className="section-header-row">
                  <h3>Recent Appointments</h3>
                  <button
                    className="btn-view-all"
                    onClick={() => setActiveTab('appointments')}
                  >
                    View All →
                  </button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Specialty</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 6).map((a) => (
                        <tr key={a._id} className={updatingId === a._id ? 'row-updating' : ''}>
                          <td>
                            <div className="table-user">
                              <div className="table-avatar">{a.patient?.name?.charAt(0) || '?'}</div>
                              <div>
                                <div className="table-name">{a.patient?.name || '—'}</div>
                                <div className="table-email">{a.patient?.email || ''}</div>
                              </div>
                            </div>
                          </td>
                          <td>Dr. {a.doctor?.name || '—'}</td>
                          <td>{a.doctor?.specialty || '—'}</td>
                          <td>
                            <div>{new Date(a.date).toLocaleDateString('en-IN')}</div>
                            <div className="table-time">{a.time}</div>
                          </td>
                          <td><StatusBadge status={a.status} /></td>
                          <td>
                            <div className="action-btns">
                              {(statusActions[a.status] || []).map((act) => (
                                <button
                                  key={act.next}
                                  className={`btn-action ${act.cls}`}
                                  disabled={updatingId === a._id}
                                  onClick={() =>
                                    handleStatusChange(
                                      a._id,
                                      act.next,
                                      `${a.patient?.name || 'patient'}`
                                    )
                                  }
                                >
                                  {act.label}
                                </button>
                              ))}
                              {(statusActions[a.status] || []).length === 0 && (
                                <span className="no-actions">—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {appointments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="empty-row">No appointments found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ APPOINTMENTS TAB ════ */}
          {activeTab === 'appointments' && (
            <div>
              {/* Filter Bar */}
              <div className="filter-bar">
                <div className="filter-search">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by patient, doctor, or specialty…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>
                <div className="filter-status-group">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      className={`filter-chip filter-chip--${s} ${statusFilter === s ? 'active' : ''}`}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="results-count">
                Showing <strong>{filteredAppointments.length}</strong> appointment{filteredAppointments.length !== 1 ? 's' : ''}
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Date & Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((a, i) => (
                      <tr key={a._id} className={updatingId === a._id ? 'row-updating' : ''}>
                        <td className="row-num">{i + 1}</td>
                        <td>
                          <div className="table-user">
                            <div className="table-avatar">{a.patient?.name?.charAt(0) || '?'}</div>
                            <div>
                              <div className="table-name">{a.patient?.name || '—'}</div>
                              <div className="table-email">{a.patient?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-name">Dr. {a.doctor?.name || '—'}</div>
                        </td>
                        <td>{a.doctor?.specialty || '—'}</td>
                        <td>
                          <div className="table-date">{new Date(a.date).toLocaleDateString('en-IN')}</div>
                          <div className="table-time">{a.time}</div>
                        </td>
                        <td className="reason-cell">{a.reason || '—'}</td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>
                          <div className="action-btns">
                            {(statusActions[a.status] || []).map((act) => (
                              <button
                                key={act.next}
                                className={`btn-action ${act.cls}`}
                                disabled={updatingId === a._id}
                                onClick={() =>
                                  handleStatusChange(
                                    a._id,
                                    act.next,
                                    `${a.patient?.name || 'patient'}`
                                  )
                                }
                              >
                                {updatingId === a._id ? '…' : act.label}
                              </button>
                            ))}
                            {(statusActions[a.status] || []).length === 0 && (
                              <span className="no-actions">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={8} className="empty-row">
                          <div className="empty-state">
                            <span>📭</span>
                            <p>No appointments match your filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ USERS TAB ════ */}
          {activeTab === 'users' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td className="row-num">{i + 1}</td>
                      <td>
                        <div className="table-user">
                          <div className={`table-avatar ${u.role === 'admin' ? 'avatar-admin' : ''}`}>
                            {u.name?.charAt(0) || '?'}
                          </div>
                          <div className="table-name">{u.name}</div>
                        </div>
                      </td>
                      <td className="table-email-col">{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-patient'}`}>
                          {u.role === 'admin' ? '🛡️ admin' : '🧑 patient'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        {u.role !== 'admin' ? (
                          <button
                            className="btn-action btn-action-cancel"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                          >
                            🗑 Delete
                          </button>
                        ) : (
                          <span className="no-actions">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-row">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
