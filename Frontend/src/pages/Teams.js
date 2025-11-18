import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamsAPI } from '../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const userId = parseInt(localStorage.getItem('userId') || '0', 10);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await teamsAPI.myTeams(userId);
      setTeams(res.data || []);
    } catch (e) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await teamsAPI.createTeam({ name, ownerUserId: userId });
      setName('');
      await loadTeams();
    } catch (e) {
      setError(e.response?.data || 'Failed to create team');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Teams</h2>
      </div>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Enter new team name"
          />
        </div>
        <button type="submit" className="btn-primary">Create Team</button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => (
            <div key={t.teamId} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{t.name}</h3>
              </div>
              <div className="text-sm text-gray-600 mb-4">Owner ID: {t.owner?.userId || t.ownerUserId}</div>
              <div className="flex space-x-2">
                <Link to={`/teams/${t.teamId}`} className="btn-secondary">Manage Members</Link>
                <Link to={`/teams/${t.teamId}/assign-task`} className="btn-secondary">Assign Task</Link>
              </div>
            </div>
          ))}
          {teams.length === 0 && (
            <div className="text-gray-600">You are not part of any teams yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Teams;


