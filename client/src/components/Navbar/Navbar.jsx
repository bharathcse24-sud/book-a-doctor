import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🩺</span>
          <span className="logo-text">Book<span>A</span>Doctor</span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/doctors" className={isActive('/doctors') ? 'active' : ''}>Find Doctors</Link></li>
          {user && (
            <li>
              <Link to="/my-appointments" className={isActive('/my-appointments') ? 'active' : ''}>
                My Appointments
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li><Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link></li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-nav-login">Login</Link>
              <Link to="/register" className="btn-nav-register">Get Started</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/doctors">Find Doctors</Link>
        {user && <Link to="/my-appointments">My Appointments</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
        <div className="mobile-auth">
          {user ? (
            <button onClick={handleLogout} className="btn-mobile-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn-mobile-login">Login</Link>
              <Link to="/register" className="btn-mobile-register">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
