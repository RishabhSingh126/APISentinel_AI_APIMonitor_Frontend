import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Import our beautiful Glass Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Import Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApiDetailsPage from './pages/ApiDetailsPage';
import SettingsPage from './pages/SettingsPage';

// A special wrapper that kicks users out if they don't have a token
const ProtectedLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-primary font-mono animate-pulse">Initializing System...</div>;
    }

    // If not logged in, boot them back to the login screen
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If logged in, show the Sidebar, Navbar, and the page content (Outlet)
    return (
        <div className="flex h-screen overflow-hidden bg-slate-950">
            <Navbar />
            <Sidebar />
            <main className="flex-1 overflow-y-auto pt-16 pl-64 pb-12">
                <Outlet />
            </main>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<LoginPage />} />

                    {/* Protected Routes (Requires Login) */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/api/:id" element={<ApiDetailsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        {/* We don't have a specific billing page yet, so route to dashboard for now */}
                        <Route path="/billing" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;