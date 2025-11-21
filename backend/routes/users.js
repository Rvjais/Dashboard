const express = require('express');
const mongoose = require('mongoose');
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

    // Get user details - check if id is a valid ObjectId or treat it as a username
    let user;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      user = await User.findById(id).select('-password');
    } else {
      // Try to find by name if not a valid ObjectId
      user = await User.findOne({ name: id }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's clients (use the actual user._id from the found user)
    const clients = await Client.find({ assignedEmployee: user._id });

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

// Get employee filtered statistics with date ranges
router.get('/profile/:id/stats', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Get user details - check if id is a valid ObjectId or treat it as a username
    let user;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      user = await User.findById(id).select('-password');
    } else {
      // Try to find by name if not a valid ObjectId
      user = await User.findOne({ name: id }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.completedAt = {};
      if (startDate) {
        dateFilter.completedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day (23:59:59)
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        dateFilter.completedAt.$lte = endOfDay;
      }
    }

    // Get all tasks for overall stats
    const allTasks = await Task.find({ assignedTo: user.name });

    // Get completed tasks within date range
    const completedTasksFilter = {
      assignedTo: user.name,
      status: 'Completed',
      ...dateFilter
    };
    const completedTasks = await Task.find(completedTasksFilter);

    // Calculate total hours worked (from assignedAt to completedAt)
    let totalMinutes = 0;
    completedTasks.forEach(task => {
      if (task.assignedAt && task.completedAt) {
        const start = new Date(task.assignedAt);
        const end = new Date(task.completedAt);
        const diffMs = end - start;
        const minutes = Math.floor(diffMs / (1000 * 60));
        totalMinutes += minutes;
      }
    });

    // Convert to hours and minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const totalDays = Math.floor(totalHours / 24);
    const hoursAfterDays = totalHours % 24;

    // Format total time worked
    let totalTimeWorked = '';
    if (totalDays > 0) {
      totalTimeWorked = `${totalDays}d ${hoursAfterDays}h ${remainingMinutes}m`;
    } else if (totalHours > 0) {
      totalTimeWorked = `${totalHours}h ${remainingMinutes}m`;
    } else {
      totalTimeWorked = `${remainingMinutes}m`;
    }

    // Calculate average time per task
    let avgTimePerTask = '';
    if (completedTasks.length > 0) {
      const avgMinutes = Math.floor(totalMinutes / completedTasks.length);
      const avgHours = Math.floor(avgMinutes / 60);
      const avgMins = avgMinutes % 60;
      if (avgHours > 0) {
        avgTimePerTask = `${avgHours}h ${avgMins}m`;
      } else {
        avgTimePerTask = `${avgMins}m`;
      }
    } else {
      avgTimePerTask = '0m';
    }

    // Overall task statistics
    const overallStats = {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'Completed').length,
      inProgress: allTasks.filter(t => t.status === 'In Progress').length,
      pending: allTasks.filter(t => t.status === 'Pending').length
    };

    res.json({
      filteredStats: {
        completedTasksCount: completedTasks.length,
        totalTimeWorked,
        totalMinutes,
        totalHours,
        totalDays,
        avgTimePerTask,
        tasks: completedTasks
      },
      overallStats,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    console.error('Get employee filtered stats error:', error);
    res.status(500).json({ error: 'Failed to fetch employee statistics' });
  }
});

module.exports = router;