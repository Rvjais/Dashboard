import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiCheckCircle, FiClock, FiTrendingUp, FiUsers, FiBriefcase, FiCalendar, FiFilter, FiCamera } from 'react-icons/fi';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { format, differenceInHours, differenceInMinutes, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredStats, setFilteredStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchEmployeeProfile();
  }, [id]);

  useEffect(() => {
    if (filterType !== 'all') {
      fetchFilteredStats();
    } else {
      setFilteredStats(null);
    }
  }, [filterType, customStartDate, customEndDate, id]);

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeProfile(id);
      setProfileData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employee profile:', err);
      setError('Failed to load employee profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredStats = async () => {
    try {
      setLoadingStats(true);
      let startDate, endDate;

      // Calculate date range based on filter type
      const now = new Date();
      switch (filterType) {
        case 'today':
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case 'week':
          startDate = startOfWeek(now);
          endDate = endOfWeek(now);
          break;
        case 'month':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'custom':
          if (customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            endDate = new Date(customEndDate);
          } else {
            setLoadingStats(false);
            return;
          }
          break;
        default:
          setLoadingStats(false);
          return;
      }

      const filters = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };

      const data = await api.getEmployeeFilteredStats(id, filters);
      setFilteredStats(data);
    } catch (err) {
      console.error('Error fetching filtered stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPicture(true);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
          const response = await api.updateProfilePicture(base64String);

          // Update local state
          setProfileData({
            ...profileData,
            user: {
              ...profileData.user,
              profilePicture: base64String
            }
          });

          // Update user in localStorage
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            storedUser.profilePicture = base64String;
            localStorage.setItem('user', JSON.stringify(storedUser));
          }

          alert('Profile picture updated successfully!');
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          alert('Failed to upload profile picture: ' + error.message);
        } finally {
          setUploadingPicture(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
      setUploadingPicture(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, clients, tasks, taskStats, completionRate } = profileData;

  const getDepartmentColor = (department) => {
    const colors = {
      Web: 'blue',
      AI: 'purple',
      SEO: 'green',
      Ads: 'yellow',
      Graphics: 'pink',
      Accounts: 'indigo',
      Admin: 'red',
      HR: 'teal',
      Social: 'orange'
    };
    return colors[department] || 'gray';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const calculateDuration = (task) => {
    if (!task.assignedAt) return 'N/A';

    const startDate = new Date(task.assignedAt);
    const endDate = task.completedAt ? new Date(task.completedAt) : new Date();

    const hours = differenceInHours(endDate, startDate);
    const minutes = differenceInMinutes(endDate, startDate) % 60;

    if (hours < 24) {
      return `${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
  };

  const formatTimestamp = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-4 sm:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } transition-colors`}
        >
          <FiArrowLeft /> Back
        </motion.button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-lg p-4 sm:p-8 mb-6`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-gray-700"
                />
              ) : (
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-${getDepartmentColor(
                    user.department
                  )}-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Upload button - only show if viewing own profile */}
              {currentUser && currentUser.id === user._id && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPicture}
                    className={`absolute bottom-0 right-0 w-8 h-8 rounded-full ${
                      theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white flex items-center justify-center transition-colors ${
                      uploadingPicture ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Change profile picture"
                  >
                    {uploadingPicture ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <FiCamera className="text-sm" />
                    )}
                  </button>
                </>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {user.name}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-${getDepartmentColor(
                    user.department
                  )}-100 text-${getDepartmentColor(user.department)}-800`}
                >
                  {user.department}
                </span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FiUser className="inline mr-1" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                {user.points}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Points
              </div>
              <div className="mt-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                  {user.streak} Day Streak
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Total Tasks
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {taskStats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FiBriefcase className="text-blue-600 dark:text-blue-300 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Completed
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {taskStats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-600 dark:text-green-300 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Completion Rate
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {completionRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-purple-600 dark:text-purple-300 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Active Clients
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {clients.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <FiUsers className="text-orange-600 dark:text-orange-300 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Task Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-lg p-6 mb-6`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Task Performance Filters
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilterType('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'today'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterType('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'week'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilterType('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'month'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setFilterType('custom')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'custom'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Custom Date Range Inputs */}
          {filterType === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>
          )}

          {/* Filtered Statistics */}
          {filterType !== 'all' && (
            <div className="mt-6">
              {loadingStats ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                </div>
              ) : filteredStats ? (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Performance Summary
                    {filteredStats.dateRange.startDate && filteredStats.dateRange.endDate && (
                      <span className={`text-sm font-normal ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({format(new Date(filteredStats.dateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(filteredStats.dateRange.endDate), 'MMM dd, yyyy')})
                      </span>
                    )}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Completed Tasks Card */}
                    <div className={`p-5 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <FiCheckCircle className="text-blue-600 dark:text-blue-400 text-2xl" />
                        <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {filteredStats.filteredStats.completedTasksCount}
                        </span>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                        Tasks Completed
                      </p>
                    </div>

                    {/* Total Time Worked Card */}
                    <div className={`p-5 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-green-50 to-green-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <FiClock className="text-green-600 dark:text-green-400 text-2xl" />
                        <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {filteredStats.filteredStats.totalTimeWorked}
                        </span>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                        Total Time Worked
                      </p>
                    </div>

                    {/* Average Time Per Task Card */}
                    <div className={`p-5 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-purple-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <FiTrendingUp className="text-purple-600 dark:text-purple-400 text-2xl" />
                        <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {filteredStats.filteredStats.avgTimePerTask}
                        </span>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                        Avg. Time per Task
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No data available for the selected period
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Clients Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-lg p-6 mb-6`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Clients ({clients.length})
          </h2>
          {clients.length === 0 ? (
            <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No clients assigned yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  } transition-colors`}
                >
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {client.name}
                  </h3>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {client.industry && (
                      <p className="mb-1">
                        <span className="font-medium">Industry:</span> {client.industry}
                      </p>
                    )}
                    {client.email && (
                      <p className="mb-1">
                        <span className="font-medium">Email:</span> {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p>
                        <span className="font-medium">Phone:</span> {client.phone}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-lg p-4 sm:p-6`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Tasks ({tasks.length})
          </h2>
          {tasks.length === 0 ? (
            <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No tasks assigned yet
            </p>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-gray-750'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Priority</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Status</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Assigned By</span>
                        <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiUser className="inline mr-1" size={12} />
                          {task.assignedBy || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Duration</span>
                        <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiClock className="inline mr-1" size={12} />
                          {calculateDuration(task)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Assigned At</span>
                        <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatTimestamp(task.assignedAt)}
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Deadline</span>
                        <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {task.completedAt && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Completed At</span>
                        <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                          {formatTimestamp(task.completedAt)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Task
                      </th>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Assigned By
                      </th>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Priority
                      </th>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Status
                      </th>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Assigned At
                      </th>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Duration
                      </th>
                      <th className={`text-left p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr
                        key={task._id}
                        className={`border-b ${
                          theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <td className="p-3">
                          <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {task.title}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </div>
                        </td>
                        <td className={`p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="flex items-center">
                            <FiUser className="mr-1" size={14} />
                            {task.assignedBy || 'N/A'}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className={`p-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatTimestamp(task.assignedAt)}
                        </td>
                        <td className={`p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="flex items-center">
                            <FiClock className="mr-1" size={14} />
                            {calculateDuration(task)}
                          </div>
                        </td>
                        <td className={`p-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {new Date(task.deadline).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
