# TrackBuddy Frontend

A modern React frontend for the TrackBuddy task management application.

## 🚀 Features

- **Authentication**: JWT-based login and registration
- **Task Management**: Create, read, update, and delete tasks
- **Dashboard**: Overview of tasks with statistics
- **AI Assistant**: Get intelligent task prioritization suggestions
- **Reports**: Download PDF reports and view analytics
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with JWT support
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TrackBuddy backend running on http://localhost:8082

## 🚀 Quick Start

1. **Navigate to the Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to http://localhost:3000

## 📁 Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   └── TaskCard.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Tasks.js
│   │   ├── CreateTask.js
│   │   ├── UpdateTask.js
│   │   ├── AiAssistant.js
│   │   └── Reports.js
│   ├── routes/
│   │   └── ProtectedRoute.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Frontend directory:

```env
REACT_APP_API_URL=http://localhost:8082
```

### Backend API Endpoints

The frontend connects to the following backend endpoints:

- **Authentication**: `/rwt/auth/login`, `/rwt/auth/register`
- **Tasks**: `/rwt/allTasks`, `/rwt/addTask`, `/rwt/taskId/{id}`
- **AI Assistant**: `/rwt/ai/advice/{userId}`
- **Reports**: `/rwt/users/{userId}/tasks/pdf`

## 🎨 Features Overview

### Authentication
- Secure JWT-based authentication
- Automatic token refresh
- Protected routes
- Logout functionality

### Task Management
- Create new tasks with description, priority, due date
- View all tasks with filtering and search
- Update task status and details
- Delete tasks
- Priority and status indicators

### Dashboard
- Task statistics overview
- Priority task display
- Quick action buttons
- Recent tasks list

### AI Assistant
- Get intelligent task prioritization
- Productivity tips and recommendations
- Task analysis and suggestions

### Reports
- Download comprehensive PDF reports
- Task analytics and statistics
- Overdue and upcoming task alerts
- Visual progress indicators

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to API requests
4. Protected routes check for valid token
5. Token expiration redirects to login

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Build the project
2. Upload the `build` folder
3. Configure environment variables

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for localhost:3000
2. **API Connection**: Verify backend is running on http://localhost:8082
3. **JWT Issues**: Check token expiration and localStorage

### Development Tips

- Use browser dev tools to inspect API calls
- Check network tab for failed requests
- Verify JWT token in localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the TrackBuddy application.
