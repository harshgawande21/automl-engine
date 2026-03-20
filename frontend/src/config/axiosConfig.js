import axios from 'axios';
import environment from './environment';

console.log('API Base URL:', environment.API_BASE_URL); // Debug logging

const api = axios.create({
    baseURL: environment.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Only log for non-mock requests
        if (!config.url?.includes('mock')) {
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => {
        // Only log for non-mock requests
        if (!response.config.url?.includes('mock')) {
            console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
        }
        return response;
    },
    (error) => {
        // Only log for non-mock requests
        if (!error.config?.url?.includes('mock')) {
            console.error('[API Response Error]', error.response?.data || error.message);
        }
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
