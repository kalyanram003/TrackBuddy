import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import UpdateTask from './pages/UpdateTask';
import AiAssistant from './pages/AiAssistant';
import Reports from './pages/Reports';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import AssignTeamTask from './pages/AssignTeamTask';

// Import styles
import './styles/index.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={token ? <Navigate to="/dashboard" replace /> : <Register />} 
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-6">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/tasks/create" element={<CreateTask />} />
                        <Route path="/tasks/:id" element={<UpdateTask />} />
                        <Route path="/tasks/:id/edit" element={<UpdateTask />} />
                        <Route path="/ai-assistant" element={<AiAssistant />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/teams/:teamId" element={<TeamDetails />} />
                        <Route path="/teams/:teamId/assign-task" element={<AssignTeamTask />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
