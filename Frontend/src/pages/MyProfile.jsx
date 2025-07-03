import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get('/user/details');
      setUserDetails(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error('Failed to fetch user details', error);
      setMessage('Failed to load profile data.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/user/details', formData);
      setMessage(res.data.message);
      setIsEditing(false);
      fetchUserDetails(); // Refresh details
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update details.');
    }
  };

  if (!userDetails) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Loading Profile...</p></div>;
  }

  const InfoField = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4">
      <div className="bg-gray-800 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-lg font-semibold">{value || 'Not set'}</p>
      </div>
    </div>
  );

  const EditField = ({ name, label, value, onChange }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        value={value || ''}
        onChange={onChange}
        className="w-full bg-gray-900/70 border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/50 text-white font-sans p-8">
       <div className="absolute top-4 left-4">
        <Link to="/dashboard" className="text-green-400 hover:text-green-300 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 mt-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-400">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {message && <p className="text-center text-yellow-400 mb-4">{message}</p>}

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoField icon={<FaUser className="text-green-400" />} label="Username" value={userDetails.username} />
            <InfoField icon={<FaEnvelope className="text-green-400" />} label="Email" value={userDetails.email} />
            <InfoField icon={<FaUser className="text-green-400" />} label="First Name" value={userDetails.first_name} />
            <InfoField icon={<FaUser className="text-green-400" />} label="Last Name" value={userDetails.last_name} />
            <InfoField icon={<FaPhone className="text-green-400" />} label="Phone Number" value={userDetails.phone_number} />
            <InfoField icon={<FaCalendar className="text-green-400" />} label="Date of Birth" value={userDetails.date_of_birth} />
            <InfoField icon={<FaMapMarkerAlt className="text-green-400" />} label="Address" value={userDetails.address} />
          </div>
        ) : (
          <form onSubmit={handleUpdateDetails} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditField name="first_name" label="First Name" value={formData.first_name} onChange={handleInputChange} />
              <EditField name="last_name" label="Last Name" value={formData.last_name} onChange={handleInputChange} />
              <EditField name="phone_number" label="Phone Number" value={formData.phone_number} onChange={handleInputChange} />
              <EditField name="date_of_birth" label="Date of Birth" value={formData.date_of_birth} onChange={handleInputChange} />
              <div className="md:col-span-2">
                <EditField name="address" label="Address" value={formData.address} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default MyProfile;
