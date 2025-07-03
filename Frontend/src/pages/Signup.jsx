import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../api';

export default function SignUp() {
    const [form, setForm] = useState({username: '', email: '', password: '', first_name: '', last_name: '', phone_number: '', date_of_birth: '', address: ''});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/register', form);
            setMsg('Registration successful! Please log in.');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
        }
        catch (err) {
            setMsg(err.response?.data?.error || 'Registration failed');
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div 
                className="relative z-10 max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-green-500/20 overflow-hidden"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-8">
                    <motion.h2 
                        className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Create Account
                    </motion.h2>
                    <p className="text-center text-gray-400 mb-8">Join the future of trading.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div className="relative" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                                <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="username" placeholder="Username" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.username} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="email" name="email" placeholder="Email" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.email} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative md:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                                <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="password" name="password" placeholder="Password" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.password} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                                <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="first_name" placeholder="First Name" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.first_name} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                                <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="last_name" placeholder="Last Name" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.last_name} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                                <FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="tel" name="phone_number" placeholder="Phone Number" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.phone_number} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                                <FaCalendar className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="date" name="date_of_birth" placeholder="Date of Birth" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.date_of_birth} onChange={handleChange} required />
                            </motion.div>
                            <motion.div className="relative md:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
                                <FaMapMarkerAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="address" placeholder="Address" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" value={form.address} onChange={handleChange} required />
                            </motion.div>
                        </div>
                        <motion.button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Register
                        </motion.button>
                    </form>
                    {msg && <p className="mt-4 text-sm text-center text-yellow-400">{msg}</p>}
                    <p className="mt-6 text-sm text-center text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-green-400 hover:text-green-300 transition-colors duration-300">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}