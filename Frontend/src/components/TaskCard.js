import React from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onDelete, showUser = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'mid':
        return 'priority-mid';
      case 'low':
        return 'priority-low';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-in-progress';
      case 'done':
        return 'status-done';
      case 'missed':
        return 'status-missed';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.description}
          </h3>
          {showUser && task.user && (
            <p className="text-sm text-gray-600 mb-2">
              Assigned to: {task.user.name} ({task.user.email})
            </p>
          )}
          <p className="text-sm text-gray-600">
            Due: {formatDate(task.dueDate)}
          </p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
            {task.status?.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Created: {formatDate(task.startTime)}
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/tasks/${task.taskId}`}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            View
          </Link>
          <Link
            to={`/tasks/${task.taskId}/edit`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(task.taskId)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
