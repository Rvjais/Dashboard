import React from 'react';
import { Link } from 'react-router-dom';
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
    <div
      style={{ width: isCollapsed ? '80px' : '256px' }}
      className="glass-effect flex flex-col border-r border-white/20 dark:border-gray-700/30 relative transition-all duration-300"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-5 top-6 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-smooth"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <SafeIcon icon={isCollapsed ? FiMenu : FiChevronLeft} className="w-5 h-5" />
      </button>

      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-200/30 dark:border-gray-700/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={logo}
              alt="Agency Hub Logo"
              className='h-12 flex-shrink-0'
            />
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="text-lg font-bold gradient-text whitespace-nowrap">Agency Hub</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mt-0.5">
                  {isAdmin ? 'Admin Panel' : 'Employee Dashboard'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && <ThemeToggle />}
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 rounded-2xl text-left transition-smooth ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? tab.label : ''}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap font-medium">
                    {tab.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
        <Link
          to="/client-enroll"
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-smooth no-underline font-medium`}
          title={isCollapsed ? 'Client Enrollment' : ''}
        >
          <SafeIcon icon={FiUserPlus} className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="whitespace-nowrap">
              Client Enrollment
            </span>
          )}
        </Link>
      </div>

      <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-smooth font-medium`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;