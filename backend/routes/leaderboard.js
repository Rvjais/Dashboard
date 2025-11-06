const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get leaderboard
router.get('/', auth, async (req, res) => {
  try {
    const { timeFilter = 'all' } = req.query;
    
    let dateFilter = {};
    if (timeFilter === 'week') {
      dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeFilter === 'month') {
      dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    // Get task completion stats for time filter
    const taskStats = await Task.aggregate([
      { $match: { status: 'Completed', ...dateFilter } },
      {
        $group: {
          _id: '$assignedTo',
          completedTasks: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      }
    ]);

    // Create a map for quick lookup
    const statsMap = {};
    taskStats.forEach(stat => {
      statsMap[stat._id] = {
        completedTasks: stat.completedTasks,
        points: stat.totalPoints
      };
    });

    // Get all users and merge with stats
    const users = await User.find({ role: 'employee' })
      .select('-password')
      .lean();

    const leaderboard = users.map(user => ({
      ...user,
      completedTasks: statsMap[user.name]?.completedTasks || 0,
      points: statsMap[user.name]?.points || 0
    })).sort((a, b) => b.points - a.points);

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;