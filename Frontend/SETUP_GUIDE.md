# 🔧 TrackBuddy Frontend-Backend Connection Setup Guide

## 🚨 Troubleshooting Login Issues

### Step 1: Verify Backend is Running

1. **Check if Spring Boot is running on port 8082:**
   ```bash
   # In Backend directory
   ./mvnw spring-boot:run
   ```

2. **Test backend API directly:**
   ```bash
   # PowerShell
   Invoke-RestMethod -Uri "http://localhost:8082/rwt/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@gmail.com","password":"admin123"}'
   
   # Should return: { "token": "...", "Email": "admin@gmail.com", "userId": 1, "name": "..." }
   ```

### Step 2: Verify Frontend Configuration

1. **Check package.json proxy:**
   ```json
   {
     "proxy": "http://localhost:8082"
   }
   ```

2. **Check API base URL in services/api.js:**
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
   ```

### Step 3: Start Frontend

```bash
cd Frontend
npm install
npm start
```

### Step 4: Test Login

1. Open http://localhost:3000
2. Try logging in with: `admin@gmail.com` / `admin123`
3. Check browser console for debug logs
4. The in-app debug components have been removed. Use browser devtools (Console/Network) or run the test scripts in `src/utils/testConnection.js` to verify API connectivity.

## 🔍 Debug Information (removed)

### Backend Changes Made:
1. **CORS Configuration** - Added CorsConfig.java
2. **Login Response** - Now returns userId and name
3. **New Endpoint** - `/rwt/userByEmail/{email}`

### Frontend Changes Made:
1. **Better Error Handling** - More descriptive error messages
2. **Debug Logging** - Console logs for troubleshooting
3. **Debug Component** - Shows connection status
4. **User ID Storage** - Properly stores userId in localStorage

## 🚀 Quick Fixes

### If Login Still Fails:

1. **Restart Backend:**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

2. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Try login
   - Look for failed requests (red entries)

4. **Verify CORS:**
   - Check if OPTIONS request is successful
   - Look for CORS errors in console

### Common Issues:

1. **"Cannot connect to server"** → Backend not running on port 8082
2. **"Invalid credentials"** → Wrong email/password or user not in database
3. **CORS errors** → Backend CORS not configured properly
4. **404 errors** → Wrong API endpoints

## 📋 Test Credentials

- **Email:** admin@gmail.com
- **Password:** admin123

## 🔧 Manual Database Check

If you need to verify the user exists in the database:

1. Connect to your PostgreSQL database
2. Check the `users` table:
   ```sql
   SELECT * FROM users WHERE email = 'admin@gmail.com';
   ```

## 📞 Need Help?

1. Check browser console for error messages
2. Use the browser Console and Network tabs, or call the API endpoints directly (e.g., POST /rwt/auth/login) to check connectivity.
3. Verify both frontend and backend are running
4. Test the backend API directly with curl/PowerShell

The debug component will show you the exact connection status and help identify the issue!
