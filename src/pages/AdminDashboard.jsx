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
import AnnouncementModal from '../components/AnnouncementModal';
import DepartmentChart from '../components/DepartmentChart';
import Leaderboard from '../components/Leaderboard';

const { 
  FiUsers, FiCheckCircle, FiClock, FiAlertTriangle, 
  FiPlus, FiBell, FiTrendingUp, FiActivity 
} = FiIcons;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
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
      await api.createTask(taskData);
      fetchDashboardData();
      setShowTaskModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task: ' + error.message);
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

  const handleTaskDelete = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleAnnouncementCreate = async (announcementData) => {
    try {
      await api.createAnnouncement(announcementData);
      fetchDashboardData();
      setShowAnnouncementModal(false);
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={FiActivity}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={FiCheckCircle}
          color="green"
          trend="+8%"
        />
        <StatsCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={FiClock}
          color="yellow"
          trend="+15%"
        />
        <StatsCard
          title="High Priority"
          value={stats?.highPriorityTasks || 0}
          icon={FiAlertTriangle}
          color="red"
          trend="-3%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Department Performance
          </h3>
          <DepartmentChart data={stats?.departmentStats || []} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Announcements
            </h3>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(announcement => (
              <div key={announcement.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{announcement.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Management</h2>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>
      <TaskTable
        tasks={tasks}
        onEdit={setEditingTask}
        onDelete={handleTaskDelete}
        isAdmin={true}
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={true} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
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
            {activeTab === 'tasks' && renderTasks()}
            {activeTab === 'announcements' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Announcements</h2>
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    New Announcement
                  </button>
                </div>
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{announcement.message}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </motion.div>
        </main>
      </div>

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleTaskCreate}
          isAdmin={true}
        />
      )}

      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(updates) => handleTaskUpdate(editingTask.id, updates)}
          task={editingTask}
          isAdmin={true}
        />
      )}

      {showAnnouncementModal && (
        <AnnouncementModal
          isOpen={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
          onSubmit={handleAnnouncementCreate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;