import React, { useState, useEffect } from 'react';

const API_URL = '/api/improvements';

export default function ImprovementsPage() {
	const [improvements, setImprovements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingId, setEditingId] = useState(null);
	
	const [formData, setFormData] = useState({
		problem: '',
		solution: '',
		submittedBy: ''
	});

	useEffect(() => {
		loadImprovements();
	}, []);

	const loadImprovements = async () => {
		setLoading(true);
		try {
			const res = await fetch(API_URL);
			if (!res.ok) throw new Error('Failed to fetch improvements');
			const data = await res.json();
			setImprovements(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			
			if (!res.ok) throw new Error('Failed to add improvement');
			
			await loadImprovements();
			setFormData({ problem: '', solution: '', submittedBy: '' });
			setShowAddForm(false);
		} catch (err) {
			alert('Error adding improvement: ' + err.message);
		}
	};

	const handleUpdate = async (id) => {
		try {
			const res = await fetch(`${API_URL}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			
			if (!res.ok) throw new Error('Failed to update improvement');
			
			await loadImprovements();
			setEditingId(null);
			setFormData({ problem: '', solution: '', submittedBy: '' });
		} catch (err) {
			alert('Error updating improvement: ' + err.message);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm('Are you sure you want to delete this improvement?')) return;
		
		try {
			const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete improvement');
			
			await loadImprovements();
		} catch (err) {
			alert('Error deleting improvement: ' + err.message);
		}
	};

	const handleEdit = (item) => {
		setEditingId(item._id);
		setFormData({
			problem: item.problem,
			solution: item.solution,
			submittedBy: item.submittedBy
		});
		setShowAddForm(false);
	};

	const handleCancel = () => {
		setEditingId(null);
		setShowAddForm(false);
		setFormData({ problem: '', solution: '', submittedBy: '' });
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	if (loading) return <div className="page-container"><div className="card">Loading...</div></div>;
	if (error) return <div className="page-container"><div className="card">Error: {error}</div></div>;

	return (
		<div className="page-container">
			<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
					<div>
						<h2 className="page-title">Improvements</h2>
						<p className="page-subtitle">Report problems and propose solutions for continuous improvement</p>
					</div>
					<button 
						className="btn btn-primary"
						onClick={() => setShowAddForm(!showAddForm)}
						style={{ height: 'fit-content' }}
					>
						{showAddForm ? '❌ Cancel' : '➕ Add Improvement'}
					</button>
				</div>

				{/* Add/Edit Form */}
				{(showAddForm || editingId) && (
					<div className="card" style={{ marginBottom: '32px', background: '#f8fafc', border: '2px dashed var(--accent)' }}>
						<h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Improvement' : 'Add New Improvement'}</h3>
						<form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleSubmit}>
							<div className="form-group" style={{ marginBottom: '16px' }}>
								<label className="label">Submitted By *</label>
								<input
									type="text"
									value={formData.submittedBy}
									onChange={e => setFormData({ ...formData, submittedBy: e.target.value })}
									placeholder="Your name..."
									required
								/>
							</div>
							
							<div className="form-group" style={{ marginBottom: '16px' }}>
								<label className="label">Problem Description *</label>
								<textarea
									value={formData.problem}
									onChange={e => setFormData({ ...formData, problem: e.target.value })}
									placeholder="Describe the problem or issue..."
									required
									style={{ minHeight: '120px' }}
								/>
							</div>

							<div className="form-group" style={{ marginBottom: '16px' }}>
								<label className="label">Proposed Solution *</label>
								<textarea
									value={formData.solution}
									onChange={e => setFormData({ ...formData, solution: e.target.value })}
									placeholder="Describe your proposed solution..."
									required
									style={{ minHeight: '120px' }}
								/>
							</div>

							<div style={{ display: 'flex', gap: '10px' }}>
								<button type="submit" className="btn btn-primary">
									💾 {editingId ? 'Update' : 'Submit'}
								</button>
								<button 
									type="button" 
									className="btn" 
									onClick={handleCancel}
									style={{ background: '#6b7280', color: 'white' }}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Statistics */}
				<div className="stats-section" style={{ marginBottom: '32px' }}>
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-value">{improvements.length}</div>
							<div className="stat-label">Total Improvements</div>
						</div>
					</div>
				</div>

				{/* Improvements List */}
				<div className="improvements-container">
					{improvements.length === 0 ? (
						<div className="card" style={{ textAlign: 'center', padding: '40px', background: '#f8fafc' }}>
							<p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
								📝 No improvements submitted yet. Be the first to suggest one!
							</p>
						</div>
					) : (
						improvements.map((item) => (
							<div key={item._id} className="improvement-card card" style={{ marginBottom: '20px' }}>
								{editingId === item._id ? (
									// Already handled in form above
									null
								) : (
									<>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
											<div>
												<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
													<span style={{ 
														background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
														color: 'white',
														padding: '4px 12px',
														borderRadius: '20px',
														fontSize: '0.85rem',
														fontWeight: 600
													}}>
														💡 Improvement
													</span>
													<span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
														by <strong>{item.submittedBy}</strong>
													</span>
												</div>
												<div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
													{formatDate(item.timestamp)}
												</div>
											</div>
											<div style={{ display: 'flex', gap: '8px' }}>
												<button
													onClick={() => handleEdit(item)}
													className="btn"
													style={{ 
														padding: '6px 12px',
														fontSize: '0.9rem',
														background: '#3b82f6',
														color: 'white'
													}}
												>
													✏️ Edit
												</button>
												<button
													onClick={() => handleDelete(item._id)}
													className="btn"
													style={{ 
														padding: '6px 12px',
														fontSize: '0.9rem',
														background: '#ef4444',
														color: 'white'
													}}
												>
													🗑️ Delete
												</button>
											</div>
										</div>

										<div style={{ 
											background: '#fff7ed',
											border: '2px solid #fb923c',
											borderRadius: '12px',
											padding: '16px',
											marginBottom: '16px'
										}}>
											<h4 style={{ 
												margin: '0 0 8px 0',
												color: '#c2410c',
												fontSize: '1rem',
												fontWeight: 700
											}}>
												🚨 Problem
											</h4>
											<p style={{ margin: 0, color: '#0f172a', lineHeight: 1.6 }}>
												{item.problem}
											</p>
										</div>

										<div style={{ 
											background: '#ecfdf5',
											border: '2px solid #34d399',
											borderRadius: '12px',
											padding: '16px'
										}}>
											<h4 style={{ 
												margin: '0 0 8px 0',
												color: '#065f46',
												fontSize: '1rem',
												fontWeight: 700
											}}>
												✅ Solution
											</h4>
											<p style={{ margin: 0, color: '#0f172a', lineHeight: 1.6 }}>
												{item.solution}
											</p>
										</div>
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
