import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const AddApiModal = ({ isOpen, onClose, onSuccess }) => {
    // React state to hold the form inputs
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        expectedKeyword: '',
        costPer1000Requests: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If the modal isn't open, render absolutely nothing
    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Format the cost as a number (or 0 if left blank) before sending to Java
            const payload = {
                ...formData,
                costPer1000Requests: formData.costPer1000Requests ? parseFloat(formData.costPer1000Requests) : 0
            };
            
            // Send to our Spring Boot backend!
            // await api.post('/api/config', payload);
            await api.post('/api/endpoints', payload);
            
            // Success! Tell the dashboard to refresh, close the modal, and wipe the form
            onSuccess();
            onClose();
            setFormData({ name: '', url: '', expectedKeyword: '', costPer1000Requests: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add API endpoint.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // The dark, blurred background overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            
            {/* The Glass Modal Box */}
            <div className="glass-panel w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-xl font-bold text-white mb-6">Monitor New API</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">API Name</label>
                        <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Payment Gateway"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Endpoint URL</label>
                        <input 
                            type="url" 
                            name="url"
                            required
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://api.example.com/v1/health"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Expected Keyword (Optional)</label>
                        <input 
                            type="text" 
                            name="expectedKeyword"
                            value={formData.expectedKeyword}
                            onChange={handleChange}
                            placeholder="e.g., status:ok"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                        />
                        <p className="text-xs text-slate-500 mt-1">We will alert you if this word is missing from the response.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Cost per 1,000 Requests ($)</label>
                        <input 
                            type="number" 
                            step="0.0001"
                            name="costPer1000Requests"
                            value={formData.costPer1000Requests}
                            onChange={handleChange}
                            placeholder="e.g., 0.005"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-6 bg-primary hover:bg-primary/90 text-slate-950 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex justify-center"
                    >
                        {loading ? 'Saving...' : 'Start Monitoring'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddApiModal;