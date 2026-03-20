import { API_ENDPOINTS } from '../utils/constants';
import api from './api';

const monitoringService = {
    getDriftData: (modelId) => api.get(`${API_ENDPOINTS.MONITORING.DRIFT}/${modelId}`),
    getLatencyData: (params) => api.get(API_ENDPOINTS.MONITORING.LATENCY, { params }),
    getErrorRates: (params) => api.get(API_ENDPOINTS.MONITORING.ERRORS, { params }),
    getUsageAnalytics: (params) => api.get(API_ENDPOINTS.MONITORING.USAGE, { params }),
    getSystemHealth: () => api.get(API_ENDPOINTS.MONITORING.HEALTH),
};

export default monitoringService;
