import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const {
  FiHome, FiCheckSquare, FiBell, FiUsers, FiLogOut, FiUser, FiTrophy, FiUserPlus, FiMenu, FiChevronLeft, FiBriefcase
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
    { id: 'clients', label: 'Clients', icon: FiBriefcase },
    { id: 'departments', label: 'Departments', icon: FiUsers },
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
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="glass-effect flex flex-col border-r border-white/20 dark:border-gray-700/30 relative"
    >
      {/* Toggle Button - Minimal Modern */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-smooth"
      >
        <SafeIcon icon={isCollapsed ? FiMenu : FiChevronLeft} className="w-4 h-4" />
      </motion.button>

      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-200/30 dark:border-gray-700/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.img
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              src={logo}
              alt="Agency Hub Logo"
              className='h-12 flex-shrink-0'
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-lg font-bold gradient-text whitespace-nowrap">Agency Hub</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mt-0.5">
                    {isAdmin ? 'Admin Panel' : 'Employee Dashboard'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isCollapsed && <ThemeToggle />}
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {tabs.map((tab, index) => (
            <motion.li
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 rounded-2xl text-left transition-smooth ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
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
                      className="whitespace-nowrap font-medium"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/client-enroll"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-smooth no-underline font-medium`}
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
        </motion.div>
      </div>

      <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-smooth font-medium`}
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