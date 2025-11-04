import React, { useEffect, useState } from 'react';

const API_URL = '/api/feedback';

const renderStars = (rating) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(
			<span key={i} className="stars" aria-hidden>{i <= rating ? '★' : '☆'}</span>
		);
	}
	return <span>{stars}</span>;
};

const formatDate = (dateString) => {
	if (!dateString) return 'N/A';
	const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function FilterPage() {
	const [feedback, setFeedback] = useState([]);
	const [filteredFeedback, setFilteredFeedback] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [selectedFeedbackId, setSelectedFeedbackId] = useState(null); // For click-to-reveal
	const [editForm, setEditForm] = useState({
		studentName: '',
		house: '',
		rating: '',
		comment: ''
	});
	
	// Get today's date in YYYY-MM-DD format
	const getTodayDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};
	
	const [filters, setFilters] = useState({
		studentName: '',
		house: '',
		rating: '',
		startDate: getTodayDate(), // Set to today's date
		endDate: getTodayDate()    // Set to today's date
	});

	useEffect(() => {
		loadFeedback();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [filters, feedback]);

	const loadFeedback = async () => {
		setLoading(true);
		try {
			const res = await fetch(API_URL);
			if (!res.ok) throw new Error('Failed to fetch');
			const data = await res.json();
			setFeedback(data);
			setFilteredFeedback(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...feedback];

		// Filter by student name
		if (filters.studentName) {
			filtered = filtered.filter(f => 
				f.studentName.toLowerCase().includes(filters.studentName.toLowerCase())
			);
		}

		// Filter by house
		if (filters.house) {
			filtered = filtered.filter(f => f.house === filters.house);
		}

		// Filter by rating
		if (filters.rating) {
			filtered = filtered.filter(f => f.rating === parseInt(filters.rating));
		}

		// Filter by date range
		if (filters.startDate) {
			filtered = filtered.filter(f => new Date(f.timestamp) >= new Date(filters.startDate));
		}
		if (filters.endDate) {
			const endDate = new Date(filters.endDate);
			endDate.setHours(23, 59, 59, 999);
			filtered = filtered.filter(f => new Date(f.timestamp) <= endDate);
		}

		setFilteredFeedback(filtered);
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
	};

	const clearFilters = () => {
		const today = getTodayDate();
		setFilters({ studentName: '', house: '', rating: '', startDate: today, endDate: today });
	};

	const handleDelete = async (id) => {
		if (!confirm('Are you sure you want to delete this feedback?')) return;
		
		try {
			const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete');
			setFeedback(feedback.filter(f => f._id !== id));
		} catch (err) {
			alert('Error deleting feedback: ' + err.message);
		}
	};

	const handleEdit = (item) => {
		setEditingId(item._id);
		setSelectedFeedbackId(null); // Hide action buttons when editing
		setEditForm({
			studentName: item.studentName,
			house: item.house,
			rating: item.rating,
			comment: item.comment
		});
	};

	const handleFeedbackClick = (feedbackId) => {
		// Toggle selection - if already selected, deselect it
		if (selectedFeedbackId === feedbackId) {
			setSelectedFeedbackId(null);
		} else {
			setSelectedFeedbackId(feedbackId);
		}
	};

	const handleUpdate = async (id) => {
		try {
			const res = await fetch(`${API_URL}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editForm)
			});
			if (!res.ok) throw new Error('Failed to update');
			const updated = await res.json();
			setFeedback(feedback.map(f => f._id === id ? updated : f));
			setEditingId(null);
		} catch (err) {
			alert('Error updating feedback: ' + err.message);
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setSelectedFeedbackId(null);
		setEditForm({ studentName: '', house: '', rating: '', comment: '' });
	};

	if (loading) return <div className="page-container"><div className="card">Loading...</div></div>;
	if (error) return <div className="page-container"><div className="card">Error: {error}</div></div>;

	return (
		<div className="page-container">
			<h2 className="page-title">Filter Feedback</h2>
			<p className="page-subtitle">Search and filter student feedback by various criteria</p>
			
			<div className="filter-section">
				<div className="filter-grid">
					<div className="form-group">
						<label className="label">Student Name</label>
						<input
							type="text"
							name="studentName"
							placeholder="Search by name..."
							value={filters.studentName}
							onChange={handleFilterChange}
						/>
					</div>

					<div className="form-group">
						<label className="label">House</label>
						<select
							name="house"
							value={filters.house}
							onChange={handleFilterChange}
						>
							<option value="">All Houses</option>
							<option value="Bhairav">Bhairav</option>
							<option value="Bhageshree">Bhageshree</option>
							<option value="Megh">Megh</option>
						</select>
					</div>

					<div className="form-group">
						<label className="label">Rating</label>
						<select name="rating" value={filters.rating} onChange={handleFilterChange}>
							<option value="">All Ratings</option>
							<option value="5">5 - Excellent</option>
							<option value="4">4 - Good</option>
							<option value="3">3 - Average</option>
							<option value="2">2 - Poor</option>
							<option value="1">1 - Very Poor</option>
						</select>
					</div>

					<div className="form-group">
						<label className="label">Start Date</label>
						<input 
							type="date" 
							name="startDate" 
							value={filters.startDate} 
							onChange={handleFilterChange}
						/>
					</div>

					<div className="form-group">
						<label className="label">End Date</label>
						<input 
							type="date" 
							name="endDate" 
							value={filters.endDate} 
							onChange={handleFilterChange}
						/>
					</div>
				</div>

				<button className="btn btn-primary" onClick={clearFilters} style={{marginTop: 16}}>
					Clear Filters
				</button>
			</div>

			<div className="results-section">
				<h3 className="results-header">Results ({filteredFeedback.length})</h3>
				<div className="cards">
					{filteredFeedback.length === 0 ? (
						<div className="no-data">
							<div className="no-data-icon">🔍</div>
							<div className="no-data-text">No feedback matches your filters</div>
						</div>
					) : (
						filteredFeedback.map(item => (
							<div key={item._id} className="card">
								{editingId === item._id ? (
									<div className="form-grid">
										<div className="form-group">
											<label className="label">Student Name</label>
											<input
												type="text"
												value={editForm.studentName}
												onChange={e => setEditForm({...editForm, studentName: e.target.value})}
											/>
										</div>
										<div className="form-group">
											<label className="label">House</label>
											<select
												value={editForm.house}
												onChange={e => setEditForm({...editForm, house: e.target.value})}
											>
												<option value="Bhairav">Bhairav</option>
												<option value="Bhageshree">Bhageshree</option>
												<option value="Megh">Megh</option>
											</select>
										</div>
										<div className="form-group">
											<label className="label">Rating</label>
											<select
												value={editForm.rating}
												onChange={e => setEditForm({...editForm, rating: parseInt(e.target.value)})}
											>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
											</select>
										</div>
										<div className="form-group">
											<label className="label">Comment</label>
											<textarea
												value={editForm.comment}
												onChange={e => setEditForm({...editForm, comment: e.target.value})}
												style={{minHeight: '80px'}}
											/>
										</div>
										<div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
											<button 
												className="btn btn-primary" 
												onClick={() => handleUpdate(item._id)}
											>
												💾 Save
											</button>
											<button 
												className="btn" 
												onClick={handleCancelEdit}
												style={{background: '#6b7280', color: 'white'}}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<>
										<div 
											onClick={() => handleFeedbackClick(item._id)}
											style={{cursor: 'pointer'}}
										>
											<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
												<div style={{fontWeight:700, fontSize:'1.1rem'}}>{item.studentName || 'Anonymous'}</div>
												<div className="rating-badge" aria-label={`Rating: ${item.rating} out of 5`}>
													{renderStars(item.rating)}
												</div>
											</div>
											<div style={{marginBottom: 8}}>
												<span className={`house-badge ${item.house?.toLowerCase()}`}>
													{item.house || 'No House'}
												</span>
											</div>
											<div className="small muted" style={{marginBottom: 8}}>
												{formatDate(item.timestamp)}
											</div>
											<p style={{marginTop:10, lineHeight: 1.6}}>
												{item.comment || <span className="muted">No comment provided.</span>}
											</p>
										</div>
										
										{/* Show icons only when this feedback is selected */}
										{selectedFeedbackId === item._id && (
											<div 
												style={{
													display: 'flex', 
													gap: '12px', 
													marginTop: '16px',
													paddingTop: '12px',
													borderTop: '1px solid #e5e7eb',
													justifyContent: 'flex-end'
												}}
											>
												<button 
													onClick={(e) => {
														e.stopPropagation();
														handleEdit(item);
													}}
													className="icon-btn"
													style={{
														background: '#3b82f6',
														color: 'white',
														border: 'none',
														borderRadius: '8px',
														padding: '8px 12px',
														cursor: 'pointer',
														fontSize: '1.2rem',
														transition: 'all 0.2s'
													}}
													title="Edit"
												>
													✏️
												</button>
												<button 
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(item._id);
													}}
													className="icon-btn"
													style={{
														background: '#dc2626',
														color: 'white',
														border: 'none',
														borderRadius: '8px',
														padding: '8px 12px',
														cursor: 'pointer',
														fontSize: '1.2rem',
														transition: 'all 0.2s'
													}}
													title="Delete"
												>
													🗑️
												</button>
											</div>
										)}
									</>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
