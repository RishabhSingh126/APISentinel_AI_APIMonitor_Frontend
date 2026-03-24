import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, CreditCard } from 'lucide-react';

const Sidebar = () => {
    // This hook tells us the current URL so we can highlight the active menu item
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Billing', path: '/billing', icon: <CreditCard size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="w-64 glass-panel border-l-0 border-y-0 border-r border-slate-700/50 flex flex-col h-screen fixed left-0 top-0 pt-20 rounded-none z-10">
            <div className="flex flex-col gap-2 px-4 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
            
            {/* Version Info pinned to bottom */}
            <div className="mt-auto mb-6 px-8 text-xs text-slate-600 font-mono">
                v1.0.0 Enterprise
            </div>
        </aside>
    );
};

export default Sidebar;