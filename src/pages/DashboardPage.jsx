import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Server, DollarSign, Plus, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import AddApiModal from '../components/AddApiModal';

const DashboardPage = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchEndpoints = async () => {
        try {
            setLoading(true);
            // const response = await api.get('/api/config');
            const response = await api.get('/api/endpoints');
            setEndpoints(response.data);
        } catch (error) {
            console.error("Failed to fetch endpoints", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the page loads
    useEffect(() => {
        fetchEndpoints();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Overview of your API health and metrics.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-slate-950 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                >
                    <Plus size={18} />
                    Monitor New API
                </button>
            </div>

            {/* The "Bento Box" Grid for Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard 
                    title="Total APIs Monitored" 
                    value={endpoints.length} 
                    icon={<Server size={20} />} 
                />
                <MetricCard 
                    title="System Uptime" 
                    value="99.9%" 
                    icon={<Activity size={20} />} 
                    trend="0.1%" 
                    trendPositive={true} 
                />
                <MetricCard 
                    title="Est. Monthly Cost" 
                    value="$0.00" 
                    icon={<DollarSign size={20} />} 
                    trend="Stable" 
                    trendPositive={true} 
                />
            </div>

            {/* API Endpoints List */}
            <h2 className="text-lg font-semibold text-white mb-4">Your Monitored Services</h2>
            
            {loading ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">Loading your APIs...</div>
            ) : endpoints.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-xl border border-dashed border-slate-700">
                    <Server className="mx-auto text-slate-500 mb-3" size={32} />
                    <h3 className="text-white font-medium mb-1">No APIs found</h3>
                    <p className="text-slate-400 text-sm mb-4">Start by adding an API endpoint to monitor its health.</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-primary hover:underline text-sm font-medium"
                    >
                        + Add your first API
                    </button>
                </div>
            ) : (
                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 bg-slate-900/20 text-xs uppercase tracking-wider text-slate-400">
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">URL</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {endpoints.map((api) => (
                                <tr key={api.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {/* Glowing Dot Status Indicator */}
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                            </span>
                                            <span className="text-sm text-emerald-400 font-medium">Online</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-white font-medium">{api.name}</td>
                                    <td className="p-4 text-slate-400 text-sm font-mono truncate max-w-xs">{api.url}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => navigate(`/api/${api.id}`)}
                                            className="text-primary hover:text-white text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            View Metrics →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* The Modal we built in step 24! */}
            <AddApiModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchEndpoints} // Refresh the list after adding!
            />
        </div>
    );
};

export default DashboardPage;