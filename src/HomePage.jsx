import React, { useState } from 'react';

const API_URL = '/api/feedback';

export default function HomePage() {
  const [formData, setFormData] = useState({ 
    studentName: '', 
    house: 'Bhairav', 
    rating: '5', 
    comment: '' 
  });
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const displayStatus = (message, type) => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    const dataToSend = { 
      ...formData, 
      rating: parseInt(formData.rating, 10) 
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(dataToSend)
      });
      const result = await response.json();
      
      if (response.ok) {
        displayStatus('Success! Reflection saved.', 'success');
        setFormData({ studentName: '', house: 'Bhairav', rating: '5', comment: '' });
      } else {
        displayStatus(result.message || 'Server error', 'error');
      }
    } catch (err) {
      displayStatus('Connection failed. Is the backend running?', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Welcome to</div>
          <h1 className="hero-title">
            Students Reflection Tracking
          </h1>
          <p className="hero-description">
            A comprehensive platform to track, manage, and analyze student feedback and reflections.
            Monitor progress, celebrate achievements, and foster growth across all houses.
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Real-time Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏛️</span>
              <span className="feature-text">House Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span className="feature-text">Performance Tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span className="feature-text">Detailed Feedback</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="quick-stats-section">
        <div className="quick-stat-card bhairav-card">
          <div className="quick-stat-icon">🏛️</div>
          <div className="quick-stat-label">Bhairav</div>
          <div className="quick-stat-desc">Excellence & Leadership</div>
        </div>
        <div className="quick-stat-card bhageshree-card">
          <div className="quick-stat-icon">🏛️</div>
          <div className="quick-stat-label">Bhageshree</div>
          <div className="quick-stat-desc">Innovation & Creativity</div>
        </div>
        <div className="quick-stat-card megh-card">
          <div className="quick-stat-icon">🏛️</div>
          <div className="quick-stat-label">Megh</div>
          <div className="quick-stat-desc">Wisdom & Knowledge</div>
        </div>
      </div>

      {/* Quick Action Section */}
      <div className="quick-action-section">
        <h2 className="section-title">Quick Submit Feedback</h2>
        <p className="section-subtitle">Add a new student reflection quickly and easily</p>
        
        <div className="form-wrapper home-form">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">Student Name</label>
              <input
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student name..."
                required
              />
            </div>

            <div className="form-group">
              <label className="label">House</label>
              <select name="house" value={formData.house} onChange={handleChange} required>
                <option value="Bhairav">🏛️ Bhairav</option>
                <option value="Bhageshree">🏛️ Bhageshree</option>
                <option value="Megh">🏛️ Megh</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Rating</label>
              <select name="rating" value={formData.rating} onChange={handleChange}>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Needs Improvement</option>
                <option value="1">⭐ Requires Attention</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Reflection Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Enter detailed feedback or reflection..."
                required
                style={{ minHeight: '120px' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary submit-btn" disabled={isLoading}>
                <span style={{ fontSize: '1.2rem', marginRight: 8 }}>✨</span>
                {isLoading ? 'Submitting...' : 'Submit Reflection'}
              </button>
            </div>

            {status.message && (
              <div className={`status ${status.type === 'success' ? 'success' : 'error'}`} style={{ gridColumn: '1 / -1' }}>
                {status.type === 'success' ? '✅' : '❌'} {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
