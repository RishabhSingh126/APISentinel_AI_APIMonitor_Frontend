import axios from 'axios';

const api = axios.create({
    // 👇 UPDATED: Now pointing to your live Render backend!
    baseURL: 'https://apisentinel-ai-apimonitor-backend.onrender.com', 
});

// INTERCEPTOR: This runs automatically before EVERY request
api.interceptors.request.use(
    (config) => {
        // Grab the token from browser storage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Grab the Gemini Key and force it onto every request!
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