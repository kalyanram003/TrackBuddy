import axios from 'axios';

// Base URL - prefer env var, fallback to localhost:8082
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Attach Authorization header if token present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/rwt/auth/register', data),
  login: (data) => apiClient.post('/rwt/auth/login', data),
};

// User API
export const userAPI = {
  getUserById: (id) => apiClient.get(`/rwt/userId/${id}`),
  getUserByEmail: (email) => apiClient.get(`/rwt/userByEmail/${encodeURIComponent(email)}`),
  getUserTasks: (id) => apiClient.get(`/rwt/userId/${id}/task`),
};

// Task API
export const taskAPI = {
  getAllTasks: () => apiClient.get('/rwt/allTasks'),
  createTask: (task) => apiClient.post('/rwt/addTask', task),
  getTaskById: (id) => apiClient.get(`/rwt/taskId/${id}`),
  deleteTask: (id) => apiClient.delete(`/rwt/taskId/${id}`),
  getUserTasks: (userId) => apiClient.get(`/rwt/users/${userId}/tasks`)
    .catch(() => apiClient.get(`/rwt/userId/${userId}/task`)), // fallback to older route
  getPriorityTasks: (userId) => apiClient.get(`/rwt/users/${userId}/prior-tasks`),
  downloadReport: (userId) => apiClient.get(`/rwt/users/${userId}/tasks/pdf`, { responseType: 'arraybuffer' }),
  testTask: (task) => apiClient.post('/rwt/testTask', task),
};

// Reports API (wrap download to match frontend usage)
export const reportsAPI = {
  downloadTaskReport: (userId) => apiClient.get(`/rwt/users/${userId}/tasks/pdf`, { responseType: 'arraybuffer' }),
};

// Teams API
export const teamsAPI = {
  createTeam: (data) => apiClient.post('/rwt/teams', data),
  myTeams: (userId) => apiClient.get('/rwt/teams/mine', { params: { userId } }),
  listMembers: (teamId) => apiClient.get('/rwt/teams/members', { params: { teamId } }),
  addMember: (data) => apiClient.post('/rwt/teams/members', data),
  removeMember: (data) => apiClient.delete('/rwt/teams/members', { data }),
  assignTask: (data) => apiClient.post('/rwt/teams/assignTask', data),
  deleteTeam: (data) => apiClient.delete('/rwt/teams', { data }),
};

// AI API
export const aiAPI = {
  getAdvice: (userId) => apiClient.get(`/rwt/ai/advice/${userId}`),
};

export default apiClient;
