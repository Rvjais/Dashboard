const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all tasks (with filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { department, status, priority, assignedTo } = req.query;
    let filter = {};

    // If user is not admin, only show tasks from their department or assigned to them
    if (req.user.role !== 'admin') {
      filter.$or = [
        { department: req.user.department },
        { assignedTo: req.user.name }
      ];
    }

    // Apply additional filters
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task (now available to all authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      assignedBy: req.user.name
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.name) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const oldStatus = task.status;
    const updates = req.body;

    // Update task
    Object.assign(task, updates);
    await task.save();

    // Update user stats if task was completed
    if (oldStatus !== 'Completed' && task.status === 'Completed') {
      await User.findOneAndUpdate(
        { name: task.assignedTo },
        {
          $inc: { 
            completedTasks: 1, 
            points: task.points,
            streak: 1
          }
        }
      );
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permissions
    // Admin can delete any task
    // User can only delete tasks they assigned (assignedBy === user.name)
    const isAdmin = req.user.role === 'admin';
    const isTaskAssigner = task.assignedBy === req.user.name;

    if (!isAdmin && !isTaskAssigner) {
      return res.status(403).json({
        error: 'Not authorized to delete this task. Only the person who assigned the task or an admin can delete it.'
      });
    }

    // Update user stats if task was completed
    if (task.status === 'Completed') {
      await User.findOneAndUpdate(
        { name: task.assignedTo },
        {
          $inc: {
            completedTasks: -1,
            points: -task.points
          }
        }
      );
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get task statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    let matchFilter = {};

    // If user is not admin, only show stats from their department
    if (req.user.role !== 'admin') {
      matchFilter.department = req.user.department;
    }

    const stats = await Task.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          highPriorityTasks: {
            $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      highPriorityTasks: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
});

module.exports = router;