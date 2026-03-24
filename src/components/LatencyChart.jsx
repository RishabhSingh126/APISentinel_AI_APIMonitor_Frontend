import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom Tooltip so it matches our Midnight Glass theme when you hover over a point
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-3 border-primary/50 text-sm shadow-2xl">
                <p className="text-slate-400 mb-1">{label}</p>
                <p className="text-primary font-bold text-lg flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></span>
                    {payload[0].value} ms
                </p>
            </div>
        );
    }
    return null;
};

const LatencyChart = ({ data }) => {
    // If we have no data yet, show a nice empty state
    if (!data || data.length === 0) {
        return (
            <div className="h-72 w-full flex items-center justify-center text-slate-500 font-mono">
                Waiting for ping data...
            </div>
        );
    }

    return (
        <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    {/* Faint, dashed horizontal grid lines only */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    
                    <XAxis 
                        dataKey="time" 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        minTickGap={30}
                    />
                    
                    <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}ms`}
                    />
                    
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    {/* The Glowing Cyan Line! */}
                    <Line 
                        type="monotone" 
                        dataKey="latencyMs" 
                        stroke="#38bdf8" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#38bdf8", stroke: "#0f172a", strokeWidth: 2 }}
                        style={{ filter: "drop-shadow(0px 0px 8px rgba(56, 189, 248, 0.6))" }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LatencyChart;