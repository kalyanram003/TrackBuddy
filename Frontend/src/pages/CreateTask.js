import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import TaskCreationDebug from '../components/TaskCreationDebug';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    description: '',
    dueDate: '',
    priority: 'MID',
    status: 'PENDING',
    scheduledTime: '',
    userId: localStorage.getItem('userId') || '1', // Default for demo
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    try {
      // Convert date strings to proper format for backend
      const taskData = {
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        userId: parseInt(formData.userId),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 19) : null,
        scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString().slice(0, 19) : null,
      };

      console.log('Creating task with data:', taskData); // Debug log
      console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8082'); // Debug log
      console.log('Token:', localStorage.getItem('token')); // Debug log
      console.log('User ID from localStorage:', localStorage.getItem('userId')); // Debug log
      console.log('User data from localStorage:', localStorage.getItem('user')); // Debug log
      
      const response = await taskAPI.createTask(taskData);
      console.log('Task created successfully:', response.data); // Debug log
      navigate('/tasks');
    } catch (err) {
      console.error('Task creation error:', err); // Debug log
      console.error('Error response:', err.response?.data); // Debug log
      console.error('Error status:', err.response?.status); // Debug log
      console.error('Error headers:', err.response?.headers); // Debug log
      
      let errorMessage = 'Failed to create task. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data || 'Invalid task data. Please check all fields.';
      } else if (err.response?.status === 0) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (err.response?.data) {
        errorMessage = `Error ${err.response.status}: ${err.response.data}`;
      } else if (err.message) {
        errorMessage = `Connection Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new task</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="Describe your task..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-field"
            >
              <option value="LOW">Low</option>
              <option value="MID">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date & Time
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleChange}
              min={getMinDateTime()}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Time
            </label>
            <input
              id="scheduledTime"
              name="scheduledTime"
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={handleChange}
              min={getMinDateTime()}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
      <TaskCreationDebug />
    </div>
  );
};

export default CreateTask;
