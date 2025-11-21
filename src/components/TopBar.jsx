import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBell, FiUser, FiChevronDown } = FiIcons;

const TopBar = ({ user, announcements }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass-effect border-b border-white/20 dark:border-gray-700/30"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Welcome Section - Minimal & Modern */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold gradient-text truncate">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate font-medium">
              {user.role === 'admin' ? 'Admin Dashboard' : `${user.department} Department`}
            </p>
          </motion.div>

          {/* Action Buttons - Minimal Design */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 sm:p-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-smooth hover-lift border border-gray-200/50 dark:border-gray-700/50"
              >
                <SafeIcon icon={FiBell} className="w-5 h-5" />
                {announcements.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse"
                  >
                    {announcements.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown - Modern Minimal */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 glass-effect rounded-3xl overflow-hidden z-50 border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Stay updated</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {announcements.length > 0 ? (
                        announcements.map((announcement, index) => (
                          <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 border-b border-gray-100 dark:border-gray-700/30 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-smooth cursor-pointer"
                          >
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{announcement.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{announcement.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                              {new Date(announcement.date).toLocaleDateString()}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <SafeIcon icon={FiBell} className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Button - Minimal & Modern */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/employee/${user.id}`)}
              className="group flex items-center gap-3 px-3 py-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-smooth hover-lift border border-gray-200/50 dark:border-gray-700/50"
              title="View Profile"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-indigo-500 transition-all"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
              <SafeIcon icon={FiChevronDown} className="hidden md:block w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;