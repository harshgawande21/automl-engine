import { API_ENDPOINTS } from '../utils/constants';
import api from './api';

const dataService = {
    uploadDataset: (formData) =>
        api.post(API_ENDPOINTS.DATA.UPLOAD, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getPreview: (datasetId) => api.get(`${API_ENDPOINTS.DATA.PREVIEW}/${datasetId}`),
    processData: (config) => api.post(API_ENDPOINTS.DATA.PROCESS, config),
    listDatasets: () => api.get(API_ENDPOINTS.DATA.DATASETS),
    deleteDataset: (datasetId) => api.delete(`${API_ENDPOINTS.DATA.DATASETS}/${datasetId}`),
    getDatasetInfo: (datasetId) => api.get(`${API_ENDPOINTS.DATA.DATASETS}/${datasetId}`),
};

export default dataService;
