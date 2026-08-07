import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import '../Login/Login.css';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      navigate('/doctors');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual register-visual">
        <div className="auth-visual-content">
          <div className="auth-logo">🏥</div>
          <h2>Join BookADoctor</h2>
          <p>Create your free account and get instant access to the best doctors in your area.</p>
          <div className="auth-features">
            <div className="auth-feature">🔒 Secure & Private</div>
            <div className="auth-feature">⚡ Instant Appointments</div>
            <div className="auth-feature">🌟 Free to Join</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrapper animate-fadeInUp">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input id="reg-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button
              type="submit"
              id="register-btn"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-divider"><span>OR</span></div>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign In →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
