import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';

const ViewTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTaskById(id);
      setTask(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch task details');
      console.error('Fetch task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DONE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MISSED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MID':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'LOW':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading task details...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Task not found'}
        </div>
        <Link to="/tasks" className="btn-secondary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/tasks')}
          className="text-gray-600 hover:text-gray-800 mb-4 inline-flex items-center"
        >
          ← Back to Tasks
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
      </div>

      {/* Flash Card Style View */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 space-y-6">
        {/* Description - Main Content */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{task.description || 'No description provided'}</p>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
            <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-center ${getStatusColor(task.status)}`}>
              {task.status?.replace('_', ' ') || 'PENDING'}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-2">Priority</label>
            <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-center ${getPriorityColor(task.priority)}`}>
              {task.priority || 'MID'}
            </div>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Due Date</label>
            <div className="text-gray-900 font-medium text-lg">
              {formatDate(task.dueDate)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Scheduled Time</label>
            <div className="text-gray-900 font-medium text-lg">
              {formatDate(task.scheduledTime)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Created At</label>
            <div className="text-gray-700">
              {formatDate(task.startTime)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          <Link
            to={`/tasks/${task.taskId}/edit`}
            className="btn-primary flex-1 min-w-[120px]"
          >
            Edit Task
          </Link>
          <button
            onClick={() => navigate('/tasks')}
            className="btn-secondary flex-1 min-w-[120px]"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;

