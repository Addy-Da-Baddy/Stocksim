import React, { useState, useEffect } from 'react';
import { FaSearch, FaArrowUp, FaArrowDown, FaTimes, FaChartLine, FaFire, FaStar, FaRocket, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const stockCategories = {
  'Technology': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'],
  'Finance': ['JPM', 'BAC', 'WFC', 'GS', 'MS'],
  'Healthcare': ['JNJ', 'PFE', 'UNH', 'MRK', 'ABBV'],
  'Consumer Cyclical': ['TSLA', 'HD', 'NKE', 'MCD', 'SBUX'],
  'Consumer Defensive': ['PG', 'KO', 'WMT', 'PEP', 'COST'],
  'Energy': ['XOM', 'CVX', 'SHEL', 'TTE', 'COP'],
  'Industrials': ['BA', 'CAT', 'GE', 'HON', 'LMT'],
  'Real Estate': ['AMT', 'PLD', 'CCI', 'EQIX', 'SPG'],
  'Utilities': ['NEE', 'DUK', 'SO', 'D', 'AEP'],
  'Communication Services': ['META', 'DIS', 'NFLX', 'CMCSA', 'TMUS'],
};

const allSymbols = Object.values(stockCategories).flat();

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

const StockCard = ({ symbol, long_name, logo_url, price, change, percent_change, onBuy }) => {
  const positive = change >= 0;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/30 flex flex-col justify-between overflow-hidden group cursor-pointer"
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: positive ? '0 25px 50px rgba(34, 197, 94, 0.3)' : '0 25px 50px rgba(239, 68, 68, 0.3)'
      }}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: positive 
            ? 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 70%)'
        }}
      />
      
      {/* Floating icon */}
      <motion.div
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
        animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {positive ? <FaRocket className="text-green-400" /> : <FaFire className="text-red-400" />}
      </motion.div>

      <div className="flex items-center mb-6 relative z-10">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {logo_url ? (
            <img 
              src={logo_url} 
              alt={`${long_name} logo`} 
              className="w-14 h-14 mr-4 rounded-full border-2 border-gray-600 shadow-lg" 
            />
          ) : (
            <div className="w-14 h-14 mr-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{symbol[0]}</span>
            </div>
          )}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100"
            animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.div>
        <div>
          <motion.p 
            className="text-2xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
          >
            {symbol}
          </motion.p>
          <p className="text-sm text-gray-400 max-w-32 truncate">{long_name}</p>
        </div>
      </div>

      <div className="text-right relative z-10">
        <motion.p 
          className="text-3xl font-bold text-white mb-2"
          whileHover={{ scale: 1.1 }}
        >
          ${price}
        </motion.p>
        <motion.div 
          className={`flex items-center justify-end text-sm mb-4 ${positive ? 'text-green-400' : 'text-red-400'}`}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {positive ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
          </motion.div>
          <span className="font-semibold">{change} ({percent_change}%)</span>
        </motion.div>
        
        <motion.button 
          onClick={() => onBuy(symbol, price)}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={isHovered ? { x: ['-100%', '100%'] } : { x: '-100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">Buy Stock</span>
        </motion.button>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100"
        animate={isHovered ? { x: ['-100%', '100%'] } : { x: '-100%' }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
  );
};

const PurchaseModal = ({ stock, price, onClose, onConfirm }) => {
  const [shares, setShares] = useState(1);
  const [message, setMessage] = useState('');

  const handleConfirm = async () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const res = await onConfirm(stock, shares, tz);
      setMessage({ type: 'success', text: 'Successful purchase' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Transaction failed' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-700/50 w-full max-w-md shadow-2xl relative overflow-hidden"
        initial={{ scale: 0.8, rotateY: -15 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.8, rotateY: 15 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20 animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Buy {stock}
            </motion.h2>
            <motion.button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes size={24} />
            </motion.button>
          </div>
          
          <motion.p 
            className="mb-6 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Current Price: <span className="font-bold text-green-400 text-2xl">${price}</span>
          </motion.p>
          
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="shares" className="block mb-3 text-lg font-semibold">Shares:</label>
            <input 
              type="number"
              id="shares"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
            />
          </motion.div>
          
          <motion.p 
            className="mb-6 text-2xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            Total Cost: ${(price * shares).toFixed(2)}
          </motion.p>
          
          <motion.button 
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10 text-xl">Confirm Purchase</span>
          </motion.button>
          
          <AnimatePresence>
            {message && (
              <motion.p 
                className={`mt-4 text-center text-lg font-semibold ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TradingPlatform = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockData = async () => {
      const allSymbols = Object.values(stockCategories).flat();
      const promises = allSymbols.map(symbol => api.get(`/stock/price/${symbol}`));
      try {
        const responses = await Promise.all(promises);
        const data = responses.reduce((acc, res) => {
          acc[res.data.symbol] = res.data;
          return acc;
        }, {});
        setStockData(data);
      } catch (error) {
        console.error("Failed to fetch stock data", error);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allSymbols.filter(s => s.toLowerCase().startsWith(searchQuery.toLowerCase()));
      setAutocompleteResults(filtered);
    } else {
      setAutocompleteResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async (e, symbol) => {
    e.preventDefault();
    const query = symbol || searchQuery;
    if (!query) return;

    setSearchError(null);
    setSearchResult(null);
    setAutocompleteResults([]);
    setSearchQuery(query);

    try {
      const res = await api.get(`/stock/price/${query.toUpperCase()}`);
      setSearchResult(res.data);
    } catch (error) {
      setSearchError(`Stock with symbol "${query.toUpperCase()}" not found.`);
      console.error("Failed to fetch stock data for search", error);
    }
  };

  const handleBuyClick = (symbol, price) => {
    setSelectedStock({ symbol, price });
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
  };

  const handleConfirmPurchase = async (symbol, shares, tz) => {
    return api.post('/transaction/buy', { symbol, shares, tz });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans p-8 relative overflow-hidden">
      <FloatingParticles />
      
      <AnimatePresence>
        {selectedStock && (
          <PurchaseModal 
            stock={selectedStock.symbol}
            price={selectedStock.price}
            onClose={handleCloseModal}
            onConfirm={handleConfirmPurchase}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.header 
          className="mb-12 flex items-center justify-between"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaChartLine className="text-6xl text-green-400" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                Trading Platform
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your gateway to the stock market revolution.
              </motion.p>
            </div>
          </div>
          <motion.button
            onClick={() => navigate(-1)}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-4 text-white hover:bg-gray-700/70 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft size={24} />
          </motion.button>
        </motion.header>

        <motion.div 
          className="mb-12 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center bg-gray-800/30 backdrop-blur-xl rounded-full p-3 border border-gray-700/50 shadow-2xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FaSearch className="text-gray-400 mx-4 text-xl" />
            </motion.div>
            <input 
              type="text"
              placeholder="Search for any stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="w-full bg-transparent focus:outline-none text-lg placeholder-gray-500"
            />
            <motion.button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </div>
          
          <AnimatePresence>
            {autocompleteResults.length > 0 && (
              <motion.ul 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute z-20 w-full bg-gray-800/90 backdrop-blur-xl rounded-2xl mt-2 border border-gray-700/50 shadow-2xl"
              >
                {autocompleteResults.map((symbol, index) => (
                  <motion.li 
                    key={symbol}
                    onClick={(e) => handleSearch(e, symbol)}
                    className="px-6 py-3 cursor-pointer hover:bg-gray-700/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)', x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {symbol}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {searchError && (
              <motion.p 
                className="text-red-400 mt-4 text-center text-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {searchError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {searchResult && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Search Result
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StockCard key={searchResult.symbol} {...searchResult} onBuy={handleBuyClick} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          {Object.entries(stockCategories).map(([category, symbols], categoryIndex) => (
            <motion.div 
              key={category} 
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <motion.h2 
                className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                {category}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {symbols.map((symbol, index) => {
                  const data = stockData[symbol];
                  return data ? (
                    <StockCard key={symbol} {...data} onBuy={handleBuyClick} />
                  ) : (
                    <motion.div
                      key={symbol}
                      className="bg-gray-800/30 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/30 flex items-center justify-center"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <p className="text-gray-400">Loading...</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingPlatform;