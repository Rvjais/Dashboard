import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  const isPositiveTrend = trend && trend.startsWith('+');

  return (
    <div className="glass-effect rounded-lg p-6 card-shadow border border-gray-200 dark:border-gray-700 overflow-hidden relative">
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>

          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <SafeIcon icon={icon} className="w-6 h-6 text-white" />
          </div>
        </div>

        {trend && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
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