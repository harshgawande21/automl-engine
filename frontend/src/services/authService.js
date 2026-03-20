import { API_ENDPOINTS } from '../utils/constants';
import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return response;
    },

    register: async (userData) => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response;
    },
    
    logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
    forgotPassword: (email) => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
    resetPassword: (data) => api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
    getProfile: () => api.get(API_ENDPOINTS.AUTH.PROFILE),
    updateProfile: (data) => api.put(API_ENDPOINTS.AUTH.PROFILE, data),
    updatePassword: async (passwordData) => {
        const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, passwordData);
        return response;
    }
};

export default authService;
