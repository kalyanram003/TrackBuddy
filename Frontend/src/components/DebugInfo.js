import React, { useState, useEffect } from 'react';

const DebugInfo = () => {
  const [backendStatus, setBackendStatus] = useState('Unknown');
  const [corsStatus, setCorsStatus] = useState('Unknown');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connectivity
      const response = await fetch('http://localhost:8082/rwt/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: 'admin123'
        })
      });

      if (response.ok) {
        setBackendStatus('Connected');
        setCorsStatus('Working');
      } else {
        setBackendStatus(`Error: ${response.status}`);
        setCorsStatus('Failed');
      }
    } catch (error) {
      setBackendStatus('Failed to connect');
      setCorsStatus('Failed');
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div>Backend: <span className={`font-medium ${backendStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>{backendStatus}</span></div>
        <div>CORS: <span className={`font-medium ${corsStatus === 'Working' ? 'text-green-600' : 'text-red-600'}`}>{corsStatus}</span></div>
        <div>API URL: http://localhost:8082</div>
        <div>Frontend: http://localhost:3000</div>
        <button 
          onClick={testConnection}
          className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Again
        </button>
      </div>
    </div>
  );
};

export default DebugInfo;
