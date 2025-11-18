import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI } from '../services/api';

const AssignTeamTask = () => {
	const { teamId } = useParams();
	const navigate = useNavigate();
	const [taskId, setTaskId] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			await teamsAPI.assignTask({ teamId: parseInt(teamId, 10), taskId: parseInt(taskId, 10) });
			navigate(`/teams/${teamId}`);
		} catch (err) {
			setError(err.response?.data || 'Failed to assign task');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">Assign Task to Team</h2>
			<form onSubmit={handleSubmit} className="space-y-4 max-w-md">
				{error && <div className="text-red-600">{error}</div>}
				<div>
					<label className="block text-sm font-medium text-gray-700">Task ID</label>
					<input value={taskId} onChange={(e) => setTaskId(e.target.value)} className="input-field" required />
				</div>
				<div className="flex space-x-2">
					<button disabled={loading} className="btn-primary">{loading ? 'Assigning...' : 'Assign'}</button>
					<button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
				</div>
			</form>
		</div>
	);
};

export default AssignTeamTask;

