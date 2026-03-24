import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Bell, Key } from 'lucide-react';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    fullName: 'Demo User',
    username: 'demouser123',
    email: 'demo@example.com',
    company: 'Acme Corp',
    discordWebhook: '',
    geminiApiKey: '' // NEW: Added Gemini Key to state
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [savedAlert, setSavedAlert] = useState(false);
  const [savedGemini, setSavedGemini] = useState(false);

  // Load existing keys from local storage when the page opens
  useEffect(() => {
    const savedWebhook = localStorage.getItem('discordWebhook') || '';
    const savedKey = localStorage.getItem('geminiApiKey') || '';
    setProfile(prev => ({ ...prev, discordWebhook: savedWebhook, geminiApiKey: savedKey }));
  }, []);

  const handleAlertUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('discordWebhook', profile.discordWebhook);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleGeminiUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('geminiApiKey', profile.geminiApiKey);
    setSavedGemini(true);
    setTimeout(() => setSavedGemini(false), 3000);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Logic for updating profile data (backend needed)
    alert("Profile update triggered!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password change triggered! (Backend connection needed to save permanently)");
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Account Settings</h1>
        <p className="text-slate-400 text-sm mb-8">Manage your profile, security, and integration preferences.</p>
      </div>

      {/* NEW: GEMINI AI SECTION */}
      <div className="glass-panel p-6 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Key className="text-emerald-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Google Gemini AI</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Paste your Google AI Studio key here to enable automated root-cause analysis for failed endpoints.
        </p>

        <form onSubmit={handleGeminiUpdate} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Gemini API Key</label>
            <input 
              type="password" 
              value={profile.geminiApiKey}
              onChange={(e) => setProfile({...profile, geminiApiKey: e.target.value})}
              placeholder="AIzaSy..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            <Save size={16} /> {savedGemini ? 'Key Saved!' : 'Save AI Key'}
          </button>
        </form>
      </div>

      {/* DISCORD ALERTS SECTION */}
      <div className="glass-panel p-6 border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-primary" size={24} />
          <h2 className="text-xl font-semibold text-white">Alert Notifications</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Configure where API Monitor should send alerts when your endpoints go down or AI detects an anomaly.
        </p>

        <form onSubmit={handleAlertUpdate} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Discord Webhook URL</label>
            <input 
              type="url" 
              value={profile.discordWebhook}
              onChange={(e) => setProfile({...profile, discordWebhook: e.target.value})}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-primary/90 text-slate-950 font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            <Save size={16} /> {savedAlert ? 'Saved!' : 'Save Alerts'}
          </button>
        </form>
      </div>

      {/* PROFILE SECTION */}
      <div className="glass-panel p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-primary" size={24} />
          <h2 className="text-xl font-semibold text-white">Profile Information</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
              <input 
                type="text" 
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email (Cannot be changed)</label>
              <input 
                type="email" 
                disabled
                value={profile.email}
                className="w-full bg-slate-900/30 border border-slate-800 rounded-lg py-2 px-3 text-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
              <input 
                type="text" 
                value={profile.company}
                onChange={(e) => setProfile({...profile, company: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-slate-800 text-white hover:bg-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            <Save size={16} /> Save Profile
          </button>
        </form>
      </div>

      {/* SECURITY SECTION */}
      <div className="glass-panel p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-primary" size={24} />
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
            <input 
              type="password" 
              required
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
            <input 
              type="password" 
              required
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="mt-4 bg-slate-800 text-white hover:bg-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;