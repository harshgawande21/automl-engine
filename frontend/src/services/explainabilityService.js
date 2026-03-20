import { API_ENDPOINTS } from '../utils/constants';
import api from './api';

const explainabilityService = {
    getSHAP: (modelId, data) => api.post(`${API_ENDPOINTS.EXPLAINABILITY.SHAP}/${modelId}`, data),
    getLIME: (modelId, data) => api.post(`${API_ENDPOINTS.EXPLAINABILITY.LIME}/${modelId}`, data),
    getFeatureImportance: (modelId) =>
        api.get(`${API_ENDPOINTS.EXPLAINABILITY.FEATURE_IMPORTANCE}/${modelId}`),
};

export default explainabilityService;
