import React, { useState, useEffect } from 'react';
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
      <div className="glass-effect rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <SafeIcon icon={FiTrophy} className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
                Leaderboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Top performers
              </p>
            </div>
          </div>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full sm:w-auto px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-smooth cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>

        {/* Leaderboard Items */}
        <div className="space-y-3">
          {leaderboardData.map((user, index) => (
            <div
              key={user._id || user.id || index}
              className={`relative overflow-hidden rounded-3xl transition-smooth ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg'
                  : index === 1
                  ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-2 border-gray-300 dark:border-gray-600 shadow-lg'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 shadow-lg'
                  : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <div className="relative flex items-center gap-4 p-5">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${getRankBadgeColor(index + 1)}`}>
                  {getRankIcon(index + 1)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      {user.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.completedTasks} tasks completed
                  </p>
                </div>

                {/* Points & Streak */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-bold gradient-text">
                      {user.points}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">points</div>
                  </div>

                  {/* Streak Badge */}
                  {user.streak > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-md">
                      <SafeIcon icon={FiAward} className="w-4 h-4 text-white" />
                      <span className="text-sm font-bold text-white">
                        {user.streak}d
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {leaderboardData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">No data yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Complete tasks to appear here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;