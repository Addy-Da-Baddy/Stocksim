import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

const CommunityShop = () => {
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [showMyItems, setShowMyItems] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.sub);
      } catch (error) {
        console.error('Invalid token', error);
        setError('Invalid session. Please log in again.');
      }
    } else {
      setError('You must be logged in to view the shop.');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchShopItems();
      fetchMyItems();
    }
  }, [user]);

  const fetchShopItems = async () => {
    try {
      const res = await api.get('/community/shop');
      setItems(res.data);
    } catch (err) {
      setError('Failed to load shop items.');
    }
  };

  const fetchMyItems = async () => {
    try {
      const res = await api.get('/community/myitems');
      setMyItems(res.data);
    } catch (err) {
      setError('Failed to load your items.');
    }
  };

  const handlePurchase = async (itemId) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.post('/community/purchase', { item_id: itemId });
      setSuccessMessage(res.data.message || 'Purchase successful!');
      if (showMyItems) {
        fetchMyItems(); // Refresh user's items after purchase
      }
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const isItemPurchased = (itemId) => {
    return myItems.some(item => item.id === itemId);
  }

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const handleToggleMyItems = () => {
    const willShow = !showMyItems;
    setShowMyItems(willShow);
    if (willShow) {
      fetchMyItems();
    }
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Community Shop</h1>
      {error && <p className="text-red-500 bg-red-900/50 p-3 rounded-lg mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 bg-green-900/50 p-3 rounded-lg mb-4">{successMessage}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => {
          const purchased = isItemPurchased(item.id);
          return (
          <motion.div 
            key={item.id}
            className={`bg-gray-800 p-6 rounded-lg ${purchased ? 'opacity-50' : ''}`}
            whileHover={!purchased ? { scale: 1.05 } : {}}
          >
            <div className="text-4xl mb-4">{item.emoji}</div>
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-gray-400">{item.description}</p>
            <p className="text-green-400 font-bold mt-4">Cost: {formatCurrency(item.cost)}</p>
            <p className="text-blue-400">Score: +{item.score_value}</p>
            <button 
              onClick={() => !purchased && handlePurchase(item.id)}
              className={`mt-4 font-bold py-2 px-4 rounded ${purchased ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={purchased}
            >
              {purchased ? 'Already Purchased' : 'Purchase'}
            </button>
          </motion.div>
        )})}
      </div>

      <div className="flex items-center justify-between mt-12 mb-8">
        <h2 className="text-3xl font-bold">My Items</h2>
        <button 
          onClick={handleToggleMyItems}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showMyItems ? 'Hide' : 'Show'} My Items
        </button>
      </div>

      {showMyItems && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myItems.length > 0 ? myItems.map(item => (
            <motion.div key={item.id} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-400">{item.description}</p>
              <p className="text-sm text-gray-500 mt-2">Purchased: {new Date(item.purchase_date).toLocaleDateString()}</p>
            </motion.div>
          )) : <p>You haven't purchased any items yet.</p>}
        </div>
      )}
    </div>
  );
};

export default CommunityShop;
