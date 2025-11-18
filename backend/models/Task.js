const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'Admin', 'HR', 'Social']
  },
  assignedBy: {
    type: String,
    required: [true, 'Assigned by is required'],
    trim: true
  },
  assignedTo: {
    type: String,
    required: [true, 'Assigned to is required'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  points: {
    type: Number,
    default: function() {
      // Calculate points based on priority
      switch (this.priority) {
        case 'High': return 30;
        case 'Medium': return 20;
        case 'Low': return 10;
        default: return 10;
      }
    }
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Update timestamps when status changes
taskSchema.pre('save', function(next) {
  // Track when task was started
  if (this.isModified('status') && this.status === 'In Progress' && !this.startedAt) {
    this.startedAt = new Date();
  }

  // Track when task was completed
  if (this.isModified('status') && this.status === 'Completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);