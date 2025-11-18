import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI } from '../services/api';

const TeamDetails = () => {
	const { teamId } = useParams();
	const navigate = useNavigate();
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [memberEmail, setMemberEmail] = useState('');
	const [addingMember, setAddingMember] = useState(false);

	const userId = parseInt(localStorage.getItem('userId') || '0', 10);

	useEffect(() => {
		if (!teamId) return;
		loadMembers();
	}, [teamId]);

	const loadMembers = async () => {
		setLoading(true);
		try {
			const res = await teamsAPI.listMembers(teamId);
			setMembers(res.data || []);
			setError('');
		} catch (err) {
			setError(err.response?.data || 'Failed to load members');
		} finally {
			setLoading(false);
		}
	};

	const handleAddMember = async (e) => {
		e.preventDefault();
		if (!memberEmail.trim()) {
			setError('Email is required');
			return;
		}
		setAddingMember(true);
		setError('');
		try {
			await teamsAPI.addMember({
				teamId: parseInt(teamId, 10),
				memberEmail: memberEmail.trim(),
				actingUserId: userId,
			});
			setMemberEmail('');
			await loadMembers();
		} catch (err) {
			setError(err.response?.data || 'Failed to add member');
		} finally {
			setAddingMember(false);
		}
	};

	const handleRemoveMember = async (memberEmail) => {
		if (!window.confirm(`Remove ${memberEmail} from the team?`)) return;
		try {
			await teamsAPI.removeMember({
				teamId: parseInt(teamId, 10),
				memberEmail: memberEmail,
				actingUserId: userId,
			});
			await loadMembers();
		} catch (err) {
			setError(err.response?.data || 'Failed to remove member');
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Team Details</h2>
				<div className="flex gap-2">
					<button
						onClick={() => navigate(`/teams/${teamId}/tasks`)}
						className="btn-secondary"
					>
						Track Tasks
					</button>
					<button
						onClick={() => navigate(`/teams/${teamId}/assign-task`)}
						className="btn-primary"
					>
						Assign Task
					</button>
				</div>
			</div>

			{/* Add Member Form */}
			<form onSubmit={handleAddMember} className="bg-white p-4 rounded-lg shadow flex items-end space-x-4">
				<div className="flex-1">
					<label className="block text-sm font-medium text-gray-700 mb-1">Member Email</label>
					<input
						type="email"
						value={memberEmail}
						onChange={(e) => setMemberEmail(e.target.value)}
						className="input"
						placeholder="Enter member email"
						required
					/>
				</div>
				<button type="submit" disabled={addingMember} className="btn-primary">
					{addingMember ? 'Adding...' : 'Add Member'}
				</button>
			</form>

			{error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}

			{loading ? (
				<div>Loading members...</div>
			) : (
				<div className="grid grid-cols-1 gap-2">
					{members.length === 0 ? (
						<div className="text-gray-600">No members in this team.</div>
					) : (
						members.map((m) => (
							<div key={m.userId} className="p-3 bg-white rounded shadow flex items-center justify-between">
								<div>
									<div className="font-medium">{m.name || m.email}</div>
									<div className="text-sm text-gray-500">{m.email}</div>
								</div>
								<button
									onClick={() => handleRemoveMember(m.email)}
									className="btn-secondary text-sm"
								>
									Remove
								</button>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default TeamDetails;
