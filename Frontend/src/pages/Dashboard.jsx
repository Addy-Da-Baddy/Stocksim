import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = ({ user }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch portfolio
      const portfolioResponse = await fetch(`http://127.0.0.1:5000/api/portfolio/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        setPortfolio(portfolioData.portfolio || []);
      }

      // Fetch recent transactions (you'll need to implement this endpoint)
      // const transactionsResponse = await fetch(`http://127.0.0.1:5000/api/transactions/${user.id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // if (transactionsResponse.ok) {
      //   const transactionsData = await transactionsResponse.json();
      //   setTransactions(transactionsData.transactions || []);
      // }

    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => total + item.market_value, 0);
  };

  const calculateTotalProfit = () => {
    return portfolio.reduce((total, item) => total + item.profit, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.username}!</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Account Balance</dt>
                    <dd className="text-lg font-medium text-gray-900">${user?.balance?.toFixed(2) || '0.00'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Portfolio Value</dt>
                    <dd className="text-lg font-medium text-gray-900">${calculateTotalValue().toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {calculateTotalProfit() >= 0 ? (
                    <TrendingUpIcon className="h-6 w-6 text-green-400" />
                  ) : (
                    <TrendingDownIcon className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total P&L</dt>
                    <dd className={`text-lg font-medium ${calculateTotalProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateTotalProfit() >= 0 ? '+' : ''}${calculateTotalProfit().toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Portfolio Overview</h3>
                <Link
                  to="/portfolio"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View all
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {portfolio.length === 0 ? (
                <div className="text-center py-8">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No stocks in portfolio</h3>
                  <p className="mt-1 text-sm text-gray-500">Start trading to build your portfolio.</p>
                  <div className="mt-6">
                    <Link
                      to="/trading"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Trading
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{item.symbol}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.symbol}</div>
                          <div className="text-sm text-gray-500">{item.shares} shares</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">${item.market_value.toFixed(2)}</div>
                        <div className={`text-sm ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/trading"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Buy/Sell Stocks</h4>
                    <p className="text-sm text-gray-500">Execute trades in real-time</p>
                  </div>
                  <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-400" />
                </Link>

                <Link
                  to="/portfolio"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">View Portfolio</h4>
                    <p className="text-sm text-gray-500">Analyze your investments</p>
                  </div>
                  <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 