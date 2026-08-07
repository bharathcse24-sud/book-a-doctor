import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <div className="notfound-page">
    <div className="notfound-content animate-fadeInUp">
      <div className="notfound-code">404</div>
      <div className="notfound-icon">🏥</div>
      <h1>Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist or may have been moved.</p>
      <div className="notfound-actions">
        <Link to="/" className="btn btn-primary btn-lg">🏠 Go Home</Link>
        <Link to="/doctors" className="btn btn-secondary btn-lg">Find a Doctor</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
