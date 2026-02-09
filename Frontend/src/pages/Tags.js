import React, { useState, useEffect } from 'react';
import { tagsAPI } from '../services/api';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState({ name: '', colorCode: '#3B82F6' });
  const [creating, setCreating] = useState(false);
  const userId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await tagsAPI.getUserTags(userId);
      setTags(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch tags');
      console.error('Fetch tags error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) {
      setError('Tag name is required');
      return;
    }

    setCreating(true);
    try {
      const tagData = {
        name: newTag.name,
        colorCode: newTag.colorCode,
        userId: parseInt(userId),
      };
      await tagsAPI.createTag(tagData);
      setNewTag({ name: '', colorCode: '#3B82F6' });
      setError('');
      await fetchTags();
    } catch (err) {
      setError('Failed to create tag');
      console.error('Create tag error:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await tagsAPI.deleteTag(tagId);
        setTags(tags.filter(tag => tag.id !== tagId));
      } catch (err) {
        setError('Failed to delete tag');
        console.error('Delete tag error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading tags...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Tags</h1>
        <p className="text-gray-600 mt-2">Create and manage tags for organizing your tasks</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Create New Tag Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateTag} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name *
              </label>
              <input
                id="tagName"
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="input-field"
                placeholder="Enter tag name (e.g., 'Urgent', 'Documentation')"
              />
            </div>
            <div>
              <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                id="colorCode"
                type="color"
                value={newTag.colorCode}
                onChange={(e) => setNewTag({ ...newTag, colorCode: e.target.value })}
                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Tag'}
          </button>
        </form>
      </div>

      {/* Tags List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Tags</h2>
        {tags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="p-4 rounded-lg border-2 border-gray-200 hover:shadow-md transition-shadow"
                style={{ borderLeftColor: tag.colorCode, borderLeftWidth: '4px' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tag.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(tag.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tags created yet. Create your first tag above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;
