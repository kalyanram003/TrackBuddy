import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { teamsAPI } from '../services/api';

const TeamDetails = () => {
	const { teamId } = useParams();
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!teamId) return;
		setLoading(true);
		teamsAPI.listMembers(teamId)
			.then((res) => setMembers(res.data || []))
			.catch((err) => setError(err.response?.data || 'Failed to load members'))
			.finally(() => setLoading(false));
	}, [teamId]);

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold">Team Details</h2>

			{loading ? (
				<div>Loading members...</div>
			) : error ? (
				<div className="text-red-600">{error}</div>
			) : (
				<div className="grid grid-cols-1 gap-2">
					{members.length === 0 ? (
						<div className="text-gray-600">No members in this team.</div>
					) : (
						members.map((m) => (
							<div key={m.userId} className="p-3 bg-white rounded shadow">
								<div className="font-medium">{m.name || m.email}</div>
								<div className="text-sm text-gray-500">{m.email}</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default TeamDetails;
