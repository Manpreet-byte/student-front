import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Student Feedback Portal</h1>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/students" className={`nav-link ${isActive('/students') ? 'active' : ''}`}>
            Students
          </Link>
          <Link to="/filter" className={`nav-link ${isActive('/filter') ? 'active' : ''}`}>
            Filter
          </Link>
          <Link to="/improvements" className={`nav-link ${isActive('/improvements') ? 'active' : ''}`}>
            Improvements
          </Link>
        </div>
      </div>
    </nav>
  );
}
