import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { api } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const { FiUsers, FiCheckCircle, FiClock, FiAlertTriangle, FiX, FiArrowRight, FiTrendingUp } = FiIcons;

const DepartmentOverview = ({ currentUser }) => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    fetchDepartmentStats();
  }, []);

  const fetchDepartmentStats = async () => {
    try {
      // Get all tasks and calculate stats per department
      const tasks = await api.getTasks();

      // Group tasks by department
      const departments = ['Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'Admin', 'HR', 'Social'];
      const stats = departments.map(dept => {
        const deptTasks = tasks.filter(task => task.department === dept);
        return {
          department: dept,
          total: deptTasks.length,
          completed: deptTasks.filter(t => t.status === 'Completed').length,
          pending: deptTasks.filter(t => t.status === 'Pending').length
        };
      });

      setDepartmentStats(stats);
    } catch (error) {
      console.error('Failed to fetch department stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = async (department) => {
    setSelectedDepartment(department);
    setLoadingMembers(true);
    try {
      const members = await api.getEmployeesByDepartment(department);
      setDepartmentMembers(members);
    } catch (error) {
      console.error('Failed to fetch department members:', error);
      setDepartmentMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedDepartment(null);
    setDepartmentMembers([]);
  };

  const handleViewProfile = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
          Department Overview
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          Click on any department to view its members and their profiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentStats.map((dept, index) => (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleDepartmentClick(dept.department)}
              className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer transform hover:scale-105 ${
                dept.department === currentUser.department
                  ? theme === 'dark'
                    ? 'border-blue-600 bg-blue-900/30'
                    : 'border-blue-200 bg-blue-50'
                  : theme === 'dark'
                  ? 'border-gray-700 bg-gray-750 hover:border-gray-600'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {dept.department}
                </h3>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  dept.department === currentUser.department
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <SafeIcon icon={FiUsers} className="w-5 h-5" />
                </div>
              </div>

              {dept.department === currentUser.department && (
                <div className="mb-3 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium rounded-full inline-block">
                  Your Department
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Completed</span>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">{dept.completed}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiClock} className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pending</span>
                  </div>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">{dept.pending}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Tasks</span>
                  </div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{dept.total}</span>
                </div>
              </div>

              <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Completion Rate</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {dept.total > 0 ? Math.round((dept.completed / dept.total) * 100) : 0}%
                  </span>
                </div>
                <div className={`mt-2 w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full transition-all ${
                      dept.department === currentUser.department
                        ? 'bg-blue-600'
                        : theme === 'dark'
                        ? 'bg-gray-500'
                        : 'bg-gray-400'
                    }`}
                    style={{
                      width: `${dept.total > 0 ? (dept.completed / dept.total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Department Members Modal */}
      <AnimatePresence>
        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedDepartment} Department
                    </h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {departmentMembers.length} {departmentMembers.length === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : departmentMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <SafeIcon icon={FiUsers} className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      No members in this department yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departmentMembers.map((member) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${
                          theme === 'dark'
                            ? 'border-gray-700 hover:border-blue-600 bg-gray-750'
                            : 'border-gray-200 hover:border-blue-400 bg-gray-50'
                        } transition-all cursor-pointer group`}
                        onClick={() => handleViewProfile(member._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {member.name}
                              </h3>
                              <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className="flex items-center gap-2">
                                  <SafeIcon icon={FiCheckCircle} className="w-3 h-3" />
                                  <span>{member.completedTasks} tasks completed</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <SafeIcon icon={FiTrendingUp} className="w-3 h-3" />
                                  <span>{member.points} points</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <SafeIcon
                            icon={FiArrowRight}
                            className={`w-5 h-5 ${
                              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            } group-hover:text-blue-500 transition-colors`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentOverview;