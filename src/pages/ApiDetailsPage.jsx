import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Terminal, ShieldAlert, Sparkles, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import api from '../services/api';
import LatencyChart from '../components/LatencyChart';
import MetricCard from '../components/MetricCard';

const ApiDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [aiSummary, setAiSummary] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // FEATURE 12: Pagination State
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchDeepMetrics = async () => {
            try {
                // Now fetching with ?page= variable!
                const response = await api.get(`/api/metrics/${id}?page=${page}&size=50`);
                setMetrics(response.data);
            } catch (error) {
                console.error("Failed to fetch metrics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeepMetrics();
        // Only auto-refresh if we are looking at the newest page (Page 0)
        let interval;
        if (page === 0) {
            interval = setInterval(fetchDeepMetrics, 30000);
        }
        return () => clearInterval(interval);
    }, [id, page]); 

    const handleGenerateAiReport = async () => {
        setAiLoading(true);
        setAiSummary('');

        // 1. Grab the saved key from the browser's storage
        const apiKey = localStorage.getItem('geminiApiKey');

        // 2. If the user hasn't saved a key yet, stop and warn them
        if (!apiKey) {
            setAiSummary("No Gemini API key found. Please save it in the Settings page first.");
            setAiLoading(false);
            return;
        }

        try {
            // 3. Send the request to Spring Boot, passing the key in the headers!
            const response = await api.get(`/api/metrics/${id}/summary`, {
                headers: {
                    'X-Gemini-Key': apiKey // Passing the secret to your backend
                }
            });
            setAiSummary(response.data.summary);
        } catch (error) {
            setAiSummary("Failed to contact AI service. Ensure your Spring Boot backend is configured to accept the key.");
        } finally {
            setAiLoading(false);
        }
    };

    // 👈 NEW: The Delete API logic
    const handleDeleteApi = async () => {
        // Native browser confirmation popup to prevent accidental clicks
        const confirmDelete = window.confirm("🚨 Are you sure you want to delete this API? All ping history will be permanently lost!");
        
        if (confirmDelete) {
            try {
                await api.delete(`/api/endpoints/${id}`);
                navigate('/'); // Send them back to the dashboard after deletion
            } catch (error) {
                console.error("Failed to delete API", error);
                alert("Failed to delete the API. Please try again.");
            }
        }
    };

    if (loading && !metrics) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Loading deep metrics...</div>;
    }

    if (!metrics) {
        return <div className="p-8 text-center text-rose-400">Failed to load API data.</div>;
    }

    const chartData = metrics.latencyGraph || [];
    const avgLatency = chartData.length 
        ? Math.round(chartData.reduce((sum, log) => sum + log.latencyMs, 0) / chartData.length) 
        : 0;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 glass-panel hover:bg-slate-800 transition-colors border border-slate-700">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Endpoint Metrics</h1>
                        <p className="text-slate-400 text-sm">Real-time latency and health analysis.</p>
                    </div>
                </div>
                
                {/* 👈 NEW: Button Group (Delete & AI side-by-side) */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDeleteApi}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/50 font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        Delete API
                    </button>

                    <button 
                        onClick={handleGenerateAiReport}
                        disabled={aiLoading}
                        className="bg-primary hover:bg-primary/90 text-slate-950 font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Sparkles size={18} className={aiLoading ? "animate-pulse" : ""} />
                        {aiLoading ? "Analyzing Logs..." : "Generate AI Report"}
                    </button>
                </div>
            </div>

            {aiSummary && (
                <div className="glass-panel p-5 border border-primary/30 bg-primary/5 animate-fade-in">
                    <h3 className="text-primary font-semibold flex items-center gap-2 mb-2">
                        <Sparkles size={16} /> AI Health Assessment
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed">{aiSummary}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Avg Latency" value={`${avgLatency}ms`} icon={<Activity size={20} />} />
                <MetricCard title="Total Requests" value={metrics.totalVolume || 0} icon={<Terminal size={20} />} />
                <MetricCard title="Success Rate" value="100%" icon={<ShieldAlert size={20} />} />
                <MetricCard title="Estimated Cost" value={`$${metrics.estimatedCost || 0}`} icon={<Activity size={20} />} trendPositive={false} />
            </div>

            <div className="glass-panel p-6 border border-slate-800">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-primary" /> Response Time (Page {metrics.currentPage + 1})
                </h2>
                <LatencyChart data={chartData} />
            </div>

            <div className="glass-panel p-0 overflow-hidden border border-slate-800">
                <div className="bg-slate-900/80 p-3 border-b border-slate-700/50 flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-slate-400" />
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Ping Terminal</span>
                    </div>
                </div>
                <div className="p-4 h-64 overflow-y-auto font-mono text-sm space-y-2 bg-[#0b1120] shadow-inner">
                    {chartData.slice().reverse().map((log, index) => (
                        <div key={index} className="flex gap-4 border-b border-slate-800/50 pb-2">
                            <span className="text-slate-500">[{log.time}]</span>
                            <span className="text-emerald-400">200</span>
                            <span className="text-slate-300 flex-1">OK</span>
                            <span className="text-primary">{log.latencyMs}ms</span>
                        </div>
                    ))}
                    {chartData.length === 0 && (
                        <div className="text-slate-600 animate-pulse">&gt; No logs found for this page...</div>
                    )}
                </div>
                
                {/* FEATURE 12: PAGINATION CONTROLS */}
                <div className="bg-slate-900/80 p-3 border-t border-slate-700/50 flex justify-between items-center text-sm">
                    <button 
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 bg-slate-800 rounded transition-colors"
                    >
                        <ChevronLeft size={16} /> Newer Logs
                    </button>
                    <span className="text-slate-500 font-mono">
                        Page {metrics.currentPage + 1} of {Math.max(1, metrics.totalPages)}
                    </span>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={metrics.isLast}
                        className="flex items-center gap-1 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 bg-slate-800 rounded transition-colors"
                    >
                        Older Logs <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiDetailsPage;