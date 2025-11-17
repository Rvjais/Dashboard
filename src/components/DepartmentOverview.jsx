import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { api } from '../services/api';

const { FiUsers, FiCheckCircle, FiClock, FiAlertTriangle } = FiIcons;

const DepartmentOverview = ({ currentUser }) => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentStats();
  }, []);

  const fetchDepartmentStats = async () => {
    try {
      // Get all tasks and calculate stats per department
      const tasks = await api.getTasks();

      // Group tasks by department
      const departments = ['Web', 'AI', 'SEO', 'Ads', 'Graphics', 'Accounts', 'Admin', 'HR'];
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Overview</h2>
        <p className="text-gray-600 mb-6">
          View progress and statistics across all departments. This is a read-only view for department members.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentStats.map((dept, index) => (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                dept.department === currentUser.department
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {dept.department}
                </h3>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  dept.department === currentUser.department
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <SafeIcon icon={FiUsers} className="w-5 h-5" />
                </div>
              </div>

              {dept.department === currentUser.department && (
                <div className="mb-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full inline-block">
                  Your Department
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold text-green-600">{dept.completed}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiClock} className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="font-semibold text-yellow-600">{dept.pending}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Tasks</span>
                  </div>
                  <span className="font-semibold text-blue-600">{dept.total}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">
                    {dept.total > 0 ? Math.round((dept.completed / dept.total) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      dept.department === currentUser.department
                        ? 'bg-blue-600'
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
    </div>
  );
};

export default DepartmentOverview;