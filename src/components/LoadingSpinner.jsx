import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers } = FiIcons;

const LoadingSpinner = ({ size = 'lg', fullScreen = true, message = 'Loading Dashboard' }) => {
  // Size variants
  const sizeMap = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-xs' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-sm' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-lg' },
    xl: { container: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-xl' }
  };

  const sizeClasses = sizeMap[size] || sizeMap.lg;

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses.container} bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4`}
          >
            <SafeIcon icon={FiUsers} className={`${sizeClasses.icon} text-white`} />
          </motion.div>
          <h2 className={`${sizeClasses.text} font-semibold text-gray-900 mb-2`}>{message}</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Please wait while we set up your workspace...</p>
        </div>
      </div>
    );
  }

  // Inline spinner (for use in buttons, forms, etc.)
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses.container} bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center`}
    >
      <SafeIcon icon={FiUsers} className={`${sizeClasses.icon} text-white`} />
    </motion.div>
  );
};

export default LoadingSpinner;