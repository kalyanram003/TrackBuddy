import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { reportsAPI, taskAPI, userAPI } from '../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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

  // Chart data for Task Status
  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Missed'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [stats.done, stats.inProgress, stats.pending, stats.missed],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(234, 179, 8, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',   // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for Priority Distribution
  const priorityChartData = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [stats.highPriority, stats.midPriority, stats.lowPriority],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(234, 179, 8, 0.8)',   // Yellow
          'rgba(34, 197, 94, 0.8)',   // Green
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Task Reports & Analytics</h1>
        <p className="text-green-100">
          View your task analytics with visual charts and download comprehensive reports
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
            {downloading ? 'Generating...' : '📄 Download PDF Report'}
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
        <div className="card text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
          <div className="text-sm text-blue-700 font-medium">Total Tasks</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-3xl font-bold text-green-900">{getCompletionRate()}%</div>
          <div className="text-sm text-green-700 font-medium">Completion Rate</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-3xl font-bold text-red-900">{overdueTasks.length}</div>
          <div className="text-sm text-red-700 font-medium">Overdue Tasks</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-3xl font-bold text-purple-900">{upcomingTasks.length}</div>
          <div className="text-sm text-purple-700 font-medium">Due This Week</div>
        </div>
      </div>

      {/* Pie Charts Section - PHASE 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-center">📊 Task Status Distribution</h3>
          <div className="w-full max-w-md mx-auto">
            {stats.total > 0 ? (
              <Pie data={statusChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500 py-12">
                No task data available
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Total: {stats.total} tasks
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-center">🎯 Priority Distribution</h3>
          <div className="w-full max-w-md mx-auto">
            {stats.total > 0 ? (
              <Pie data={priorityChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500 py-12">
                No task data available
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Total: {stats.total} tasks
          </div>
        </div>
      </div>

      {/* Task Status Breakdown with Progress Bars - PHASE 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">📈 Detailed Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.done}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.inProgress}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.pending}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Missed</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.missed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.missed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🔥 Priority Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">High Priority</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.highPriority}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.midPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.midPriority}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Priority</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.lowPriority}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {overdueTasks.length > 0 && (
          <div className="card border-l-4 border-red-500">
            <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Overdue Tasks</h3>
            <div className="space-y-2">
              {overdueTasks.slice(0, 5).map((task) => (
                <div key={task.taskId} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <span className="text-sm text-red-800 font-medium">{task.description}</span>
                  <span className="text-xs text-red-600 font-semibold">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {overdueTasks.length > 5 && (
                <p className="text-xs text-red-600 text-center pt-2">
                  ... and {overdueTasks.length - 5} more overdue task{overdueTasks.length - 5 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div className="card border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">📅 Upcoming Tasks (This Week)</h3>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.taskId} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-sm text-blue-800 font-medium">{task.description}</span>
                  <span className="text-xs text-blue-600 font-semibold">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {upcomingTasks.length > 5 && (
                <p className="text-xs text-blue-600 text-center pt-2">
                  ... and {upcomingTasks.length - 5} more upcoming task{upcomingTasks.length - 5 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {overdueTasks.length === 0 && upcomingTasks.length === 0 && stats.total > 0 && (
          <div className="col-span-1 lg:col-span-2 card bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-2 text-green-600">✨ All Clear!</h3>
            <p className="text-green-700">
              Great job! You have no overdue tasks and no tasks due this week. Keep up the good work!
            </p>
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
