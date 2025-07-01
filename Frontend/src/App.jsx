import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaRocket, FaUsers, FaMoneyBillWave, FaBolt, FaChartBar, FaChartLine, FaTrophy, FaDollarSign } from 'react-icons/fa';
import Login from './pages/Login';
import Signup from './pages/Signup';
import api from './api';

function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);

    // Observe elements for scroll animations
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const [tickersData, setTickersData] = useState([]);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  useEffect(() => {
    const symbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'NVDA', 'JPM'];
    const fetchTickers = async () => {
      const promises = symbols.map(symbol => api.get(`/stock/price/${symbol}`));
      try {
        const responses = await Promise.all(promises);
        const data = responses.map(res => res.data);
        setTickersData(data);
      } catch (error) {
        console.error("Failed to fetch ticker data", error);
        // Optionally, set some default data to display on error
        setTickersData(symbols.map(s => ({ symbol: s, price: 'N/A', change: 0, percent_change: 0 })))
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tickersData.length > 0) {
      const tickerInterval = setInterval(() => {
        setCurrentTickerIndex(prev => (prev + 1) % tickersData.length);
      }, 3000); // Change ticker every 3 seconds
      return () => clearInterval(tickerInterval);
    }
  }, [tickersData]);

  const currentTicker = tickersData[currentTickerIndex];

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  const formatChange = (change) => {
    const num = parseFloat(change);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900 opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.15) 0%, transparent 50%)`
          }}
        ></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom cursor */}
      <div 
        className="fixed w-6 h-6 border-2 border-green-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(1)'
        }}
      ></div>

      {/* Ticker Tape */}
      <div className="fixed top-0 left-0 right-0 bg-green-900 bg-opacity-80 backdrop-blur-sm z-40 py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-pulse">
          <span className="inline-block px-8 text-sm font-mono text-green-300">
            📈 LIVE MARKET DATA: 
            {currentTicker ? (
              <span className={currentTicker.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {currentTicker.symbol} ${formatPrice(currentTicker.price)} 
                ({formatChange(currentTicker.change)}) ({formatChange(currentTicker.percent_change)}%)
              </span>
            ) : (
              'Loading data...'
            )}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-30 p-6 pt-16 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <FaDollarSign className="text-black text-xl" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Stocksim
          </h1>
        </div>
        <nav className="flex items-center space-x-8">
          <a 
            href="#features" 
            className="relative group hover:text-green-400 transition-all duration-300 cursor-none"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#about" 
            className="relative group hover:text-green-400 transition-all duration-300 cursor-none"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <Link 
            to="/login" 
            className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 cursor-none overflow-hidden group"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 text-center py-32 px-6">
        <div 
          className="transform transition-all duration-1000 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        >
          <div 
            id="hero-title"
            data-animate
            className={`transition-all duration-1000 ease-out ${
              isVisible['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent leading-tight">
              Master the Art of
              <br />
              <span className="relative">
                Trading Simulation
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-500/20 blur-xl animate-pulse"></div>
              </span>
            </h2>
          </div>
          
          <div 
            id="hero-subtitle"
            data-animate
            className={`transition-all duration-1000 delay-300 ease-out ${
              isVisible['hero-subtitle'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the thrill of Wall Street with <span className="text-green-400 font-semibold">real-time data</span>, 
              compete in our <span className="text-green-400 font-semibold">global leaderboards</span>, and master 
              <span className="text-green-400 font-semibold"> advanced analytics</span>—all completely risk-free.
            </p>
          </div>

          <div 
            id="hero-cta"
            data-animate
            className={`transition-all duration-1000 delay-600 ease-out ${
              isVisible['hero-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Link 
              to="/signup" 
              className="group relative inline-block bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-green-500/30 cursor-none overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Start Trading Now</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300"><FaRocket /></span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-700 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              </div>
            </Link>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: '100K+', label: 'Active Traders', icon: <FaUsers /> },
            { number: '$50M+', label: 'Virtual Volume', icon: <FaMoneyBillWave /> },
            { number: '99.9%', label: 'Uptime', icon: <FaBolt /> }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 transform transition-all duration-1000 delay-${(index + 1) * 200} hover:scale-105 hover:border-green-400/50 cursor-none ${
                isVisible['hero-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-400 mb-1">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-20 py-32 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto px-6">
          <div 
            id="features-title"
            data-animate
            className={`text-center mb-20 transition-all duration-1000 ease-out ${
              isVisible['features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
              Why Choose Stocksim?
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the most advanced stock trading simulation platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Realistic Simulation',
                description: 'Trade with real-time market data powered by advanced algorithms. Experience authentic market conditions without financial risk.',
                icon: <FaChartBar />,
                gradient: 'from-blue-500 to-green-500'
              },
              {
                title: 'Portfolio Analytics',
                description: 'Advanced AI-powered analytics with predictive insights, risk assessment, and performance optimization recommendations.',
                icon: <FaChartLine />,
                gradient: 'from-green-500 to-yellow-500'
              },
              {
                title: 'Global Competition',
                description: 'Compete with traders worldwide on real-time leaderboards. Join exclusive tournaments and trading challenges.',
                icon: <FaTrophy />,
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl transition-all duration-1000 delay-${index * 200} hover:border-green-400/50 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 cursor-none ${
                  isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`text-4xl mb-4 p-3 rounded-xl bg-gradient-to-r ${feature.gradient} inline-block`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-green-400 group-hover:text-green-300 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-20 text-center">
        <div 
          id="cta-section"
          data-animate
          className={`transition-all duration-1000 ease-out ${
            isVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Trading Journey?</h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already mastering the markets
          </p>
          <Link 
            to="/signup" 
            className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 cursor-none overflow-hidden"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 text-center p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center">
            <FaDollarSign className="text-black text-sm" />
          </div>
          <span className="text-green-400 font-semibold">Stocksim</span>
        </div>
        <p className="text-gray-500">&copy; 2025 Stocksim. All rights reserved. Trade smart, trade safe.</p>
      </footer>

      <style>{`
        .cursor-none { cursor: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;