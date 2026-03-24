import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, Search } from 'lucide-react';

const Navbar = () => {
    // We grab the user details and the logout function from the Context we built!
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="h-16 glass-panel border-t-0 border-x-0 border-b border-slate-700/50 fixed top-0 w-full z-20 px-6 flex items-center justify-between rounded-none">
            {/* Logo Area */}
            <div className="flex items-center gap-2 w-64">
                <Activity className="text-primary animate-pulse-slow" size={28} />
                <span className="text-xl font-bold tracking-tight text-white">
                    API<span className="text-primary">Monitor</span>
                </span>
            </div>

            {/* Search Bar (Visual/UI element) */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search endpoints..." 
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                    />
                </div>
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    {/* Generates a colorful avatar based on the first letter of the email */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-300 hidden sm:block">
                        {user?.email || 'Guest'}
                    </span>
                </div>
                
                {/* Logout Button */}
                <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
