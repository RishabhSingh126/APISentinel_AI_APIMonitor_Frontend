import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to easily grab user data and logout functions anywhere in the app
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
};