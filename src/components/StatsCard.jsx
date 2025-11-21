import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500',
    purple: 'from-purple-500 to-violet-500',
    indigo: 'from-indigo-500 to-purple-500'
  };

  const isPositiveTrend = trend && trend.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-effect rounded-3xl p-6 hover-lift card-shadow hover:card-shadow-hover border border-gray-200/50 dark:border-gray-700/50 group overflow-hidden relative"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              {value}
            </motion.p>
          </div>

          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}
          >
            <SafeIcon icon={icon} className="w-7 h-7 text-white" />
          </motion.div>
        </div>

        {trend && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isPositiveTrend
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            <SafeIcon
              icon={isPositiveTrend ? FiTrendingUp : FiTrendingDown}
              className="w-3.5 h-3.5"
            />
            {trend}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;