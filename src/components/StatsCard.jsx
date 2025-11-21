import React from 'react';
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
    <div className="glass-effect rounded-3xl p-6 card-shadow border border-gray-200/50 dark:border-gray-700/50 overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>

          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
            <SafeIcon icon={icon} className="w-7 h-7 text-white" />
          </div>
        </div>

        {trend && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isPositiveTrend
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            <SafeIcon
              icon={isPositiveTrend ? FiTrendingUp : FiTrendingDown}
              className="w-3.5 h-3.5"
            />
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;