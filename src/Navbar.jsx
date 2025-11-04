import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
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
        
        {user && (
          <div className="user-menu">
            <button 
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img 
                src={user.picture} 
                alt={user.name}
                className="user-avatar"
              />
              <span className="user-name">{user.name}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item user-info">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <hr />
                <button onClick={logout} className="dropdown-item logout-btn">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
