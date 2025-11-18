// Test connection utility
export const testBackendConnection = async () => {
  try {
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
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('Login failed:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('Connection error:', error);
    return { success: false, error: error.message };
  }
};

// Test CORS
export const testCORS = async () => {
  try {
    const response = await fetch('http://localhost:8082/rwt/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log('CORS test response status:', response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error('CORS test error:', error);
    return { success: false, error: error.message };
  }
};
