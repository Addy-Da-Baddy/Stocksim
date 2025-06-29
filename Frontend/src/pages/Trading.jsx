import { useState, useEffect } from 'react';
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Trading = ({ user }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    action: 'buy'
  });
  const [stockPrice, setStockPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchStockPrice = async (symbol) => {
    if (!symbol) return;
    
    setPriceLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/price/${symbol.toUpperCase()}`);
      const data = await response.json();
      
      if (response.ok) {
        setStockPrice(data.price);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch stock price');
        setStockPrice(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStockPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleSymbolChange = (e) => {
    const symbol = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, symbol }));
    
    if (symbol.length >= 1) {
      fetchStockPrice(symbol);
    } else {
      setStockPrice(null);
    }
  };

  const calculateTotal = () => {
    if (!stockPrice || !formData.shares) return 0;
    return stockPrice * parseFloat(formData.shares);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.symbol || !formData.shares || formData.shares <= 0) {
      setError('Please fill in all fields correctly');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = formData.action === 'buy' ? 'transaction/buy' : 'transaction/sell';
      
      const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          symbol: formData.symbol.toUpperCase(),
          shares: parseFloat(formData.shares),
          tz: timezone
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setFormData({ symbol: '', shares: '', action: 'buy' });
        setStockPrice(null);
        if (data.new_balance !== undefined) {
          const updatedUser = { ...user, balance: data.new_balance };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.location.reload();
        }
      } else {
        setError(data.error || `${formData.action === 'buy' ? 'Buy' : 'Sell'} failed`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trading</h1>
          <p className="mt-2 text-gray-600">Buy and sell stocks in real-time</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <XCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Place Order</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order Type
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, action: 'buy' }))}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                        formData.action === 'buy'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <TrendingUpIcon className="h-4 w-4 inline mr-2" />
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, action: 'sell' }))}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-t border-r border-b ${
                        formData.action === 'sell'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <TrendingDownIcon className="h-4 w-4 inline mr-2" />
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleSymbolChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., AAPL, GOOGL, MSFT"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="shares" className="block text-sm font-medium text-gray-700">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    id="shares"
                    name="shares"
                    value={formData.shares}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.symbol || !formData.shares}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.action === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    `${formData.action === 'buy' ? 'Buy' : 'Sell'} ${formData.symbol || 'Stock'}`
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="p-6">
              {!formData.symbol ? (
                <div className="text-center py-8 text-gray-500">
                  <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Enter a stock symbol to see order details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Current Price</span>
                    <div className="text-right">
                      {priceLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : stockPrice ? (
                        <span className="text-lg font-bold text-gray-900">${stockPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-sm text-red-600">Price unavailable</span>
                      )}
                    </div>
                  </div>

                  {formData.shares && stockPrice && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Shares</span>
                        <span className="text-sm font-medium text-gray-900">{formData.shares}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price per Share</span>
                        <span className="text-sm font-medium text-gray-900">${stockPrice.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium text-gray-900">Total {formData.action === 'buy' ? 'Cost' : 'Proceeds'}</span>
                          <span className="text-lg font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Account Balance</span>
                      <span className="text-sm font-bold text-blue-900">${user?.balance?.toFixed(2) || '0.00'}</span>
                    </div>
                    {formData.action === 'buy' && formData.shares && stockPrice && (
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-blue-600">Balance After Trade</span>
                        <span className={`text-sm font-medium ${user.balance - calculateTotal() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(user.balance - calculateTotal()).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading; 