import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const { 
  FiHome, FiCheckSquare, FiBell, FiUsers, FiLogOut, FiUser, FiTrophy, FiUserPlus 
} = FiIcons;

const Sidebar = ({ activeTab, setActiveTab, isAdmin }) => {
  const { logout } = useAuth();

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
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-white" />
            </div> */}
            <img src={logo} alt="Agency Hub Logo" className='h-12' />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Agency Hub</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAdmin ? 'Admin Panel' : 'Employee Dashboard'}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {tabs.map(tab => (
            <li key={tab.id}>
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5" />
                {tab.label}
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

 <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link to="/client-enroll" className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors no-underline">
          <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
          Client Enrollment
        </Link>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5" />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;