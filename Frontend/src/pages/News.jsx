import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api';

const News = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/news');
        setNews(res.data);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-serif text-gray-800 p-8">
       <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors font-sans inline-block mb-8">
          &larr; Back to Dashboard
        </Link>
      </motion.div>
      <motion.header 
        className="text-center my-12 border-b-4 border-gray-800 pb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-6xl font-bold text-gray-900">The Financial Times</h1>
        <p className="text-lg text-gray-600">Your Daily Briefing on Market Movers and Shakers</p>
      </motion.header>

      {isLoading ? (
        <div className="text-center text-2xl">Loading latest headlines...</div>
      ) : error ? (
        <div className="text-center text-2xl text-red-600">{error}</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            },
            hidden: { opacity: 0 }
          }}
        >
          {news.map((article, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden border border-gray-200 flex flex-col transform hover:-translate-y-3 transition-transform duration-300"
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
            >
              <div className="p-6 flex-grow">
                <p className="text-sm text-gray-500 mb-2">{article.source} &bull; {formatDate(article.publishedAt)}</p>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h2>
                <p className="text-gray-700 leading-relaxed flex-grow">{article.description}</p>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center transition-colors"
                >
                  Read Full Story <FaExternalLinkAlt className="ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default News;
