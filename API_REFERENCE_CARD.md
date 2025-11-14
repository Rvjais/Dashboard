# API Reference Card - Quick Lookup

## Installation & Setup

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
npm install && npm run dev

# Open http://localhost:3000
```

---

## API Service Methods

### Auth Methods
```javascript
import { api } from '../services/api';

// LOGIN
const result = await api.login({ username: 'john', password: 'pass123' });
// Returns: { token: "jwt...", user: {...} }

// REGISTER
const result = await api.register({ name: 'John', phone: '9999999999', department: 'Web' });
// Returns: { token: "jwt...", user: {...} }

// LOGOUT
api.logout();
// Clears localStorage, redirects to /login

// GET CURRENT USER
const response = await api.getCurrentUser();
// Returns: { user: {...} }
```

### Task Methods
```javascript
// GET TASKS (auto-filtered by user)
const tasks = await api.getTasks();
// Returns: [{ id, title, description, ... }]

// GET FILTERED TASKS
const tasks = await api.getTasks({
  department: 'Web',
  status: 'Pending',
  priority: 'High'
});

// CREATE TASK (admin only)
await api.createTask({
  title: 'New Task',
  description: 'Task details',
  department: 'Web',
  assignedTo: 'John Smith',
  priority: 'High',
  deadline: '2024-12-25'
});

// UPDATE TASK
await api.updateTask('taskId123', {
  status: 'Completed',
  priority: 'Medium'
});

// DELETE TASK (admin only)
await api.deleteTask('taskId123');

// GET TASK STATS
const stats = await api.getTaskStats();
// Returns: { totalTasks, completedTasks, pendingTasks, ... }
```

### Announcement Methods
```javascript
// GET ANNOUNCEMENTS
const announcements = await api.getAnnouncements();
// Returns: [{ id, title, message, author, ... }]

// CREATE ANNOUNCEMENT (admin only)
await api.createAnnouncement({
  title: 'Team Meeting',
  message: 'Meeting at 2 PM'
});

// UPDATE ANNOUNCEMENT (admin only)
await api.updateAnnouncement('announcementId123', {
  title: 'Team Meeting Updated',
  message: 'Meeting at 3 PM'
});

// DELETE ANNOUNCEMENT (admin only)
await api.deleteAnnouncement('announcementId123');
```

### User & Department Methods
```javascript
// GET ALL USERS (admin only)
const users = await api.getUsers();
// Returns: [{ id, name, phone, department, ... }]

// GET USERS BY DEPARTMENT
const webTeam = await api.getUsers('Web');

// GET DEPARTMENTS LIST
const departments = await api.getDepartments();
// Returns: ['Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'Admin', 'HR']
```

### Leaderboard Methods
```javascript
// GET LEADERBOARD (all time)
const leaderboard = await api.getLeaderboard('all');

// GET LEADERBOARD (this week)
const leaderboard = await api.getLeaderboard('week');

// GET LEADERBOARD (this month)
const leaderboard = await api.getLeaderboard('month');

// Returns: [
//   { id, name, points, completedTasks, streak, ... },
//   ...
// ]
```

### Health Check
```javascript
const status = await api.healthCheck();
// Returns: { status: 'OK' } or { status: 'ERROR' }
```

---

## Response Formats

### Success Response
```javascript
{
  message: "Operation successful",
  data: { ... },
  token: "jwt_token" // only for auth endpoints
}
```

### Error Response
```javascript
{
  error: "Error message"
}
// Automatically handled by api.js
// 401 errors trigger auto-logout
```

---

## Using in Components

### Example 1: Fetch & Display Data
```javascript
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function MyComponent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{tasks.map(t => <div>{t.title}</div>)}</div>;
}
```

### Example 2: Create New Record
```javascript
async function handleCreate(formData) {
  try {
    const result = await api.createTask(formData);
    console.log('Created:', result);
    // Refresh data
    fetchTasks();
  } catch (error) {
    console.error('Error:', error.message);
    setError(error.message);
  }
}
```

### Example 3: Update Record
```javascript
async function handleUpdate(id, updates) {
  try {
    await api.updateTask(id, updates);
    // Refresh data
    fetchTasks();
  } catch (error) {
    setError(error.message);
  }
}
```

### Example 4: Delete Record
```javascript
async function handleDelete(id) {
  try {
    await api.deleteTask(id);
    // Refresh data
    fetchTasks();
  } catch (error) {
    setError(error.message);
  }
}
```

---

## Environment Variables

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## HTTP Status Codes

| Code | Meaning | Handling |
|------|---------|----------|
| 200 | ✅ Success | Process response |
| 201 | ✅ Created | Resource created |
| 400 | ❌ Bad Request | Show error message |
| 401 | ❌ Unauthorized | Auto logout & redirect |
| 403 | ❌ Forbidden | User lacks permissions |
| 404 | ❌ Not Found | Resource doesn't exist |
| 500 | ❌ Server Error | Show error, log issue |

---

## Token Management

### How It Works
```
1. Login → Backend returns JWT token
2. api.js stores token in localStorage
3. Every request → api.js injects token in header
4. Backend validates token → Processes request
5. Token expires → Backend returns 401
6. api.js detects 401 → Clears storage & redirects
```

### Manual Token Access
```javascript
// Get token
const token = localStorage.getItem('token');

// Get user
const user = JSON.parse(localStorage.getItem('user'));

// Clear (on logout)
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Backend not running | Start backend: `npm run dev` |
| "Invalid credentials" | Wrong username/password | Use correct credentials |
| "Unauthorized" | Token expired | Login again |
| "Not authorized" | Admin-only operation | Login as admin |
| "CORS error" | Wrong frontend URL | Update `FRONTEND_URL` in .env |

---

## Debugging Tips

### 1. Check Network Requests
```
Chrome DevTools → Network tab
Watch all API calls and responses
```

### 2. Check Console Errors
```
Chrome DevTools → Console tab
api.js logs all errors here
```

### 3. Check Stored Data
```
Chrome DevTools → Application → LocalStorage
View stored token and user data
```

### 4. Check Backend Logs
```
Terminal running backend
Shows all received requests
```

### 5. Check MongoDB
```
MongoDB Atlas Dashboard
View all collections and documents
```

---

## Department List

```javascript
[
  'Web',       // 🌐 Web Development
  'AI',        // 🤖 Artificial Intelligence (NEW)
  'SEO',       // 🔍 Search Engine Optimization
  'Ads',       // 📢 Advertising
  'Graphics',  // 🎨 Graphic Design
  'Accounts',  // 💼 Accounting
  'Admin',     // 👨‍💼 Administration
  'HR'         // 👥 Human Resources (NEW)
]
```

---

## File Changes Quick Reference

```
CREATED:
✅ src/services/api.js
✅ .env.local

MODIFIED (removed mockAPI):
✅ src/contexts/AuthContext.jsx
✅ src/pages/LoginPage.jsx
✅ src/pages/EmployeeDashboard.jsx
✅ src/pages/AdminDashboard.jsx
✅ src/components/TaskModal.jsx
✅ src/components/Leaderboard.jsx

DOCUMENTED:
✅ API_MIGRATION.md
✅ MIGRATION_SUMMARY.md
✅ QUICK_START.md
✅ ARCHITECTURE.md
✅ PRODUCTION_API_COMPLETE.md
✅ API_REFERENCE_CARD.md (this file)
```

---

## One-Liner Commands

```bash
# Start everything
Terminal 1: cd backend && npm run dev
Terminal 2: npm run dev

# Test API health
curl http://localhost:5000/api/health

# View MongoDB (Atlas)
Visit: https://cloud.mongodb.com

# Check logs
Look at terminal where npm run dev is running
```

---

## Next Steps

1. ✅ Start backend & frontend
2. ✅ Register a new user
3. ✅ Login with credentials
4. ✅ Create a task (admin)
5. ✅ View leaderboard
6. ✅ Test all CRUD operations
7. ✅ Check MongoDB for data
8. ✅ Deploy to production

---

**API Service is production-ready! 🎉**

Refer back to this card for quick API method lookups.
