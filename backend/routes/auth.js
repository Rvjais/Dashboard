const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Admin@12345'
};

// Register new user (employees only)
router.post('/register', async (req, res) => {
  try {
    const { name, phone, department, password } = req.body;

    // Validate input
    if (!name || !phone || !department || !password) {
      return res.status(400).json({ error: 'Name, phone, department, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone number' });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      department,
      password, // Password stored as plain text
      role: 'employee'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toProfileJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user (employees and admin)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if login is for admin
    if (username.toLowerCase() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { id: 'admin-user', role: 'admin', username: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: 'admin-user',
          name: 'Admin',
          role: 'admin',
          department: 'Admin',
          completedTasks: 0,
          points: 0,
          streak: 0
        }
      });
    }

    // Find user by name or phone (employees only)
    const user = await User.findOne({
      $or: [{ name: username }, { phone: username }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password using the comparePassword method
    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login (use updateOne to avoid triggering password hash)
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toProfileJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  // Handle admin user
  if (req.user.role === 'admin' && req.user.id === 'admin-user') {
    return res.json({
      user: {
        id: 'admin-user',
        name: 'Admin',
        role: 'admin',
        department: 'Admin',
        completedTasks: 0,
        points: 0,
        streak: 0
      }
    });
  }

  // Handle regular employee
  res.json({
    user: req.user.toProfileJSON()
  });
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, department } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (department && req.user.role === 'admin') updates.department = department;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: user.toProfileJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Upload/Update profile picture
router.put('/profile-picture', auth, async (req, res) => {
  try {
    // Admin users cannot update profile picture
    if (req.user.role === 'admin' && req.user.id === 'admin-user') {
      return res.status(403).json({ error: 'Admin cannot update profile picture' });
    }

    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ error: 'Profile picture data is required' });
    }

    // Validate base64 format (should start with data:image/)
    if (!profilePicture.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format. Must be a base64 encoded image' });
    }

    // Optional: Check image size (base64 string length)
    // Each base64 character represents ~6 bits, so 4 chars = 3 bytes
    // 5MB limit = ~6.67M chars
    const maxSize = 6670000; // ~5MB
    if (profilePicture.length > maxSize) {
      return res.status(400).json({ error: 'Image too large. Maximum size is 5MB' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePicture } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile picture updated successfully',
      user: user.toProfileJSON()
    });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({ error: 'Profile picture update failed' });
  }
});

module.exports = router;