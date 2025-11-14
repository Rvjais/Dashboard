# Production API Migration Guide

## Overview
Your Dashboard application has been successfully migrated from **Mock API** to **Production Ready API**. The frontend now communicates directly with your backend MongoDB database instead of using mock data.

---

## What Changed

### 1. **New API Service Layer** (`src/services/api.js`)
- **Purpose**: Centralized API communication layer
- **Features**:
  - Automatic token management (JWT authentication)
  - Error handling with automatic redirect on 401 (unauthorized)
  - Proper request/response formatting
  - Fetch wrapper with Bearer token injection

### 2. **Updated Files**
The following files have been updated to use the new production API:

**Frontend:**
- `src/contexts/AuthContext.jsx` - Now uses `api.login()` and `api.register()`
- `src/pages/LoginPage.jsx` - Fetches departments from backend
- `src/pages/EmployeeDashboard.jsx` - All data from backend API
- `src/pages/AdminDashboard.jsx` - All data from backend API
- `src/components/TaskModal.jsx` - Departments and users from backend
- `src/components/Leaderboard.jsx` - Leaderboard from backend

**Backend:**
- No changes needed - already production-ready!

---

## API Endpoints Being Used

### Authentication
```
POST   /api/auth/login           - Login user
POST   /api/auth/register        - Register new user
GET    /api/auth/me              - Get current user
```

### Tasks
```
GET    /api/tasks                - Get filtered tasks
POST   /api/tasks                - Create new task (admin)
PUT    /api/tasks/:id            - Update task
DELETE /api/tasks/:id            - Delete task (admin)
GET    /api/tasks/stats/overview - Get task statistics
```

### Announcements
```
GET    /api/announcements        - Get all announcements
POST   /api/announcements        - Create announcement (admin)
PUT    /api/announcements/:id    - Update announcement (admin)
DELETE /api/announcements/:id    - Delete announcement (admin)
```

### Users & Departments
```
GET    /api/users                - Get all users (admin)
GET    /api/users/departments    - Get departments list
```

### Leaderboard
```
GET    /api/leaderboard          - Get leaderboard with time filter
```

---

## How to Run

### Prerequisites
- Node.js and npm installed
- MongoDB running (either locally or using MongoDB Atlas connection string)
- Backend and frontend both running

### Backend Setup
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
npm install
npm run dev
# App runs on http://localhost:3000
```

### Important: .env Files

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend (.env)**
Already configured with your MongoDB URI and JWT settings.

---

## Key Features of the New API Service

### 1. **Automatic Token Management**
```javascript
const token = localStorage.getItem('token');
// Automatically added to Authorization header
headers['Authorization'] = `Bearer ${token}`
```

### 2. **Error Handling**
- Unauthorized (401) → Auto logout and redirect to login
- Network errors → Console logging and proper error messages
- Validation errors → Returned from backend

### 3. **Request/Response Flow**

#### Login Example:
```javascript
// Frontend
const result = await login({ username: 'john', password: 'pass123' });

// Backend receives request
// Validates credentials
// Returns user data + JWT token

// Frontend receives response
// Stores token in localStorage
// User is authenticated for subsequent requests
```

#### Create Task Example:
```javascript
// Frontend
await api.createTask({
  title: 'New Task',
  description: 'Task details',
  department: 'Web',
  assignedTo: 'John Smith',
  priority: 'High'
});

// Backend
// Verifies JWT token in Authorization header
// Validates admin permissions
// Creates task in MongoDB
// Returns created task
```

---

## Common Issues & Solutions

### Issue: "Unauthorized - please login again"
- **Cause**: JWT token expired or invalid
- **Solution**: Automatically handled - user redirected to login page

### Issue: "Failed to fetch..." errors
- **Cause**: Backend not running or wrong API URL
- **Solution**: 
  1. Check backend is running on port 5000
  2. Verify `REACT_APP_API_URL` in .env.local
  3. Check MongoDB connection string in backend .env

### Issue: CORS errors
- **Cause**: Frontend origin not allowed
- **Solution**: Backend CORS is configured for `http://localhost:3000`
  - If using different port, update `FRONTEND_URL` in backend .env

---

## Data Flow Diagram

```
Frontend (React)
     ↓
  AuthContext (manages user state)
     ↓
api.js (centralized API calls)
     ↓
Backend Server (Express)
     ↓
Auth Middleware (validates JWT)
     ↓
MongoDB Database
```

---

## Testing the Migration

1. **Test Login/Registration**
   - Open http://localhost:3000
   - Try registering a new user
   - Verify data appears in MongoDB

2. **Test Task Creation**
   - Login as admin
   - Create a new task
   - Verify it appears in both dashboards

3. **Test Data Retrieval**
   - Check that all tasks, announcements, and leaderboard data load from backend

4. **Test Token Management**
   - Close browser and reopen
   - Login again to verify token storage/retrieval

---

## Production Deployment Notes

When deploying to production:

1. **Update API URL**
   ```
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

2. **Update Backend**
   - Change `FRONTEND_URL` to your frontend domain
   - Update `JWT_SECRET` to a strong random string
   - Ensure MongoDB connection uses production URI

3. **CORS Configuration**
   - Backend automatically restricts to `FRONTEND_URL`

4. **HTTPS**
   - Use HTTPS for both frontend and backend
   - Update API URLs to use `https://`

---

## API Service API Reference

```javascript
// Authentication
api.login(credentials)              // Returns { token, user }
api.register(userData)              // Returns { token, user }
api.logout()                        // Clears local storage

// Tasks
api.getTasks(filters)               // filters: { department, status, priority }
api.createTask(taskData)
api.updateTask(taskId, updates)
api.deleteTask(taskId)
api.getTaskStats()                  // Returns stats overview

// Announcements
api.getAnnouncements()
api.createAnnouncement(data)
api.updateAnnouncement(id, updates)
api.deleteAnnouncement(id)

// Users
api.getUsers(department)            // department optional
api.getDepartments()

// Leaderboard
api.getLeaderboard(timeFilter)      // timeFilter: 'all' | 'week' | 'month'

// Health
api.healthCheck()                   // Verifies backend is running
```

---

## Summary

✅ **Replaced**: All `mockAPI` calls with production `api` calls  
✅ **Added**: Centralized API service layer (`api.js`)  
✅ **Added**: Automatic JWT token management  
✅ **Added**: Proper error handling and auth flow  
✅ **Maintained**: All existing UI/UX functionality  
✅ **Ready**: For production deployment  

Your application is now production-ready and connected to real data! 🚀
