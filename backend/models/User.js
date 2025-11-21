const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  department: {
    type: String,
    enum: ['Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'HR', 'Social'],
    default: 'Web'
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Method to check password - simple plain text comparison
userSchema.methods.comparePassword = function(candidatePassword) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return candidatePassword === this.password;
};

// Method to get user profile without sensitive data
userSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    name: this.name,
    department: this.department,
    role: this.role,
    completedTasks: this.completedTasks,
    points: this.points,
    streak: this.streak,
    profilePicture: this.profilePicture,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);