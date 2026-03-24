import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Make sure this matches your Spring Boot port!
});

// INTERCEPTOR: This runs automatically before EVERY request
api.interceptors.request.use(
    (config) => {
        // Grab the token from browser storage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 👇 NEW: Grab the Gemini Key and force it onto every request!
        const geminiKey = localStorage.getItem('geminiApiKey');
        if (geminiKey) {
            config.headers['X-Gemini-Key'] = geminiKey;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;