import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: 'admin@gmail.com', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect
  if (user?.role === 'admin') {
    navigate('/admin');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      if (data.role !== 'admin') {
        setError('Access denied. This portal is for administrators only.');
        setLoading(false);
        return;
      }
      login(data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left panel */}
      <div className="admin-login-visual">
        <div className="admin-login-visual-content">
          <div className="admin-login-shield">🛡️</div>
          <h2>Admin Portal</h2>
          <p>Secure access to the Book-A-Doctor administration panel.</p>
          <div className="admin-login-features">
            <div className="admin-login-feature">
              <span className="feature-icon">📅</span>
              <span>Manage all patient appointments</span>
            </div>
            <div className="admin-login-feature">
              <span className="feature-icon">👥</span>
              <span>View and manage user accounts</span>
            </div>
            <div className="admin-login-feature">
              <span className="feature-icon">📊</span>
              <span>Real-time dashboard analytics</span>
            </div>
            <div className="admin-login-feature">
              <span className="feature-icon">✅</span>
              <span>Confirm, complete, or cancel appointments</span>
            </div>
          </div>
        </div>
        <div className="admin-login-visual-dots" />
      </div>

      {/* Right form panel */}
      <div className="admin-login-form-side">
        <div className="admin-login-form-wrapper animate-fadeInUp">
          {/* Branding */}
          <div className="admin-login-brand">
            <div className="admin-login-logo">🩺</div>
            <span>Book-A-Doctor</span>
          </div>

          <div className="admin-login-header">
            <div className="admin-login-title-row">
              <div className="admin-login-shield-sm">🛡️</div>
              <h1>Admin Sign In</h1>
            </div>
            <p>Enter your administrator credentials to continue</p>
          </div>

          {error && (
            <div className="admin-alert-error">
              <span>⛔</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="admin-email">Admin Email</label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">📧</span>
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="admin@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">🔐</span>
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Credentials hint */}
            <div className="admin-creds-hint">
              <span>💡</span>
              <span>
                Use <strong>admin@gmail.com</strong> / <strong>admin123</strong>
              </span>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading"><span className="btn-spinner" /> Authenticating…</span>
              ) : (
                <>🛡️ Access Admin Panel</>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/login" className="back-to-user-login">
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
