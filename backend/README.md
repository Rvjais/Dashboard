# Agency Dashboard Backend

This is the backend API for the Agency Management Dashboard built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Task management system
- Announcement system
- Performance leaderboard
- Department-based organization
- Role-based access control (Admin/Employee)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/agency_dashboard
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `GET /api/tasks/stats/overview` - Get task statistics

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/departments` - Get departments list

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

### Leaderboard
- `GET /api/leaderboard` - Get performance leaderboard

## Database Schema

### User Model
- `name`: String (required)
- `phone`: String (required, unique)
- `department`: String (required)
- `role`: String (admin/employee)
- `password`: String (hashed)
- `completedTasks`: Number
- `points`: Number
- `streak`: Number
- `timestamps`: Object

### Task Model
- `title`: String (required)
- `description`: String (required)
- `department`: String (required)
- `assignedBy`: String (required)
- `assignedTo`: String (required)
- `deadline`: Date (required)
- `priority`: String (Low/Medium/High)
- `status`: String (Pending/In Progress/Completed)
- `points`: Number (calculated based on priority)
- `completedAt`: Date
- `timestamps`: Object

### Announcement Model
- `title`: String (required)
- `message`: String (required)
- `author`: String (required)
- `priority`: String (Low/Medium/High)
- `isActive`: Boolean
- `expiresAt`: Date
- `timestamps`: Object

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js for security headers
- Input validation and sanitization

## Default Admin Account

The system comes with a default admin account:
- Username: `UserAdmin`
- Password: `Admin@Password`

## Development

The server includes:
- Hot reload with nodemon
- Detailed error logging
- Health check endpoint at `/api/health`

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Ensure MongoDB is accessible
3. Configure proper CORS origins
4. Use a strong JWT secret
5. Set up proper monitoring and logging