import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { mockAPI } from '../services/mockAPI';

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
      const data = await mockAPI.getLeaderboard(timeFilter);
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrophy} className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance Leaderboard
            </h2>
          </div>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>

        <div className="grid gap-4">
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                index === 0 
                  ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' 
                  : index === 1
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20'
                  : index === 2
                  ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(index + 1)}`}>
                {getRankIcon(index + 1)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {user.department}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.completedTasks} tasks completed
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.points}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
              </div>

              <div className="flex items-center gap-1">
                {user.streak > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 rounded-full">
                    <SafeIcon icon={FiAward} className="w-3 h-3 text-red-600 dark:text-red-400" />
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      {user.streak} day streak
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboardData.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No performance data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;