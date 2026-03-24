import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Lock, Mail, ArrowRight, Eye, EyeOff, UserPlus, User, Building, AtSign } from 'lucide-react';
import api from '../services/api';

const LoginPage = () => {
    // UI States
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // NEW!
    const [fullName, setFullName] = useState(''); 
    const [username, setUsername] = useState(''); // NEW!
    const [company, setCompany] = useState('');   
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // NEW: Check if passwords match before doing anything else!
        if (!isLoginMode && password !== confirmPassword) {
            setError("Passwords do not match! Please check and try again.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        if (isLoginMode) {
            // --- LOGIN LOGIC ---
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || "Invalid credentials.");
            }
        } else {
            // --- SIGN UP LOGIC ---
            try {
                // Sending the extra data! (Backend will ignore extra fields until we update Java later)
                await api.post('/api/auth/register', { 
                    email, 
                    password,
                    name: fullName,
                    username: username, // Added Username
                    company: company
                });
                
                setSuccessMsg("Account created successfully! Please sign in.");
                setIsLoginMode(true);
                setPassword(''); 
                setConfirmPassword(''); // Clear for safety
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Failed to create account. Email might already be in use.");
                }
            }
        }
        setIsLoading(false);
    };

    const handleDemoLogin = async () => {
        const demoEmail = 'demo@example.com';
        const demoPass = 'password123';
        
        setEmail(demoEmail);
        setPassword(demoPass);
        setIsLoading(true);
        setError(null);

        const result = await login(demoEmail, demoPass);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            try {
                await api.post('/api/auth/register', { email: demoEmail, password: demoPass });
                const retryResult = await login(demoEmail, demoPass);
                if (retryResult.success) navigate('/dashboard');
                else setError("Registered demo user, but login still failed.");
            } catch (err) {
                setError("Could not register demo user. Is your Spring Boot backend running?");
            }
        }
        setIsLoading(false);
    };

    // Helper to reset the form when switching modes
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError(null);
        setSuccessMsg(null);
        setFullName('');
        setUsername('');
        setCompany('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Background glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="glass-panel w-full max-w-md p-8 relative z-10 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col items-center mb-6">
                    <Activity className="text-primary animate-pulse-slow mb-4" size={48} />
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        API<span className="text-primary">Monitor</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-center text-sm">
                        {isLoginMode ? "Sign in to view your enterprise metrics." : "Create your enterprise account."}
                    </p>
                </div>

                {/* Messages */}
                {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm text-center">{error}</div>}
                {successMsg && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm text-center">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* --- THESE FIELDS ONLY SHOW DURING SIGN UP --- */}
                    {!isLoginMode && (
                        <>
                            <div>
                                <div className="relative animate-fade-in">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="relative animate-fade-in">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Username"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="relative animate-fade-in">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="Company / Organization (Optional)"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {/* ------------------------------------------- */}

                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-10 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD (ONLY ON SIGN UP) */}
                    {!isLoginMode && (
                        <div>
                            <div className="relative animate-fade-in">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-10 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-slate-950 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
                    >
                        {isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                        {!isLoading && (isLoginMode ? <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> : <UserPlus size={18} />)}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-3 text-center">
                    <p className="text-sm text-slate-400">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button 
                            onClick={toggleMode}
                            className="text-primary hover:underline font-medium"
                        >
                            {isLoginMode ? "Sign Up" : "Sign In"}
                        </button>
                    </p>

                    {isLoginMode && (
                        <button 
                            onClick={handleDemoLogin}
                            type="button"
                            disabled={isLoading}
                            className="text-sm text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50 mt-2"
                        >
                            Use Demo Credentials
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;