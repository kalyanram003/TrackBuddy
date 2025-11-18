import React, { useState, useEffect } from 'react';
import { reportsAPI, taskAPI, userAPI } from '../services/api';

const Reports = () => {
  const [userTasks, setUserTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [userId] = useState(localStorage.getItem('userId') || '1');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
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
      
    } catch (err) {
      setError('Failed to fetch report data');
      console.error('Report data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
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
      setError('Failed to download report');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const getTaskStats = () => {
    const total = userTasks.length;
    const pending = userTasks.filter(task => task.status === 'PENDING').length;
    const inProgress = userTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const done = userTasks.filter(task => task.status === 'DONE').length;
    const missed = userTasks.filter(task => task.status === 'MISSED').length;
    
    const highPriority = userTasks.filter(task => task.priority === 'HIGH').length;
    const midPriority = userTasks.filter(task => task.priority === 'MID').length;
    const lowPriority = userTasks.filter(task => task.priority === 'LOW').length;
    
    return { total, pending, inProgress, done, missed, highPriority, midPriority, lowPriority };
  };

  const getCompletionRate = () => {
    const stats = getTaskStats();
    return stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return userTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now && task.status !== 'DONE';
    });
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return userTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate > now && dueDate <= nextWeek && task.status !== 'DONE';
    });
  };

  const stats = getTaskStats();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading report data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Task Reports</h1>
        <p className="text-green-100">
          View your task analytics and download comprehensive reports
        </p>
      </div>

      {/* Download Section */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Download PDF Report</h2>
            <p className="text-gray-600">
              Generate and download a comprehensive PDF report of all your tasks
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={downloading || userTasks.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
        
        {userTasks.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              No tasks available for report generation. Create some tasks first.
            </p>
          </div>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{getCompletionRate()}%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-600">{overdueTasks.length}</div>
          <div className="text-sm text-gray-600">Overdue Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">{upcomingTasks.length}</div>
          <div className="text-sm text-gray-600">Due This Week</div>
        </div>
      </div>

      {/* Task Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Task Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.done}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.inProgress}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.pending}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Missed</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.missed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.missed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">High Priority</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.highPriority}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.midPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.midPriority}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Priority</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.lowPriority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {overdueTasks.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Overdue Tasks</h3>
            <div className="space-y-2">
              {overdueTasks.slice(0, 5).map((task) => (
                <div key={task.taskId} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm text-red-800">{task.description}</span>
                  <span className="text-xs text-red-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {overdueTasks.length > 5 && (
                <p className="text-xs text-red-600">... and {overdueTasks.length - 5} more</p>
              )}
            </div>
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">📅 Upcoming Tasks</h3>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.taskId} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-800">{task.description}</span>
                  <span className="text-xs text-blue-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {upcomingTasks.length > 5 && (
                <p className="text-xs text-blue-600">... and {upcomingTasks.length - 5} more</p>
              )}
            </div>
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

export default Reports;
