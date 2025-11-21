import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { api } from '../services/api';

const { FiTrophy, FiAward, FiMedal, FiUsers } = FiIcons;

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeFilter]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getLeaderboard(timeFilter);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <SafeIcon icon={FiTrophy} className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <SafeIcon icon={FiAward} className="w-6 h-6 text-gray-400" />;
      case 3:
        return <SafeIcon icon={FiMedal} className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 backdrop-blur-lg">
        {/* Header - Responsive Stack on Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <SafeIcon icon={FiTrophy} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Performance Leaderboard
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Top performers this period
              </p>
            </div>
          </div>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>

        {/* Leaderboard Items - Responsive Grid */}
        <div className="grid gap-3 sm:gap-4 lg:gap-5">
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user._id || user.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50 dark:from-yellow-900/30 dark:via-yellow-800/30 dark:to-amber-900/30 border-2 border-yellow-300 dark:border-yellow-600 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/50'
                  : index === 1
                  ? 'bg-gradient-to-r from-gray-50 via-slate-100 to-gray-50 dark:from-gray-700/30 dark:via-slate-700/30 dark:to-gray-700/30 border-2 border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-200 dark:shadow-gray-800/50'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-50 via-orange-100 to-red-50 dark:from-orange-900/30 dark:via-orange-800/30 dark:to-red-900/30 border-2 border-orange-300 dark:border-orange-600 shadow-lg shadow-orange-200 dark:shadow-orange-900/50'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              {/* Sparkle Effect on Top 3 */}
              {index < 3 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              )}

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform ${getRankBadgeColor(index + 1)}`}>
                  {getRankIcon(index + 1)}
                </div>

                {/* User Info - Flexible on Mobile */}
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md whitespace-nowrap">
                      {user.department}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {user.completedTasks} tasks completed
                  </p>
                </div>

                {/* Points - Stack on Mobile */}
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-center sm:text-right">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {user.points}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">points</div>
                  </div>

                  {/* Streak Badge */}
                  {user.streak > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                      <SafeIcon icon={FiAward} className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                        {user.streak} day{user.streak > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {leaderboardData.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">No performance data available yet.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Complete tasks to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;