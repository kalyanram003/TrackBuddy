import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI } from '../services/api';

const AssignTeamTask = () => {
	const { teamId } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		description: '',
		dueDate: '',
		priority: 'MID',
		status: 'PENDING',
		scheduledTime: '',
		assigneeEmail: '',
	});
	const [members, setMembers] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingMembers, setLoadingMembers] = useState(true);

	const userId = parseInt(localStorage.getItem('userId') || '0', 10);

	useEffect(() => {
		loadMembers();
	}, [teamId]);

	const loadMembers = async () => {
		try {
			const res = await teamsAPI.listMembers(teamId);
			setMembers(res.data || []);
		} catch (err) {
			setError('Failed to load team members');
		} finally {
			setLoadingMembers(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		if (!formData.assigneeEmail.trim()) {
			setError('Please select a team member');
			setLoading(false);
			return;
		}

		try {
			const taskData = {
				teamId: parseInt(teamId, 10),
				actingUserId: userId,
				assigneeEmail: formData.assigneeEmail.trim(),
				description: formData.description,
				dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
				priority: formData.priority,
				status: formData.status,
				scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString() : null,
			};

			await teamsAPI.assignTask(taskData);
			navigate(`/teams/${teamId}`);
		} catch (err) {
			setError(err.response?.data || 'Failed to assign task');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Assign Task to Team Member</h2>

			{error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}

			<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-2xl">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Assign To (Email) <span className="text-red-500">*</span>
					</label>
					{loadingMembers ? (
						<div>Loading members...</div>
					) : (
						<select
							name="assigneeEmail"
							value={formData.assigneeEmail}
							onChange={handleChange}
							className="input"
							required
						>
							<option value="">Select a team member</option>
							{members.map((member) => (
								<option key={member.userId} value={member.email}>
									{member.name || member.email} ({member.email})
								</option>
							))}
						</select>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Task Description <span className="text-red-500">*</span>
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="input"
						rows="3"
						placeholder="Enter task description"
						required
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
						<input
							type="datetime-local"
							name="dueDate"
							value={formData.dueDate}
							onChange={handleChange}
							className="input"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
						<input
							type="datetime-local"
							name="scheduledTime"
							value={formData.scheduledTime}
							onChange={handleChange}
							className="input"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
						<select
							name="priority"
							value={formData.priority}
							onChange={handleChange}
							className="input"
						>
							<option value="LOW">Low</option>
							<option value="MID">Medium</option>
							<option value="HIGH">High</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="input"
						>
							<option value="PENDING">Pending</option>
							<option value="IN_PROGRESS">In Progress</option>
							<option value="DONE">Done</option>
							<option value="MISSED">Missed</option>
						</select>
					</div>
				</div>

				<div className="flex space-x-2 pt-4">
					<button type="submit" disabled={loading} className="btn-primary">
						{loading ? 'Assigning...' : 'Assign Task'}
					</button>
					<button type="button" onClick={() => navigate(-1)} className="btn-secondary">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default AssignTeamTask;

