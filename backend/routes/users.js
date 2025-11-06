const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { department } = req.query;
    let filter = { role: 'employee' };
    
    if (department) {
      filter.department = department;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ points: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get departments list
router.get('/departments', auth, async (req, res) => {
  try {
    const departments = ['Web', 'SEO', 'Ads', 'Graphics', 'Accounts'];
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

module.exports = router;