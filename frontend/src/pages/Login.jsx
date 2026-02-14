import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User } from 'lucide-react';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Simple validation: trim whitespace and lowercase username
        const user = formData.username.trim().toLowerCase();
        const pass = formData.password.trim();

        if (user === 'admin' && pass === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            setError('Invalid credentials. Try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 p-8 text-center">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Activity className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">AI Smart Patient Triage</h2>
                    <p className="text-blue-100 mt-2">Hospital Triage Dashboard</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Staff ID / Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:scale-[1.01]"
                        >
                            Login
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-xs text-slate-400">Pragyan AI Hackathon Prototype</p>
                            <p className="text-xs text-blue-300 mt-2">Hint: admin / admin123</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
