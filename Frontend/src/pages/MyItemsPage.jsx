import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

const MyItemsPage = () => {
  const [myItems, setMyItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/community/myitems');
      setMyItems(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load your items.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading your items...</div>;
  }

  if (error) {
    return <div className="p-8 text-white">{error}</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">My Purchased Items</h1>
      {myItems.length === 0 ? (
        <p>You haven't purchased any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myItems.map(item => (
            <motion.div 
              key={item.id} 
              className="bg-gray-800 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-400">{item.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Purchased: {new Date(item.purchase_date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;
