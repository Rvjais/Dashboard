const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle admin user (hardcoded)
    if (decoded.id === 'admin-user') {
      req.user = {
        _id: 'admin-user',
        id: 'admin-user',
        name: 'Admin',
        role: 'admin',
        department: 'Admin',
        toProfileJSON: function() {
          return {
            id: this._id,
            name: this.name,
            role: this.role,
            department: this.department,
            completedTasks: 0,
            points: 0,
            streak: 0
          };
        }
      };
      return next();
    }

    // Handle regular employee
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found. Token is not valid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);

    // Provide specific error messages for different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }

    res.status(401).json({ error: 'Authentication failed.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
  next();
};

module.exports = { auth, adminAuth };