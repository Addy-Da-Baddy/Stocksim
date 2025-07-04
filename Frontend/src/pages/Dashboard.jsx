import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown, FaDollarSign, FaChartLine, FaBriefcase, FaUser, FaStore, FaTrophy, FaNewspaper, FaBook, FaChartBar, FaSignOutAlt, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

// Placeholder components for different views
const ProfileView = ({ userDetails }) => <div className="text-white">Profile View</div>;
const MyItemsView = () => <div className="text-white">My Purchased Items</div>;
const ForecastView = () => <div className="text-white">Stock Forecast Center</div>;
const NewsView = () => <div className="text-white">Finance News</div>;
const ArticlesView = () => <div className="text-white">Finance Articles</div>;

const StatCard = ({ title, value, change, icon, positive }) => (
  <motion.div 
    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 flex items-center space-x-4"
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(31, 41, 55, 0.7)' }}
  >
    <div className={`p-3 rounded-full bg-gradient-to-br ${positive ? 'from-green-500/20 to-green-600/20' : 'from-red-500/20 to-red-600/20'}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change && (
        <div className={`flex items-center text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const TradeStation = ({ user, onTrade, msg }) => {
  const [trade, setTrade] = useState({ symbol: '', shares: '' });

  const handleTrade = (type) => {
    if (!trade.symbol || !trade.shares) {
      onTrade(null); // To show message
      return;
    }
    onTrade({ ...trade, type });
    setTrade({ symbol: '', shares: '' });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
      <h2 className="text-2xl font-bold mb-4">Trade Station</h2>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Symbol (e.g., AAPL)"
          value={trade.symbol}
          onChange={e => setTrade({ ...trade, symbol: e.target.value })}
          className="w-full bg-gray-900/70 border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input 
          type="number" 
          placeholder="Shares"
          value={trade.shares}
          onChange={e => setTrade({ ...trade, shares: e.target.value })}
          className="w-full bg-gray-900/70 border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex space-x-4">
          <button onClick={() => handleTrade('buy')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Buy</button>
          <button onClick={() => handleTrade('sell')} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Sell</button>
        </div>
        {msg && <p className="text-sm text-center text-yellow-400 pt-2">{msg}</p>}
      </div>
    </div>
  );
};

const SellStockModal = ({ isOpen, onClose, stock, onSell, formatCurrency }) => {
  const [shares, setShares] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShares('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSell = () => {
    const sharesToSell = parseFloat(shares);
    if (isNaN(sharesToSell) || sharesToSell <= 0) {
      setError('Please enter a valid number of shares.');
      return;
    }
    if (sharesToSell > stock.shares) {
      setError('You cannot sell more shares than you own.');
      return;
    }
    onSell(shares);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700/50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Sell {stock.symbol}</h2>
            <div className="text-gray-400 mb-4 space-y-1">
              <p>Market Price: <span className="font-semibold text-white">{formatCurrency(stock.market_price)}</span></p>
              <p>You own: <span className="font-semibold text-white">{stock.shares} shares</span></p>
            </div>
            <input
              type="number"
              placeholder="Number of shares to sell"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="w-full bg-gray-900/70 border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              max={stock.shares}
              min="0.000001" // Allow fractional shares
              step="any"
            />
            {error && <p className="text-sm text-red-400 pt-2">{error}</p>}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSell}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Sell
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HoldingsTable = ({ holdings, onSymbolClick, onSellClick, formatCurrency }) => (
  <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
    <h2 className="text-2xl font-bold mb-4">My Holdings</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4">Symbol</th>
            <th className="p-4">Shares</th>
            <th className="p-4">Avg. Price</th>
            <th className="p-4">Market Price</th>
            <th className="p-4">Market Value</th>
            <th className="p-4">Profit/Loss</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(stock => (
            <tr 
              key={stock.symbol} 
              className="border-b border-gray-800 hover:bg-gray-700/50"
            >
              <td 
                className="p-4 font-bold text-green-400 cursor-pointer"
                onClick={() => onSymbolClick(stock.symbol)}
              >
                {stock.symbol}
              </td>
              <td className="p-4">{stock.shares}</td>
              <td className="p-4">{formatCurrency(stock.avg_price)}</td>
              <td className="p-4">{formatCurrency(stock.market_price)}</td>
              <td className="p-4">{formatCurrency(stock.market_value)}</td>
              <td className={`p-4 font-semibold ${stock.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(stock.profit)}
              </td>
              <td className="p-4 text-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSellClick(stock);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors text-sm"
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardView = ({ portfolio, chartData, activeSymbol, timeRange, handleTimeRangeChange, holdings, handleSymbolClick, formatCurrency, user, handleTrade, msg, onSellClick }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Total Equity" 
          value={formatCurrency(portfolio.total_equity)} 
          icon={<FaDollarSign className="text-green-400 text-2xl" />}
          positive
        />
        <StatCard 
          title="Portfolio Value" 
          value={formatCurrency(portfolio.portfolio_value)} 
          icon={<FaBriefcase className="text-blue-400 text-2xl" />}
          positive
        />
        <StatCard 
          title="Cash Balance" 
          value={formatCurrency(portfolio.balance)} 
          icon={<FaDollarSign className="text-yellow-400 text-2xl" />}
          positive
        />
        <StatCard 
          title="Net Gain/Loss" 
          value={formatCurrency(portfolio.net_gain_loss)} 
          change={`${portfolio.total_cost_basis > 0 ? ((portfolio.net_gain_loss / portfolio.total_cost_basis) * 100).toFixed(2) : 0}%`}
          icon={<FaChartLine className={portfolio.net_gain_loss >= 0 ? "text-green-400 text-2xl" : "text-red-400 text-2xl"} />}
          positive={portfolio.net_gain_loss >= 0}
        />
        <StatCard 
          title="Community Score" 
          value={portfolio.user_details.community_score}
          icon={<FaUsers className="text-purple-400 text-2xl" />}
          positive
        />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">
              {activeSymbol ? `${activeSymbol} Chart` : 'Stock Chart'}
            </h2>
            {holdings.length > 0 && (
              <select 
                value={activeSymbol || ''} 
                onChange={(e) => handleSymbolClick(e.target.value)}
                className="bg-gray-900/70 border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {holdings.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>{stock.symbol}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex space-x-2">
            {['1d', '5d', '1mo', '6mo', '1y'].map(range => (
              <button 
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === range ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                border: '1px solid #4b5563',
                color: '#e5e7eb'
              }} 
            />
            <Area type="monotone" dataKey="close" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <TradeStation user={user} onTrade={handleTrade} msg={msg} />
    </div>
    <HoldingsTable holdings={holdings} onSymbolClick={handleSymbolClick} onSellClick={onSellClick} formatCurrency={formatCurrency} />
  </>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeSymbol, setActiveSymbol] = useState(null);
  const [timeRange, setTimeRange] = useState('1d');
  const [msg, setMsg] = useState('');
  const [activeView, setActiveView] = useState('dashboard'); // New state for navigation
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.sub);
      } catch (error) {
        console.error('Invalid token', error);
        handleLogout();
      }
    } else {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 24 * 60 * 60 * 1000); // 24 hours

      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const portfolioRes = await api.get('/portfolio/value');
      const holdingsRes = await api.get('/portfolio');
      
      setPortfolio(portfolioRes.data);
      setHoldings(holdingsRes.data.portfolio);

      if (holdingsRes.data.portfolio.length > 0 && !activeSymbol) {
        const firstSymbol = holdingsRes.data.portfolio[0].symbol;
        setActiveSymbol(firstSymbol);
        fetchChartData(firstSymbol, timeRange);
      } else if (holdingsRes.data.portfolio.length === 0) {
        setActiveSymbol(null);
        setChartData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      setMsg('Failed to load dashboard data.');
    }
  };

  const fetchChartData = async (symbol, range) => {
    try {
      const interval = range === '1d' ? '1m' : '1d';
      const res = await api.get(`/stock/history/${symbol}?range=${range}&interval=${interval}`);
      setChartData(res.data.history);
    } catch (error) {
      console.error(`Failed to fetch chart data for ${symbol}`, error);
      setChartData([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const handleSymbolClick = (symbol) => {
    setActiveSymbol(symbol);
    fetchChartData(symbol, timeRange);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (activeSymbol) {
      fetchChartData(activeSymbol, range);
    }
  };

  const handleTrade = async (tradeDetails) => {
    if (!tradeDetails) {
      setMsg('Please enter symbol and shares.');
      return;
    }
    if (!user) {
      setMsg('User not found, please log in again.');
      return;
    }
    try {
      const res = await api.post(`/transaction/${tradeDetails.type}`, {
        symbol: tradeDetails.symbol.toUpperCase(),
        shares: parseInt(tradeDetails.shares)
      });
      setMsg(res.data.message);
      fetchData(); // Refresh data after trade
    } catch (error) {
      setMsg(error.response?.data?.error || 'Trade failed');
    }
  };

  const handleSellClick = (stock) => {
    setSelectedStock(stock);
    setIsSellModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSellModalOpen(false);
    setSelectedStock(null);
  };

  const handleSell = async (sharesToSell) => {
    if (!selectedStock || !sharesToSell || sharesToSell <= 0) {
      setMsg("Please enter a valid number of shares to sell.");
      return;
    }

    try {
      const res = await api.post('/transaction/sell', {
        symbol: selectedStock.symbol,
        shares: sharesToSell
      });
      setMsg(res.data.message);
      fetchData(); // Refresh data
      handleCloseModal();
    } catch (error) {
      console.error("Failed to sell stock", error);
      setMsg(error.response?.data?.error || "Failed to sell stock.");
      // Don't close modal on error, so user can see the message if we display it there
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView 
          portfolio={portfolio} 
          chartData={chartData} 
          activeSymbol={activeSymbol} 
          timeRange={timeRange} 
          handleTimeRangeChange={handleTimeRangeChange} 
          holdings={holdings} 
          handleSymbolClick={handleSymbolClick} 
          formatCurrency={formatCurrency} 
          user={user} 
          handleTrade={handleTrade} 
          msg={msg}
          onSellClick={handleSellClick} 
        />;
      case 'profile':
        return <ProfileView userDetails={portfolio.user_details} />;
      case 'my-items':
        return <MyItemsView />;
      case 'forecast':
        return <ForecastView />;
      case 'news':
        return <NewsView />;
      case 'articles':
        return <ArticlesView />;
      default:
        return <DashboardView 
          portfolio={portfolio} 
          chartData={chartData} 
          activeSymbol={activeSymbol} 
          timeRange={timeRange} 
          handleTimeRangeChange={handleTimeRangeChange} 
          holdings={holdings} 
          handleSymbolClick={handleSymbolClick} 
          formatCurrency={formatCurrency} 
          user={user} 
          handleTrade={handleTrade} 
          msg={msg}
          onSellClick={handleSellClick} 
        />;
    }
  };

  if (!portfolio) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Loading Dashboard...</p></div>;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'profile', label: 'My Profile', icon: <FaUser />, path: '/my-profile' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FaTrophy />, path: '/leaderboard' },
    { id: 'forecast', label: 'Stock Forecast', icon: <FaChartLine />, path: '/forecast' },
    { id: 'news', label: 'Finance News', icon: <FaNewspaper />, path: '/news' },
    { id: 'articles', label: 'Learning Center', icon: <FaBook />, path: '/financial-articles' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/50 text-white font-sans flex">
      <aside className="w-64 bg-gray-900/70 backdrop-blur-md p-4 flex flex-col border-r border-gray-700/50">
        <h1 className="text-3xl font-bold text-green-400 mb-8 text-center">SimuTrade</h1>
        <nav className="flex flex-col space-y-2">
          {navItems.map(item => {
            if (item.path) {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors text-left hover:bg-gray-700/50`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            }
            return (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${activeView === item.id ? 'bg-green-500/30 text-green-300' : 'hover:bg-gray-700/50'}`}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
           <Link to="/my-items" className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-left hover:bg-gray-700/50">
              <FaBriefcase />
              <span>My Items</span>
            </Link>
           <Link to="/community-shop" className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-left hover:bg-gray-700/50">
              <FaStore />
              <span>Community Shop</span>
            </Link>
           <Link to="/trading" className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-left hover:bg-gray-700/50">
              <FaMoneyBillWave />
              <span>Trading Platform</span>
            </Link>
        </nav>
        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-left w-full hover:bg-red-700/50">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400">Greetings, {portfolio.user_details?.first_name || user?.username || 'Trader'}!</h1>
          <p className="text-gray-400">Here is your financial dashboard for today, {new Date().toLocaleDateString()}.</p>
          <p className="text-gray-500 text-sm mt-2">Portfolio values are refreshed every 24 hours.</p>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
      <SellStockModal
        isOpen={isSellModalOpen}
        onClose={handleCloseModal}
        stock={selectedStock}
        onSell={handleSell}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}