const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const Client = require('../models/Client');
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

// Get departments list (public - no auth required)
router.get('/departments', async (req, res) => {
  try {
    const departments = ['Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'Admin', 'HR', 'Social'];
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Get employees by department (all authenticated users can access)
router.get('/by-department/:department', auth, async (req, res) => {
  try {
    const { department } = req.params;

    const users = await User.find({
      role: 'employee',
      department: department
    })
      .select('-password')
      .sort({ points: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users by department error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all employees (all authenticated users can access)
router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ points: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee profile with stats, clients, and tasks
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get user details
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's clients
    const clients = await Client.find({ assignedEmployee: id });

    // Get user's tasks
    const tasks = await Task.find({ assignedTo: user.name })
      .sort({ createdAt: -1 });

    // Calculate task statistics
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      highPriority: tasks.filter(t => t.priority === 'High').length
    };

    // Calculate completion rate
    const completionRate = taskStats.total > 0
      ? ((taskStats.completed / taskStats.total) * 100).toFixed(1)
      : 0;

    res.json({
      user: user.toProfileJSON(),
      clients,
      tasks,
      taskStats,
      completionRate
    });
  } catch (error) {
    console.error('Get employee profile error:', error);
    res.status(500).json({ error: 'Failed to fetch employee profile' });
  }
});

module.exports = router;