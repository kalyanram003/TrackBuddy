import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';

const TaskCard = ({ task, onDelete, onUpdate, showUser = false }) => {
  const [updating, setUpdating] = useState(false);
  
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
      case 'completed':
        return 'status-done';
      case 'missed':
        return 'status-missed';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      
      // Create updated task object
      const updatedTask = {
        description: task.description,
        priority: task.priority,
        status: newStatus,
        userId: task.user?.userId || task.userId,
        dueDate: task.dueDate,
        scheduledTime: task.scheduledTime
      };
      
      await taskAPI.updateTask(task.taskId, updatedTask);
      
      // Notify parent component to refresh
      if (onUpdate) {
        onUpdate();
      } else {
        // Refresh page if no update handler
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const renderStatusButtons = () => {
    const currentStatus = task.status?.toUpperCase();
    
    if (currentStatus === 'DONE' || currentStatus === 'COMPLETED') {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-green-600 text-sm">✓ Completed</span>
          <button
            onClick={() => handleStatusChange('PENDING')}
            disabled={updating}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Reopen
          </button>
        </div>
      );
    }

    return (
      <div className="flex space-x-2">
        {currentStatus !== 'IN_PROGRESS' && (
          <button
            onClick={() => handleStatusChange('IN_PROGRESS')}
            disabled={updating}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Start'}
          </button>
        )}
        <button
          onClick={() => handleStatusChange('DONE')}
          disabled={updating}
          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 disabled:opacity-50"
        >
          {updating ? 'Updating...' : '✓ Complete'}
        </button>
      </div>
    );
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.title || task.description}
          </h3>
          {task.description && task.title && (
            <p className="text-sm text-gray-600 mb-2">
              {task.description}
            </p>
          )}
          {showUser && task.user && (
            <p className="text-sm text-gray-600 mb-2">
              Assigned to: {task.user.name} ({task.user.email})
            </p>
          )}
          <p className="text-sm text-gray-600">
            Due: {formatDate(task.dueDate)}
          </p>
          {task.timeSpentMinutes > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Time spent: {task.timeSpentMinutes} minutes
            </p>
          )}
          {task.completedAt && (
            <p className="text-sm text-green-600 mt-1">
              Completed: {formatDate(task.completedAt)}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
              {task.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Status Change Buttons */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        {renderStatusButtons()}
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
