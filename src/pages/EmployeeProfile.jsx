import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiCheckCircle, FiClock, FiTrendingUp, FiUsers, FiBriefcase } from 'react-icons/fi';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeProfile();
  }, [id]);

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
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-${getDepartmentColor(
                user.department
              )}-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold`}
            >
              {user.name.charAt(0).toUpperCase()}
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
