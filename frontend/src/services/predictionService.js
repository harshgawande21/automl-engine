import { API_ENDPOINTS } from '../utils/constants';
import api from './api';

const predictionService = {
    predictSingle: (data) => api.post(API_ENDPOINTS.PREDICTION.SINGLE, data),
    predictBatch: (formData) =>
        api.post(API_ENDPOINTS.PREDICTION.BATCH, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getHistory: (params) => api.get(API_ENDPOINTS.PREDICTION.HISTORY, { params }),
    getPrediction: (predictionId) => api.get(`${API_ENDPOINTS.PREDICTION.HISTORY}/${predictionId}`),
};

export default predictionService;
