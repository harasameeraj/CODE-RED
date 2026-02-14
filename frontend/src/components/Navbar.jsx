import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, PlusCircle, FileText, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-700' : '';
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                    <Activity size={28} />
                    <span>AI Cloud Triage</span>
                </Link>
                <div className="flex space-x-4 items-center">
                    <Link to="/" className={`flex items-center space-x-1 px-3 py-2 rounded ${isActive('/')} hover:bg-blue-700 transition`}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/triage" className={`flex items-center space-x-1 px-3 py-2 rounded ${isActive('/triage')} hover:bg-blue-700 transition`}>
                        <PlusCircle size={18} />
                        <span>New Triage</span>
                    </Link>
                    <Link to="/patients" className={`flex items-center space-x-1 px-3 py-2 rounded ${isActive('/patients')} hover:bg-blue-700 transition`}>
                        <FileText size={18} />
                        <span>Records</span>
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('isAuthenticated');
                            // Force reload as a simple way to reset state in standard app flow, 
                            // or pass prop down. Since we access this via App state, a prop is cleaner.
                            // But for now let's just use window.location which is robust for this level of app.
                            window.location.href = '/login';
                        }}
                        className="text-blue-200 hover:text-white transition ml-4"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
