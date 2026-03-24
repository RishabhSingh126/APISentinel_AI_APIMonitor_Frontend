import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // FIX: Capture both email AND role from the JWT!
                    setUser({ email: decodedToken.sub, role: decodedToken.role }); 
                }
            } catch (error) {
                console.error("Invalid token detected.", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const token = response.data.token;
            
            localStorage.setItem('token', token);
            
            const decodedToken = jwtDecode(token);
            // FIX: Capture role here too!
            setUser({ email: decodedToken.sub, role: decodedToken.role });
            
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Invalid credentials." 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};