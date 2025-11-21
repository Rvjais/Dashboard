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
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80 shadow-lg">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Welcome Section - Responsive Text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent truncate">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium mt-0.5 sm:mt-1 truncate">
              {user.role === 'admin' ? 'Admin Dashboard' : `${user.department} Department`}
            </p>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 sm:p-2.5 md:p-3 text-gray-700 dark:text-gray-300 hover:text-white bg-white/80 dark:bg-gray-700/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-transparent"
              >
                <SafeIcon icon={FiBell} className="w-5 h-5 sm:w-6 sm:h-6" />
                {announcements.length > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white dark:border-gray-800">
                    {announcements.length}
                  </span>
                )}
              </motion.button>

              {/* Notifications Dropdown - Responsive */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 sm:mt-3 w-72 sm:w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 backdrop-blur-xl overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Stay updated with latest announcements</p>
                    </div>
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto custom-scrollbar">
                      {announcements.length > 0 ? (
                        announcements.map((announcement, index) => (
                          <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-colors"
                          >
                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{announcement.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{announcement.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {new Date(announcement.date).toLocaleDateString()}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-8 sm:p-12 text-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                            <SafeIcon icon={FiBell} className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          </div>
                          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Button - Responsive */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/employee/${user.id}`)}
              className="group flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-white to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl hover:from-blue-500 hover:to-purple-600 transition-all duration-300 cursor-pointer border-2 border-gray-200 dark:border-gray-600 hover:border-transparent shadow-md hover:shadow-xl backdrop-blur-sm"
              title="View Profile"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full sm:rounded-xl object-cover border-2 sm:border-3 border-gray-300 dark:border-gray-600 group-hover:border-white shadow-lg transition-all"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <SafeIcon icon={FiUser} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors truncate max-w-[100px] md:max-w-[150px]">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-white/90 capitalize transition-colors">
                  {user.role}
                </p>
              </div>
              <SafeIcon icon={FiChevronDown} className="hidden md:block w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </header>
  );
};

export default TopBar;