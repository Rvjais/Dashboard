import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format, formatDistanceToNow, differenceInHours, differenceInMinutes } from 'date-fns';

const { FiEdit2, FiTrash2, FiFilter, FiSearch, FiClock, FiUser } = FiIcons;

const TaskTable = ({ tasks, onEdit, onDelete, onStatusUpdate, isAdmin, currentUser }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Check if current user can delete a task
  const canDeleteTask = (task) => {
    if (!currentUser) return false;
    // Admin can delete any task
    if (isAdmin) return true;
    // User can delete tasks they assigned
    return task.assignedBy === currentUser.name;
  };

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-smooth"
          />
        </div>
        <div className="relative sm:w-48">
          <SafeIcon icon={FiFilter} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-smooth"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="glass-effect rounded-3xl p-5 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1 mr-2">{task.title}</h3>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Edit task"
                >
                  <SafeIcon icon={FiEdit2} className="w-5 h-5" />
                </button>
                {canDeleteTask(task) && onDelete && (
                  <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Delete task"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>

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
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">Completed At</span>
                <div className="mt-1 text-sm text-green-600 dark:text-green-400">{formatTimestamp(task.completedAt)}</div>
              </div>
            )}
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
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
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      aria-label="Edit task"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </button>
                    {canDeleteTask(task) && onDelete && (
                      <button
                        onClick={() => onDelete(task._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete task"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;