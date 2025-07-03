import React, { useState, useEffect } from 'react';
import { FaTrophy, FaDollarSign, FaUsers, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../api';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('total'); // 'total', 'money', 'score'
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/leaderboard?sort_by=${sortBy}`);
        setLeaderboardData(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <FaSort className="inline-block ml-1 text-gray-500" />;
    }
    return sortOrder === 'desc' 
      ? <FaSortDown className="inline-block ml-1" /> 
      : <FaSortUp className="inline-block ml-1" />;
  };

  const tableHeaderClasses = "p-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold flex items-center">
                <FaTrophy className="mr-4 text-yellow-400" />
                Leaderboard
            </h1>
            <Link to="/dashboard" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Back to Dashboard
            </Link>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
            <button onClick={() => handleSort('total')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${sortBy === 'total' ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}>Total Score</button>
            <button onClick={() => handleSort('money')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${sortBy === 'money' ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}>Total Equity</button>
            <button onClick={() => handleSort('score')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${sortBy === 'score' ? 'bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}>Community Score</button>
        </div>

        {loading && <div className="text-center text-lg">Loading...</div>}
        {error && <div className="text-center text-lg text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className={tableHeaderClasses.replace('cursor-pointer hover:bg-gray-700', '')}>Rank</th>
                  <th className={tableHeaderClasses.replace('cursor-pointer hover:bg-gray-700', '')}>Username</th>
                  <th className={tableHeaderClasses} onClick={() => handleSort('money')}>
                    <FaDollarSign className="inline-block mr-2" />
                    Total Equity
                    {getSortIcon('money')}
                  </th>
                  <th className={tableHeaderClasses} onClick={() => handleSort('score')}>
                    <FaUsers className="inline-block mr-2" />
                    Community Score
                    {getSortIcon('score')}
                  </th>
                  <th className={tableHeaderClasses} onClick={() => handleSort('total')}>
                    <FaTrophy className="inline-block mr-2" />
                    Total Score
                    {getSortIcon('total')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user, index) => (
                  <motion.tr 
                    key={user.user_id}
                    className="border-b border-gray-800 hover:bg-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="p-4 text-center font-bold text-lg">
                      {index + 1 === 1 && '🥇'}
                      {index + 1 === 2 && '🥈'}
                      {index + 1 === 3 && '🥉'}
                      {index + 1 > 3 && index + 1}
                    </td>
                    <td className="p-4 font-semibold">{user.username}</td>
                    <td className="p-4">{formatCurrency(user.total_equity)}</td>
                    <td className="p-4 text-center">{user.community_score}</td>
                    <td className="p-4 text-center font-bold text-green-400">{user.total_score}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
