import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI, userAPI, reportsAPI } from '../services/api';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user ID from localStorage (we'll need to implement this)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('userId') || '1'; // Default for demo

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user info
      if (userId !== '1') {
        const userResponse = await userAPI.getUserById(userId);
        setUser(userResponse.data);
      }
      
      // Fetch user tasks
      const tasksResponse = await taskAPI.getUserTasks(userId);
      setUserTasks(tasksResponse.data);
      
      // Fetch priority tasks
      const priorityResponse = await taskAPI.getPriorityTasks(userId);
      setPriorityTasks(priorityResponse.data);
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await reportsAPI.downloadTaskReport(userId);
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `task_report_user_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report');
      console.error('Download error:', err);
    }
  };

  const getTaskStats = () => {
    const total = userTasks.length;
    const pending = userTasks.filter(task => task.status === 'PENDING').length;
    const inProgress = userTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const done = userTasks.filter(task => task.status === 'DONE').length;
    const missed = userTasks.filter(task => task.status === 'MISSED').length;
    
    return { total, pending, inProgress, done, missed };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to TrackBuddy!</h1>
        <p className="text-primary-100">
          {user ? `Hello ${user.name}!` : `Hello ${currentUser.email}!`} Here's your task overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <div className="text-2xl font-bold text-green-600">{stats.done}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.missed}</div>
          <div className="text-sm text-gray-600">Missed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/tasks/create" className="btn-primary">
            Create New Task
          </Link>
          <Link to="/tasks" className="btn-secondary">
            View All Tasks
          </Link>
          <Link to="/ai-assistant" className="btn-secondary">
            Get AI Advice
          </Link>
          <button onClick={handleDownloadReport} className="btn-secondary">
            Download Report
          </button>
        </div>
      </div>

      {/* Priority Tasks */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Priority Tasks</h2>
          <Link to="/tasks" className="text-primary-600 hover:text-primary-800">
            View All
          </Link>
        </div>
        
        {priorityTasks.length > 0 ? (
          <div className="space-y-4">
            {priorityTasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                onDelete={() => {}} // Handle delete if needed
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No priority tasks found. Great job!</p>
            <Link to="/tasks/create" className="text-primary-600 hover:text-primary-800">
              Create your first task
            </Link>
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <Link to="/tasks" className="text-primary-600 hover:text-primary-800">
            View All
          </Link>
        </div>
        
        {userTasks.length > 0 ? (
          <div className="space-y-4">
            {userTasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                onDelete={() => {}} // Handle delete if needed
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found.</p>
            <Link to="/tasks/create" className="text-primary-600 hover:text-primary-800">
              Create your first task
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
