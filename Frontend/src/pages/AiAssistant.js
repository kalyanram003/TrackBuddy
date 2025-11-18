import React, { useState, useEffect } from 'react';
import { aiAPI, taskAPI } from '../services/api';

const AiAssistant = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userTasks, setUserTasks] = useState([]);
  const [userId] = useState(localStorage.getItem('userId') || '1');

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      const response = await taskAPI.getUserTasks(userId);
      setUserTasks(response.data);
    } catch (err) {
      console.error('Error fetching user tasks:', err);
    }
  };

  const getAiAdvice = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await aiAPI.getAdvice(userId);
      setAdvice(response.data);
    } catch (err) {
      setError('Failed to get AI advice. Please try again.');
      console.error('AI advice error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAdvice = (adviceText) => {
    // Split by common AI response patterns
    const parts = adviceText.split(/(sortedTaskIds|reasoning)/i);
    const result = { reasoning: adviceText };
    
    if (parts.length > 1) {
      result.reasoning = parts[parts.length - 1]?.trim() || adviceText;
    }
    
    return result;
  };

  const getTaskStats = () => {
    const total = userTasks.length;
    const pending = userTasks.filter(task => task.status === 'PENDING').length;
    const inProgress = userTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const highPriority = userTasks.filter(task => task.priority === 'HIGH').length;
    
    return { total, pending, inProgress, highPriority };
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-purple-100">
          Get intelligent suggestions for your task prioritization and productivity.
        </p>
      </div>

      {/* Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* AI Advice Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Get AI Recommendations</h2>
          <button
            onClick={getAiAdvice}
            disabled={loading || userTasks.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Getting Advice...' : 'Get AI Advice'}
          </button>
        </div>

        {userTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-4">No tasks available for AI analysis</p>
            <p className="text-sm">Create some tasks first to get personalized recommendations.</p>
          </div>
        ) : advice ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{advice}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-lg mb-2">Ready to get AI advice?</p>
            <p className="text-sm">Click the button above to get personalized task recommendations.</p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Productivity Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">🎯 Prioritization</h3>
            <p className="text-yellow-700 text-sm">
              Focus on HIGH priority tasks first, then work on medium and low priority items.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">⏰ Time Management</h3>
            <p className="text-blue-700 text-sm">
              Set realistic due dates and break large tasks into smaller, manageable chunks.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Progress Tracking</h3>
            <p className="text-green-700 text-sm">
              Update task status regularly to maintain momentum and track your progress.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">🔄 Regular Reviews</h3>
            <p className="text-purple-700 text-sm">
              Review your tasks daily and adjust priorities based on changing circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
