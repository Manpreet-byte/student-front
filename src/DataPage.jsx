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

export default function DataPage() {
	const [feedback, setFeedback] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [editForm, setEditForm] = useState({
		studentName: '',
		house: '',
		rating: '',
		comment: ''
	});

	useEffect(() => {
		loadFeedback();
	}, []);

	const loadFeedback = async () => {
		setLoading(true);
		try {
			const res = await fetch(API_URL);
			if (!res.ok) throw new Error('Failed to fetch');
			const data = await res.json();
			setFeedback(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
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
		setEditForm({
			studentName: item.studentName,
			house: item.house,
			rating: item.rating,
			comment: item.comment
		});
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
		setSelectedId(null);
		setEditForm({ studentName: '', house: '', rating: '', comment: '' });
	};

	const handleRowClick = (id) => {
		if (editingId !== id) {
			setSelectedId(selectedId === id ? null : id);
		}
	};

	const calculateStats = () => {
		if (feedback.length === 0) return { total: 0, avgRating: 0, houseCounts: {} };

		const total = feedback.length;
		const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1);
		const houseCounts = feedback.reduce((acc, f) => {
			acc[f.house] = (acc[f.house] || 0) + 1;
			return acc;
		}, {});

		return { total, avgRating, houseCounts };
	};

	if (loading) return <div className="page-container"><div className="card">Loading...</div></div>;
	if (error) return <div className="page-container"><div className="card">Error: {error}</div></div>;

	const stats = calculateStats();

	return (
		<div className="page-container">
			<h2 className="page-title">All Feedback Data</h2>
			<p className="page-subtitle">View, edit, and manage all student feedback</p>

			{/* Statistics Section */}
			<div className="stats-section">
				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-value">{stats.total}</div>
						<div className="stat-label">Total Submissions</div>
					</div>
					<div className="stat-card secondary">
						<div className="stat-value">{stats.avgRating}</div>
						<div className="stat-label">Average Rating</div>
					</div>
					<div className="stat-card tertiary">
						<div className="stat-value">{Object.keys(stats.houseCounts).length}</div>
						<div className="stat-label">Houses Represented</div>
					</div>
				</div>

				<div className="house-stats-grid">
					{Object.entries(stats.houseCounts).map(([house, count]) => (
						<div key={house} className="house-stat-card">
							<h4>{house}</h4>
							<div className="count">{count}</div>
						</div>
					))}
				</div>
			</div>

			{/* Data Table */}
			<div className="table-container">
				{feedback.length === 0 ? (
					<div className="no-data">
						<div className="no-data-icon">📋</div>
						<div className="no-data-text">No feedback data available</div>
					</div>
				) : (
					<table className="feedback-table">
						<thead>
							<tr>
								<th>Student Name</th>
								<th>House</th>
								<th>Rating</th>
								<th>Comment</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{feedback.map(item => (
								<tr 
									key={item._id}
									onClick={() => handleRowClick(item._id)}
									style={{
										cursor: editingId === item._id ? 'default' : 'pointer',
										background: selectedId === item._id && editingId !== item._id ? '#f8fafc' : 'transparent'
									}}
								>
									{editingId === item._id ? (
										<>
											<td>
												<input
													type="text"
													value={editForm.studentName}
													onChange={e => setEditForm({...editForm, studentName: e.target.value})}
													style={{width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '6px'}}
												/>
											</td>
											<td>
												<select
													value={editForm.house}
													onChange={e => setEditForm({...editForm, house: e.target.value})}
													style={{width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '6px'}}
												>
													<option value="Bhairav">Bhairav</option>
													<option value="Bhageshree">Bhageshree</option>
													<option value="Megh">Megh</option>
												</select>
											</td>
											<td>
												<select
													value={editForm.rating}
													onChange={e => setEditForm({...editForm, rating: parseInt(e.target.value)})}
													style={{width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '6px'}}
												>
													<option value="1">1</option>
													<option value="2">2</option>
													<option value="3">3</option>
													<option value="4">4</option>
													<option value="5">5</option>
												</select>
											</td>
											<td>
												<textarea
													value={editForm.comment}
													onChange={e => setEditForm({...editForm, comment: e.target.value})}
													style={{width: '100%', padding: '6px', minHeight: '60px', border: '1px solid #e5e7eb', borderRadius: '6px'}}
												/>
											</td>
											<td className="small muted">{formatDate(item.timestamp)}</td>
											<td>
												<button 
													className="btn btn-primary" 
													onClick={(e) => {
														e.stopPropagation();
														handleUpdate(item._id);
													}}
													style={{marginRight: '8px', padding: '6px 12px', fontSize: '0.85rem'}}
												>
													💾 Save
												</button>
												<button 
													className="btn" 
													onClick={(e) => {
														e.stopPropagation();
														handleCancelEdit();
													}}
													style={{padding: '6px 12px', fontSize: '0.85rem', background: '#6b7280', color: 'white'}}
												>
													Cancel
												</button>
											</td>
										</>
									) : (
										<>
											<td style={{fontWeight: 600}}>{item.studentName}</td>
											<td>
												<span className={`house-badge ${item.house?.toLowerCase()}`}>
													{item.house || 'N/A'}
												</span>
											</td>
											<td>
												<span className="rating-badge">
													{renderStars(item.rating)}
												</span>
											</td>
											<td style={{maxWidth: '300px'}}>{item.comment || <span className="muted">No comment</span>}</td>
											<td className="small muted">{formatDate(item.timestamp)}</td>
											<td>
												{selectedId === item._id && (
													<>
														<button 
															className="btn btn-primary" 
															onClick={(e) => {
																e.stopPropagation();
																handleEdit(item);
															}}
															style={{marginRight: '8px', padding: '6px 12px', fontSize: '0.85rem'}}
														>
															✏️ Edit
														</button>
														<button 
															className="btn" 
															onClick={(e) => {
																e.stopPropagation();
																handleDelete(item._id);
															}}
															style={{padding: '6px 12px', fontSize: '0.85rem', background: '#dc2626', color: 'white'}}
														>
															🗑️ Delete
														</button>
													</>
												)}
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
