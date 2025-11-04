import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api/feedback';

// Utilities
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`stars`} aria-hidden>{i <= rating ? '★' : '☆'}</span>
    );
  }
  return <span>{stars}</span>;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Subcomponents
const FeedbackCard = ({ feedback }) => (
  <div className="card">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
      <div style={{fontWeight:700, color:'#4f46e5'}}>{feedback.studentName || 'Anonymous'}</div>
      <div aria-label={`Rating: ${feedback.rating} out of 5`}>{renderStars(feedback.rating)}</div>
    </div>
    <div className="small muted">{formatDate(feedback.timestamp)}</div>
    <p style={{marginTop:10}}>{feedback.comment || <span className="muted">No comment provided.</span>}</p>
  </div>
);

const FeedbackForm = ({ fetchFeedback }) => {
  const [formData, setFormData] = useState({ studentName: '', rating: '5', comment: '' });
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

    const dataToSend = { ...formData, rating: parseInt(formData.rating, 10) };
    try {
      const response = await fetch(API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend)
      });
      const result = await response.json();
      if (response.ok) {
        displayStatus('Success! Feedback saved.', 'success');
        setFormData({ studentName: '', rating: '5', comment: '' });
        fetchFeedback();
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
    <div className="card form" style={{position:'sticky', top:20}}>
      <h2 style={{marginTop:0}}>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:12}}>
          <label className="label">Your Name</label>
          <input name="studentName" value={formData.studentName} onChange={handleChange} required />
        </div>
        <div style={{marginBottom:12}}>
          <label className="label">Rating</label>
          <select name="rating" value={formData.rating} onChange={handleChange}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>
        </div>
        <div style={{marginBottom:12}}>
          <label className="label">Comment</label>
          <textarea name="comment" value={formData.comment} onChange={handleChange} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Submit Feedback'}</button>
        {status.message && (
          <div className={`status ${status.type === 'success' ? 'success' : 'error'}`} style={{marginTop:12}}>{status.message}</div>
        )}
      </form>
    </div>
  );
};

const App = () => {
  const [feedback, setFeedback] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);

  const fetchFeedback = useCallback(async () => {
    setIsLoadingList(true); setErrorList(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); setFeedback(data);
    } catch (err) {
      console.error(err); setErrorList('Could not connect to the backend server.');
    } finally { setIsLoadingList(false); }
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  let feedbackContent;
  if (isLoadingList) feedbackContent = <div className="card">Loading...</div>;
  else if (errorList) feedbackContent = <div className="card">{errorList}</div>;
  else if (feedback.length === 0) feedbackContent = <div className="card">No feedback yet</div>;
  else feedbackContent = (
    <div className="cards">
      {feedback.map(item => <FeedbackCard key={item._id} feedback={item} />)}
    </div>
  );

  return (
    <div>
      <div className="max-w-app">
        <div className="site-header">
          <h1 className="site-title">Student Feedback Portal</h1>
          <nav className="site-nav"><Link to="/all-feedback">All Feedback</Link></nav>
        </div>

        <div className="grid">
          <FeedbackForm fetchFeedback={fetchFeedback} />
          <div>
            <h2>Recent Feedback</h2>
            {feedbackContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
