import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api';

const Forecast = () => {
  const [symbol, setSymbol] = useState('');
  const [days, setDays] = useState(30);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForecast = async (e) => {
    e.preventDefault();
    if (!symbol) {
      setError('Please enter a stock symbol.');
      return;
    }
    setIsLoading(true);
    setError('');
    setForecastData(null);

    try {
      const res = await api.get(`/stock/forecast?symbol=${symbol}&days=${days}`);
      const formattedData = res.data.forecast.map(d => ({
        date: new Date(d.ds).toLocaleDateString(),
        prediction: d.yhat,
        lower_bound: d.yhat_lower,
        upper_bound: d.yhat_upper,
      }));
      setForecastData({ symbol: res.data.symbol, data: formattedData });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate forecast.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900/50 text-white font-sans p-8">
      <div className="absolute top-4 left-4">
        <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-500 mb-2">Stock Price Oracle</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Leveraging time-series forecasting to predict future stock prices. This tool uses the Prophet library, developed by Facebook, to analyze historical data and project future trends.
        </p>
        <a href="https://facebook.github.io/prophet/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-2 inline-flex items-center">
          Learn more about Prophet <FaInfoCircle className="ml-2" />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-2xl mx-auto bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10"
      >
        <form onSubmit={handleForecast} className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Stock Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-gray-900/70 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="relative w-full md:w-auto">
             <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="w-full md:w-32 bg-gray-900/70 border-2 border-gray-700 rounded-lg py-3 px-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaChartLine />
            {isLoading ? 'Analyzing...' : 'Forecast'}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-center text-red-400">{error}</p>}
      </motion.div>

      {forecastData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 max-w-6xl mx-auto bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Forecast for {forecastData.symbol}</h2>
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={forecastData.data}>
              <defs>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                  border: '1px solid #3b82f6',
                  color: '#e5e7eb'
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="prediction" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrediction)" name="Predicted Price" />
              <Area type="monotone" dataKey="lower_bound" stroke="#10b981" fillOpacity={0.1} fill="#10b981" name="Lower Bound" />
              <Area type="monotone" dataKey="upper_bound" stroke="#ef4444" fillOpacity={0.1} fill="#ef4444" name="Upper Bound" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default Forecast;
