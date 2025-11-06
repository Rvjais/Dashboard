// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'UserAdmin',
    phone: 'Admin@Password',
    department: 'Admin',
    role: 'admin',
    completedTasks: 45,
    points: 1250,
    streak: 15
  },
  {
    id: 2,
    name: 'John Smith',
    phone: '1234567890',
    department: 'Web',
    role: 'employee',
    completedTasks: 38,
    points: 980,
    streak: 7
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    phone: '0987654321',
    department: 'SEO',
    role: 'employee',
    completedTasks: 42,
    points: 1100,
    streak: 12
  },
  {
    id: 4,
    name: 'Mike Davis',
    phone: '5555555555',
    department: 'Graphics',
    role: 'employee',
    completedTasks: 35,
    points: 875,
    streak: 5
  },
  {
    id: 5,
    name: 'Emily Wilson',
    phone: '1111111111',
    department: 'Ads',
    role: 'employee',
    completedTasks: 40,
    points: 1020,
    streak: 10
  },
  {
    id: 6,
    name: 'David Brown',
    phone: '2222222222',
    department: 'Accounts',
    role: 'employee',
    completedTasks: 33,
    points: 820,
    streak: 3
  }
];

let mockTasks = [
  {
    id: 1,
    title: 'Website Redesign',
    description: 'Complete redesign of the company website',
    department: 'Web',
    assignedBy: 'UserAdmin',
    assignedTo: 'John Smith',
    deadline: new Date('2024-12-25'),
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date('2024-12-01')
  },
  {
    id: 2,
    title: 'SEO Optimization',
    description: 'Optimize website for search engines',
    department: 'SEO',
    assignedBy: 'UserAdmin',
    assignedTo: 'Sarah Johnson',
    deadline: new Date('2024-12-30'),
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date('2024-12-02')
  },
  {
    id: 3,
    title: 'Logo Design',
    description: 'Create new company logo',
    department: 'Graphics',
    assignedBy: 'UserAdmin',
    assignedTo: 'Mike Davis',
    deadline: new Date('2024-12-20'),
    priority: 'High',
    status: 'Completed',
    createdAt: new Date('2024-11-15')
  }
];

let mockAnnouncements = [
  {
    id: 1,
    title: 'Team Meeting',
    message: 'All hands meeting scheduled for Friday at 2 PM',
    date: new Date('2024-12-10')
  },
  {
    id: 2,
    title: 'Holiday Schedule',
    message: 'Office will be closed from Dec 24-26 for holidays',
    date: new Date('2024-12-05')
  }
];

const departments = ['Web', 'SEO', 'Ads', 'Graphics', 'Accounts'];

export const mockAPI = {
  // Authentication
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => 
      u.name === credentials.username && u.phone === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.name === userData.name);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      phone: userData.phone,
      department: userData.department,
      role: 'employee',
      completedTasks: 0,
      points: 0,
      streak: 0
    };
    
    mockUsers.push(newUser);
    return newUser;
  },

  // Tasks
  getTasks: async (userId, userRole, userDepartment) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userRole === 'admin') {
      return mockTasks;
    }
    
    return mockTasks.filter(task => 
      task.department === userDepartment || task.assignedTo === mockUsers.find(u => u.id === userId)?.name
    );
  },

  createTask: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTask = {
      id: mockTasks.length + 1,
      ...taskData,
      createdAt: new Date()
    };
    
    mockTasks.push(newTask);
    
    // Update user stats if task is completed
    if (taskData.status === 'Completed') {
      const user = mockUsers.find(u => u.name === taskData.assignedTo);
      if (user) {
        user.completedTasks += 1;
        user.points += calculatePoints(taskData.priority);
        user.streak = user.streak + 1;
      }
    }
    
    return newTask;
  },

  updateTask: async (taskId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const oldTask = mockTasks[taskIndex];
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    
    // Update user stats if task status changed to completed
    if (oldTask.status !== 'Completed' && updates.status === 'Completed') {
      const user = mockUsers.find(u => u.name === oldTask.assignedTo);
      if (user) {
        user.completedTasks += 1;
        user.points += calculatePoints(oldTask.priority);
        user.streak = user.streak + 1;
      }
    }
    
    return mockTasks[taskIndex];
  },

  deleteTask: async (taskId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const task = mockTasks.find(t => t.id === taskId);
    mockTasks = mockTasks.filter(task => task.id !== taskId);
    
    // Update user stats if task was completed
    if (task && task.status === 'Completed') {
      const user = mockUsers.find(u => u.name === task.assignedTo);
      if (user) {
        user.completedTasks = Math.max(0, user.completedTasks - 1);
        user.points = Math.max(0, user.points - calculatePoints(task.priority));
      }
    }
    
    return true;
  },

  // Announcements
  getAnnouncements: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAnnouncements;
  },

  createAnnouncement: async (announcementData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAnnouncement = {
      id: mockAnnouncements.length + 1,
      ...announcementData,
      date: new Date()
    };
    
    mockAnnouncements.push(newAnnouncement);
    return newAnnouncement;
  },

  // Departments
  getDepartments: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return departments;
  },

  // Users
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(user => user.role === 'employee');
  },

  // Leaderboard
  getLeaderboard: async (timeFilter = 'all') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter based on time (mock implementation)
    let filteredUsers = [...mockUsers];
    
    if (timeFilter === 'week') {
      // Mock: Reduce completed tasks for week filter
      filteredUsers = filteredUsers.map(user => ({
        ...user,
        completedTasks: Math.floor(user.completedTasks * 0.3),
        points: Math.floor(user.points * 0.3)
      }));
    } else if (timeFilter === 'month') {
      // Mock: Reduce completed tasks for month filter
      filteredUsers = filteredUsers.map(user => ({
        ...user,
        completedTasks: Math.floor(user.completedTasks * 0.6),
        points: Math.floor(user.points * 0.6)
      }));
    }
    
    return filteredUsers
      .sort((a, b) => b.points - a.points)
      .slice(0, 10); // Top 10
  },

  // Dashboard stats
  getDashboardStats: async (userRole, userDepartment) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userRole === 'admin') {
      const stats = {
        totalTasks: mockTasks.length,
        completedTasks: mockTasks.filter(t => t.status === 'Completed').length,
        pendingTasks: mockTasks.filter(t => t.status === 'Pending').length,
        inProgressTasks: mockTasks.filter(t => t.status === 'In Progress').length,
        highPriorityTasks: mockTasks.filter(t => t.priority === 'High').length,
        departmentStats: departments.map(dept => ({
          department: dept,
          total: mockTasks.filter(t => t.department === dept).length,
          completed: mockTasks.filter(t => t.department === dept && t.status === 'Completed').length,
          pending: mockTasks.filter(t => t.department === dept && t.status === 'Pending').length
        }))
      };
      return stats;
    } else {
      const userTasks = mockTasks.filter(t => t.department === userDepartment);
      const stats = {
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(t => t.status === 'Completed').length,
        pendingTasks: userTasks.filter(t => t.status === 'Pending').length,
        inProgressTasks: userTasks.filter(t => t.status === 'In Progress').length,
        highPriorityTasks: userTasks.filter(t => t.priority === 'High').length
      };
      return stats;
    }
  }
};

// Helper function to calculate points based on priority
function calculatePoints(priority) {
  switch (priority) {
    case 'High': return 30;
    case 'Medium': return 20;
    case 'Low': return 10;
    default: return 10;
  }
}