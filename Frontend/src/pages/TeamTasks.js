import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI } from '../services/api';

const TeamTasks = () => {
	const { teamId } = useParams();
	const navigate = useNavigate();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [filter, setFilter] = useState({
		status: '',
		memberEmail: '',
	});

	const userId = parseInt(localStorage.getItem('userId') || '0', 10);

	useEffect(() => {
		if (!teamId) return;
		loadTasks();
	}, [teamId]);

	const loadTasks = async () => {
		setLoading(true);
		try {
			const res = await teamsAPI.getTeamTasks(teamId, userId);
			setTasks(res.data || []);
			setError('');
		} catch (err) {
			setError(err.response?.data || 'Failed to load team tasks');
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'DONE':
				return 'bg-green-100 text-green-800';
			case 'IN_PROGRESS':
				return 'bg-blue-100 text-blue-800';
			case 'MISSED':
				return 'bg-red-100 text-red-800';
			case 'PENDING':
			default:
				return 'bg-yellow-100 text-yellow-800';
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'HIGH':
				return 'bg-red-100 text-red-800';
			case 'MID':
				return 'bg-orange-100 text-orange-800';
			case 'LOW':
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredTasks = tasks.filter((task) => {
		if (filter.status && task.status !== filter.status) return false;
		if (filter.memberEmail && task.user?.email !== filter.memberEmail) return false;
		return true;
	});

	const uniqueMembers = [...new Set(tasks.map((t) => t.user?.email).filter(Boolean))];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Team Task Tracking</h2>
				<button onClick={() => navigate(`/teams/${teamId}`)} className="btn-secondary">
					Back to Team
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
					<select
						value={filter.status}
						onChange={(e) => setFilter({ ...filter, status: e.target.value })}
						className="input"
					>
						<option value="">All Statuses</option>
						<option value="PENDING">Pending</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="DONE">Done</option>
						<option value="MISSED">Missed</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Filter by Member</label>
					<select
						value={filter.memberEmail}
						onChange={(e) => setFilter({ ...filter, memberEmail: e.target.value })}
						className="input"
					>
						<option value="">All Members</option>
						{uniqueMembers.map((email) => (
							<option key={email} value={email}>
								{email}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-end">
					<button
						onClick={() => setFilter({ status: '', memberEmail: '' })}
						className="btn-secondary"
					>
						Clear Filters
					</button>
				</div>
			</div>

			{error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}

			{loading ? (
				<div>Loading tasks...</div>
			) : filteredTasks.length === 0 ? (
				<div className="text-gray-600 bg-white p-6 rounded-lg shadow text-center">
					No tasks found for this team.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4">
					{filteredTasks.map((task) => (
						<div key={task.taskId} className="bg-white rounded-lg shadow p-4">
							<div className="flex items-start justify-between mb-2">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-800 mb-1">
										{task.description}
									</h3>
									<div className="text-sm text-gray-600 mb-2">
										Assigned to: <span className="font-medium">{task.user?.name || task.user?.email || 'Unknown'}</span>
										<span className="text-gray-400 mx-2">•</span>
										{task.user?.email}
									</div>
								</div>
								<div className="flex gap-2">
									<span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
										{task.status}
									</span>
									{task.priority && (
										<span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
											{task.priority}
										</span>
									)}
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
								{task.dueDate && (
									<div>
										<span className="font-medium">Due Date:</span>{' '}
										{new Date(task.dueDate).toLocaleString()}
									</div>
								)}
								{task.startTime && (
									<div>
										<span className="font-medium">Created:</span>{' '}
										{new Date(task.startTime).toLocaleString()}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Summary */}
			{!loading && tasks.length > 0 && (
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-3">Task Summary</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
							<div className="text-sm text-gray-600">Total Tasks</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-600">
								{tasks.filter((t) => t.status === 'PENDING').length}
							</div>
							<div className="text-sm text-gray-600">Pending</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600">
								{tasks.filter((t) => t.status === 'IN_PROGRESS').length}
							</div>
							<div className="text-sm text-gray-600">In Progress</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600">
								{tasks.filter((t) => t.status === 'DONE').length}
							</div>
							<div className="text-sm text-gray-600">Completed</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TeamTasks;

