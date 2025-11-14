# Architecture & Data Flow Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│                   http://localhost:3000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐        │
│  │  LoginPage  │  │ Admin        │  │ Employee         │        │
│  │  Register   │  │ Dashboard    │  │ Dashboard        │        │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘        │
│         │                │                   │                  │
│         └────────────────┴───────────────────┘                  │
│                          │                                       │
│              AuthContext (User State Management)                 │
│                          │                                       │
│                   ┌──────▼──────┐                                │
│                   │   api.js     │                                │
│                   │ Service      │                                │
│                   │ Layer        │                                │
│                   └──────┬───────┘                                │
│                          │                                       │
│                    ✅ Token Injection                             │
│                    ✅ Error Handling                              │
│                    ✅ Request/Response                            │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP Requests
                   (JWT Authorized)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                           │
│                   http://localhost:5000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌────────────┐  ┌──────────┐                 │
│  │ Auth Routes  │  │ Task       │  │Announce  │  ┌───────────┐ │
│  │/auth/*       │  │Routes      │  │Routes    │  │ Leaderb   │ │
│  │             │  │/tasks/*    │  │/announce │  │Routes     │ │
│  └──────┬───────┘  │           │  │/*        │  │/leaderb   │ │
│         │          └─────┬─────┘  └────┬─────┘  └─────┬──────┘ │
│         │                │             │              │        │
│         │          Auth Middleware     │              │        │
│         │          (JWT Validation)    │              │        │
│         │                │             │              │        │
│         └────────────────┴─────────────┴──────────────┘        │
│                          │                                       │
│              ┌───────────▼────────────┐                          │
│              │  Mongoose Models       │                          │
│              │  • User.js             │                          │
│              │  • Task.js             │                          │
│              │  • Announcement.js     │                          │
│              └───────────┬────────────┘                          │
│                          │                                       │
└──────────────────────────┬────────────────────────────────────┘
                           │
                     MongoDB Queries
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │         MONGODB ATLAS CLOUD          │
        │    (Data Persistence)                │
        │                                      │
        │  ┌─────────┐  ┌──────────┐          │
        │  │  Users  │  │  Tasks   │          │
        │  │Collection│  │Collection│          │
        │  └────┬────┘  └─────┬────┘          │
        │       │            │                │
        │  ┌────────────┐ ┌──────────────┐    │
        │  │Announce    │ │Leaderboard   │    │
        │  │Collection  │ │ (Calculated) │    │
        │  └────────────┘ └──────────────┘    │
        │                                      │
        └──────────────────────────────────────┘
```

---

## Request-Response Flow

### 1. LOGIN FLOW

```
User enters credentials
       │
       ▼
LoginPage Component
       │
       ├──► Calls: api.login({ username, password })
       │
       ▼
api.js Service Layer
       │
       ├──► Extracts token from localStorage (if exists)
       ├──► Makes HTTP POST to /api/auth/login
       ├──► Headers: { "Content-Type": "application/json" }
       ├──► Body: { username, password }
       │
       ▼
Express Backend Server
       │
       ├──► Router receives POST /api/auth/login
       ├──► Finds user by name or phone
       ├──► Uses bcrypt.compare(plainPassword, hashedPassword)
       ├──► Generates JWT token: jwt.sign({ id, role }, SECRET)
       │
       ▼
MongoDB Database
       │
       ├──► Updates user.lastLogin = new Date()
       │
       ▼
Response back to api.js
       │
       ├──► Returns: { token: "jwt_token", user: {...} }
       │
       ▼
api.js
       │
       ├──► Stores token: localStorage.setItem('token', token)
       ├──► Stores user: localStorage.setItem('user', user)
       ├──► Returns to component
       │
       ▼
AuthContext
       │
       ├──► Updates user state
       ├──► Redirects to dashboard ✅
```

### 2. CREATE TASK FLOW

```
Admin fills task form
       │
       ▼
TaskModal Component
       │
       ├──► Calls: api.createTask(taskData)
       │
       ▼
api.js Service Layer
       │
       ├──► Gets token from localStorage
       ├──► Makes HTTP POST to /api/tasks
       ├──► Headers with Authorization: "Bearer token"
       ├──► Body: taskData
       │
       ▼
Express Backend Server
       │
       ├──► Auth Middleware validates JWT
       ├──► Checks req.user.role === 'admin' (adminAuth)
       ├──► Creates new Task document
       │
       ▼
MongoDB Database
       │
       ├──► Inserts new Task with all fields
       ├──► Generates _id (unique ObjectId)
       │
       ▼
Response back to api.js
       │
       ├──► Returns: { message: "...", task: {...} }
       │
       ▼
TaskModal Component
       │
       ├──► Closes modal
       ├──► Calls: fetchDashboardData()
       ├──► Task appears in TaskTable ✅
```

### 3. GET TASKS FLOW (Protected Route)

```
Dashboard Component mounts
       │
       ▼
Calls: api.getTasks()
       │
       ▼
api.js Service Layer
       │
       ├──► localStorage.getItem('token') ──► "jwt_token_xyz"
       ├──► Makes GET request to /api/tasks
       ├──► Headers: {
       │      'Authorization': 'Bearer jwt_token_xyz',
       │      'Content-Type': 'application/json'
       │    }
       │
       ▼
Express Backend
       │
       ├──► Auth Middleware runs
       │
       ├──► Checks Authorization header
       ├──► Extracts token: "jwt_token_xyz"
       ├──► Verifies: jwt.verify(token, SECRET)
       │    ├──► ✅ Valid: Extracts { id, role }
       │    └──► ❌ Invalid: Throws error → 401 response
       │
       ├──► Sets req.user = { id, role, ... }
       ├──► Continues to route handler
       │
       ├──► If user is NOT admin:
       │    ├──► Filter: tasks from user's department OR assigned to user
       │    └──► Return filtered tasks
       │
       ├──► If user IS admin:
       │    ├──► Return ALL tasks
       │
       ▼
MongoDB Query
       │
       ├──► Task.find(filter)
       ├──► Returns array of tasks
       │
       ▼
Response to api.js
       │
       ├──► Returns: [ task1, task2, task3, ... ]
       │
       ▼
Dashboard Component
       │
       ├──► setTasks(data)
       ├──► TaskTable renders with real data ✅
```

### 4. AUTO-LOGOUT ON 401

```
Any API request fails with 401
       │
       ▼
api.js Error Handler
       │
       ├──► Detects response.status === 401
       ├──► localStorage.removeItem('token')
       ├──► localStorage.removeItem('user')
       ├──► window.location.href = '/login'
       │
       ▼
User redirected to LoginPage
       │
       └──► Must login again ✅
```

---

## Authentication Flow (JWT)

```
┌─────────────────────────────────────────────────┐
│           FIRST TIME: LOGIN                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  Frontend                 Backend                │
│  ┌─────────────┐          ┌──────────────┐     │
│  │ Username    │          │ Find User    │     │
│  │ Password    │────────→ │ Compare      │     │
│  │             │ POST     │ Generate JWT │     │
│  │             │          │ Return Token │     │
│  └──────┬──────┘          └──────┬───────┘     │
│         │                        │              │
│         │ ← ← ← ← ← ← ← ← ← ← ← │              │
│         │                        │              │
│   Store in localStorage    MongoDB updated     │
│   {token: "jwt_abc..."}                        │
│                                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       SUBSEQUENT REQUESTS: API CALLS             │
├─────────────────────────────────────────────────┤
│                                                  │
│  Frontend                 Backend                │
│  ┌─────────────┐          ┌──────────────┐     │
│  │ Get token   │          │ Verify JWT   │     │
│  │ from storage│────────→ │ Extract user │     │
│  │             │ + Header │ Allow/Reject │     │
│  │             │ "Bearer" │              │     │
│  └──────┬──────┘          └──────┬───────┘     │
│         │                        │              │
│         │ ← ← ← ← ← ← ← ← ← ← ← │              │
│         │        Protected       │              │
│         │        Data Response   │              │
│                                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       TOKEN EXPIRES OR INVALID                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  Frontend          api.js            Backend    │
│  ┌──────────┐     ┌──────────┐     ┌────────┐ │
│  │ Request  │────→│ Add token│────→│ 401    │ │
│  │ with old │  GET│ in header│ GET │Response│ │
│  │ token    │     │          │     │        │ │
│  └──────┬───┘     └────┬─────┘     └───┬────┘ │
│         │              │                │      │
│         │ ← ← ← ← ← ← ← │                │      │
│         │               │← ← ← ← ← ← ← ─┘      │
│         │         Detect 401             │     │
│         │              │                      │
│    Clear storage  Clear token           │     │
│    Redirect to                              │     │
│    /login              Login again ✅      │     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Data Models

### User Document (MongoDB)
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  department: String, // 'Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'Admin', 'HR'
  role: String, // 'admin' or 'employee'
  password: String, // bcrypt hashed
  completedTasks: Number,
  points: Number,
  streak: Number,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Document (MongoDB)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  department: String,
  assignedBy: String,
  assignedTo: String,
  deadline: Date,
  priority: String, // 'High', 'Medium', 'Low'
  status: String, // 'Pending', 'In Progress', 'Completed'
  points: Number,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Announcement Document (MongoDB)
```javascript
{
  _id: ObjectId,
  title: String,
  message: String,
  author: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

```
┌──────────────────────────────────────┐
│     API Call Made from Frontend       │
└──────────────────────────────────────┘
           │
           ▼
    ┌────────────────┐
    │ Try / Catch    │
    └────────┬───────┘
             │
        ┌────┴─────┐
        │           │
        ▼           ▼
     Success      Error
        │           │
        │    ┌──────┴──────┐
        │    │             │
        │    ▼             ▼
        │   401        Other Error
        │ Unauthorized   (400, 500, etc)
        │    │             │
        │    ├─ Clear     ├─ Log error
        │    │  token     ├─ Show message
        │    ├─ Clear     │  in UI
        │    │  user      └─ Let user
        │    ├─ Redirect    retry
        │    │  to login
        │    │
        │  Auto
        │  Logout
        │
        └──► Return data
             to component
```

---

This architecture ensures:
✅ Secure authentication with JWT
✅ Real data persistence in MongoDB
✅ Proper error handling
✅ Protected routes (admin only)
✅ User-specific data filtering
✅ Automatic session management
