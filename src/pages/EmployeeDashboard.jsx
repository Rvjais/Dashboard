import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import DepartmentOverview from '../components/DepartmentOverview';
import Leaderboard from '../components/Leaderboard';

const { 
  FiActivity, FiCheckCircle, FiClock, FiAlertTriangle, FiPlus 
} = FiIcons;

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData, announcementsData] = await Promise.all([
        api.getTasks(),
        api.getTaskStats(),
        api.getAnnouncements()
      ]);
      
      setTasks(tasksData);
      setStats(statsData);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      const newTaskData = {
        ...taskData,
        status: 'Pending',
        assignedTo: user.name,
        assignedBy: user.name,
        department: user.department
      };
      await api.createTask(newTaskData);
      fetchDashboardData();
      setShowTaskModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await api.updateTask(taskId, updates);
      fetchDashboardData();
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task: ' + error.message);
    }
  };

  const myTasks = tasks.filter(task => task.assignedTo === user.name);
  const departmentTasks = tasks.filter(task => task.department === user.department);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Tasks"
          value={myTasks.length}
          icon={FiActivity}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={myTasks.filter(t => t.status === 'Completed').length}
          icon={FiCheckCircle}
          color="green"
        />
        <StatsCard
          title="In Progress"
          value={myTasks.filter(t => t.status === 'In Progress').length}
          icon={FiClock}
          color="yellow"
        />
        <StatsCard
          title="High Priority"
          value={myTasks.filter(t => t.priority === 'High').length}
          icon={FiAlertTriangle}
          color="red"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {user.department} Department Tasks
          </h3>
          <div className="space-y-3">
            {departmentTasks.slice(0, 5).map(task => (
              <div key={task._id || task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to: {task.assignedTo}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Completed' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : task.status === 'In Progress'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Announcements
          </h3>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(announcement => (
              <div key={announcement._id || announcement.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-400">{announcement.title}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{announcement.message}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyTasks = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Tasks</h2>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            Create Personal Task
          </button>
        </div>
      </div>
      <TaskTable
        tasks={myTasks}
        onEdit={setEditingTask}
        onStatusUpdate={handleTaskUpdate}
        isAdmin={false}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={false} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} announcements={announcements} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'my-tasks' && renderMyTasks()}
            {activeTab === 'departments' && <DepartmentOverview currentUser={user} />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </motion.div>
        </main>
      </div>

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleTaskCreate}
          isAdmin={false}
        />
      )}

      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(updates) => handleTaskUpdate(editingTask._id || editingTask.id, updates)}
          task={editingTask}
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;