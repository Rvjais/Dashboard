// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, headers = {} } = options;

  const token = localStorage.getItem('token');
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized (token expired or invalid)
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized - please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

// Helper function for public API calls (no auth required)
const publicApiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, headers = {} } = options;
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  // ==================== AUTHENTICATION ====================
  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (userData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: userData
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  getCurrentUser: async () => {
    return await apiCall('/auth/me', {
      method: 'GET'
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ==================== TASKS ====================
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);

    const queryString = params.toString();
    return await apiCall(`/tasks${queryString ? '?' + queryString : ''}`, {
      method: 'GET'
    });
  },

  createTask: async (taskData) => {
    return await apiCall('/tasks', {
      method: 'POST',
      body: taskData
    });
  },

  updateTask: async (taskId, updates) => {
    return await apiCall(`/tasks/${taskId}`, {
      method: 'PUT',
      body: updates
    });
  },

  deleteTask: async (taskId) => {
    return await apiCall(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  },

  getTaskStats: async () => {
    return await apiCall('/tasks/stats/overview', {
      method: 'GET'
    });
  },

  // ==================== ANNOUNCEMENTS ====================
  getAnnouncements: async () => {
    return await apiCall('/announcements', {
      method: 'GET'
    });
  },

  createAnnouncement: async (announcementData) => {
    return await apiCall('/announcements', {
      method: 'POST',
      body: announcementData
    });
  },

  updateAnnouncement: async (announcementId, updates) => {
    return await apiCall(`/announcements/${announcementId}`, {
      method: 'PUT',
      body: updates
    });
  },

  deleteAnnouncement: async (announcementId) => {
    return await apiCall(`/announcements/${announcementId}`, {
      method: 'DELETE'
    });
  },

  // ==================== USERS ====================
  getUsers: async (department = '') => {
    const endpoint = department ? `/users?department=${department}` : '/users';
    return await apiCall(endpoint, {
      method: 'GET'
    });
  },

  getDepartments: async () => {
    return await publicApiCall('/users/departments', {
      method: 'GET'
    });
  },

  // ==================== LEADERBOARD ====================
  getLeaderboard: async (timeFilter = 'all') => {
    return await apiCall(`/leaderboard?timeFilter=${timeFilter}`, {
      method: 'GET'
    });
  },

  // ==================== HEALTH CHECK ====================
  healthCheck: async () => {
    try {
      return await apiCall('/health', {
        method: 'GET'
      });
    } catch (error) {
      return { status: 'ERROR' };
    }
  }
};
