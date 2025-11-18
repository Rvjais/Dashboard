import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format, formatDistanceToNow, differenceInHours, differenceInMinutes } from 'date-fns';

const { FiEdit2, FiTrash2, FiFilter, FiSearch, FiClock, FiUser } = FiIcons;

const TaskTable = ({ tasks, onEdit, onDelete, onStatusUpdate, isAdmin }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                         task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(taskId, { status: newStatus });
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4 px-4">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                >
                  <SafeIcon icon={FiEdit2} className="w-5 h-5" />
                </button>
                {isAdmin && onDelete && (
                  <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{task.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-500">Department</span>
                <div className="mt-1">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {task.department}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Priority</span>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Assigned To</span>
                <div className="mt-1 text-sm font-medium text-gray-900">{task.assignedTo}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Assigned By</span>
                <div className="mt-1 flex items-center text-sm text-gray-900">
                  <SafeIcon icon={FiUser} className="w-3 h-3 mr-1" />
                  {task.assignedBy}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-500">Assigned At</span>
                <div className="mt-1 text-sm text-gray-900">{formatTimestamp(task.assignedAt)}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Duration</span>
                <div className="mt-1 flex items-center text-sm text-gray-900">
                  <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                  {calculateDuration(task)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-500">Deadline</span>
                <div className="mt-1 text-sm text-gray-900">{format(new Date(task.deadline), 'MMM dd, yyyy')}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Status</span>
                <div className="mt-1">
                  {!isAdmin ? (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id || task.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border ${getStatusColor(task.status)} w-full`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {task.completedAt && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">Completed At</span>
                <div className="mt-1 text-sm text-green-600">{formatTimestamp(task.completedAt)}</div>
              </div>
            )}
          </motion.div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task, index) => (
              <motion.tr
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">{task.title}</div>
                    <div className="text-sm text-gray-500 truncate">{task.description}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {task.department}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.assignedTo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <SafeIcon icon={FiUser} className="w-3 h-3 mr-1 text-gray-400" />
                    {task.assignedBy}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {!isAdmin ? (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id || task.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(task.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                  {formatTimestamp(task.assignedAt)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <SafeIcon icon={FiClock} className="w-3 h-3 mr-1 text-gray-400" />
                    {calculateDuration(task)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(task.deadline), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </button>
                    {isAdmin && onDelete && (
                      <button
                        onClick={() => onDelete(task._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;