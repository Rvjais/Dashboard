import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const {
  FiHome, FiCheckSquare, FiBell, FiUsers, FiLogOut, FiUser, FiTrophy, FiUserPlus, FiMenu, FiChevronLeft
} = FiIcons;

const Sidebar = ({ activeTab, setActiveTab, isAdmin, isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
  };

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'tasks', label: 'Tasks', icon: FiCheckSquare },
    { id: 'announcements', label: 'Announcements', icon: FiBell },
    { id: 'leaderboard', label: 'Leaderboard', icon: FiTrophy }
  ];

  const employeeTabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'my-tasks', label: 'My Tasks', icon: FiCheckSquare },
    { id: 'departments', label: 'Departments', icon: FiUsers },
    { id: 'leaderboard', label: 'Leaderboard', icon: FiTrophy },
   
  ];

  const tabs = isAdmin ? adminTabs : employeeTabs;

  return (
    <motion.div
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-gray-800 shadow-lg flex flex-col border-r border-gray-200 dark:border-gray-700 relative"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
      >
        <SafeIcon icon={isCollapsed ? FiMenu : FiChevronLeft} className="w-4 h-4" />
      </button>

      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={logo} alt="Agency Hub Logo" className='h-12 flex-shrink-0' />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">Agency Hub</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {isAdmin ? 'Admin Panel' : 'Employee Dashboard'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isCollapsed && <ThemeToggle />}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {tabs.map(tab => (
            <li key={tab.id}>
              <motion.button
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? tab.label : ''}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/client-enroll"
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors no-underline`}
          title={isCollapsed ? 'Client Enrollment' : ''}
        >
          <SafeIcon icon={FiUserPlus} className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                Client Enrollment
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;