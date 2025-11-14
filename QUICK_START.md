# Quick Start Guide - Production API

## Getting Started (First Time)

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## Important Configuration

### ✅ Frontend `.env.local`
```
REACT_APP_API_URL=http://localhost:5000/api
```
*(Already created - no changes needed)*

### ✅ Backend `.env`
```
MONGODB_URI=mongodb+srv://RanveerDB:RanveerDB@dashboard.qewrwhr.mongodb.net/agency_dashboard?retryWrites=true&w=majority
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
*(Already configured - verify MongoDB connection works)*

---

## What Changed?

### Before: Mock API ❌
- All data in memory
- No real persistence
- Fake login (name === password)
- Data lost on refresh

### Now: Production API ✅
- Data stored in MongoDB
- Real authentication with JWT
- Data persists across sessions
- Professional error handling
- Production-ready!

---

## Test These Features

### 1. Register New User
- Go to Register tab
- Fill form with name, phone, department
- Click "Create Account"
- ✅ Check: User appears in MongoDB

### 2. Login
- Use registered credentials
- Password is hashed and verified by backend
- ✅ Check: JWT token in browser localStorage

### 3. Create Task (Admin Only)
- Login as admin
- Click "Create Task"
- Fill form and submit
- ✅ Check: Task appears in MongoDB and dashboard

### 4. View Leaderboard
- Leaderboard loads real data from backend
- Shows user points and rankings from MongoDB
- ✅ Check: Data persists after page refresh

### 5. Create Announcement (Admin)
- Click "New Announcement"
- Add title and message
- ✅ Check: Appears for all users

---

## File Changes at a Glance

| File | Change | Impact |
|------|--------|--------|
| `api.js` | NEW | Centralized API service |
| `AuthContext.jsx` | Updated | Uses real backend auth |
| `LoginPage.jsx` | Updated | Fetches departments from backend |
| `EmployeeDashboard.jsx` | Updated | Real data from MongoDB |
| `AdminDashboard.jsx` | Updated | Real data from MongoDB |
| `TaskModal.jsx` | Updated | Backend departments/users |
| `Leaderboard.jsx` | Updated | Real leaderboard from backend |
| `.env.local` | NEW | API URL configuration |

---

## How the API Service Works

### Simple Example: Get Tasks

```javascript
// In your component
import { api } from '../services/api';

// Fetch tasks
const tasks = await api.getTasks();

// Behind the scenes (in api.js):
// 1. Get JWT token from localStorage
// 2. Make GET request to http://localhost:5000/api/tasks
// 3. Include Authorization header: "Bearer <token>"
// 4. Backend validates token and returns user's tasks
// 5. Return data to component
```

### Simple Example: Create Task

```javascript
// In your component
const result = await api.createTask({
  title: 'New Task',
  description: '...',
  department: 'Web',
  assignedTo: 'John Smith',
  priority: 'High'
});

// Behind the scenes:
// 1. Add JWT token to Authorization header
// 2. POST to /api/tasks with task data
// 3. Backend validates (is admin?), creates in MongoDB
// 4. Return created task with MongoDB _id
```

---

## Troubleshooting

### ❌ "Failed to fetch departments"
**Solution**: 
1. Ensure backend is running (`npm run dev` in backend folder)
2. Check MongoDB connection in backend/.env
3. Verify port 5000 is not blocked

### ❌ "Invalid credentials"
**Solution**: 
1. Verify username/phone exists in MongoDB
2. Use correct password (case-sensitive)
3. Check backend logs for errors

### ❌ "Unauthorized"
**Solution**: 
1. Token expired - login again
2. Clear localStorage and refresh
3. Check JWT_SECRET matches in backend/.env

### ❌ CORS errors
**Solution**: 
1. Frontend URL is http://localhost:3000 (default)
2. If different port, update FRONTEND_URL in backend/.env
3. Restart backend after changing .env

---

## API Endpoints Used

```
# Authentication
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

# Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/stats/overview

# Announcements
GET    /api/announcements
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id

# Users
GET    /api/users
GET    /api/users/departments

# Leaderboard
GET    /api/leaderboard
```

---

## Next Steps

1. ✅ Verify both frontend and backend are running
2. ✅ Test login/register functionality
3. ✅ Verify MongoDB connection
4. ✅ Create test data (tasks, announcements)
5. ✅ Check localStorage has token after login
6. 📝 For production: Update API_URL, JWT_SECRET, MongoDB URI

---

## Questions?

- Check `API_MIGRATION.md` for detailed documentation
- Check `MIGRATION_SUMMARY.md` for technical details
- Check browser console for error messages
- Check backend logs for request details

**You're all set! 🚀**
