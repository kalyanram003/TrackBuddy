import React, { useState } from 'react';

const TaskCreationDebug = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testTaskCreation = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test with sample data
      const testData = {
        description: 'Debug Test Task',
        priority: 'HIGH',
        status: 'PENDING',
        userId: 1
      };

      // First test the test endpoint
      const testResponse = await fetch('http://localhost:8082/rwt/testTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testData)
      });

      if (testResponse.ok) {
        const testResult = await testResponse.text();
        setTestResult(`✅ Test Endpoint: ${testResult}`);
        
        // Now test actual task creation
        const createResponse = await fetch('http://localhost:8082/rwt/addTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(testData)
        });

        if (createResponse.ok) {
          const result = await createResponse.json();
          setTestResult(`✅ Success: Task created with ID ${result.taskId}`);
        } else {
          const error = await createResponse.text();
          setTestResult(`❌ Create Error ${createResponse.status}: ${error}`);
        }
      } else {
        const error = await testResponse.text();
        setTestResult(`❌ Test Error ${testResponse.status}: ${error}`);
      }
    } catch (error) {
      setTestResult(`❌ Connection Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Task Creation Debug</h3>
      <div className="text-xs space-y-2">
        <div>Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</div>
        <div>User ID: {localStorage.getItem('userId') || 'Not set'}</div>
        <button 
          onClick={testTaskCreation}
          disabled={loading}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Task Creation'}
        </button>
        {testResult && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCreationDebug;
