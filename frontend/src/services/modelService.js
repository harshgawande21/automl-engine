import { API_ENDPOINTS } from '../utils/constants';
import api from './api';

const modelService = {
    trainModel: (config) => api.post(API_ENDPOINTS.MODEL.TRAIN, config),
    evaluateModel: (modelId) => api.get(`${API_ENDPOINTS.MODEL.EVALUATE}/${modelId}`),
    listModels: () => api.get(API_ENDPOINTS.MODEL.LIST),
    getModel: (modelId) => api.get(`${API_ENDPOINTS.MODEL.LIST}/${modelId}`),
    deleteModel: (modelId) => api.delete(`${API_ENDPOINTS.MODEL.LIST}/${modelId}`),
    hyperparameterTuning: (config) => api.post(API_ENDPOINTS.MODEL.HYPERPARAMETER, config),
};

export default modelService;
