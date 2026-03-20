// Application-wide constants
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        PROFILE: '/auth/profile',
    },
    DATA: {
        UPLOAD: '/data/upload',
        PREVIEW: '/data/preview',
        PROCESS: '/data/process',
        DATASETS: '/data/datasets',
    },
    MODEL: {
        TRAIN: '/model/train',
        EVALUATE: '/model/evaluate',
        LIST: '/model/list',
        HYPERPARAMETER: '/model/hyperparameter-tuning',
    },
    PREDICTION: {
        SINGLE: '/prediction/single',
        BATCH: '/prediction/batch',
        HISTORY: '/prediction/history',
    },
    MONITORING: {
        DRIFT: '/monitoring/drift',
        LATENCY: '/monitoring/latency',
        ERRORS: '/monitoring/errors',
        USAGE: '/monitoring/usage',
        HEALTH: '/monitoring/health',
    },
    EXPLAINABILITY: {
        SHAP: '/explainability/shap',
        LIME: '/explainability/lime',
        FEATURE_IMPORTANCE: '/explainability/feature-importance',
    },
};

export const MODEL_TYPES = {
    CLASSIFICATION: 'classification',
    REGRESSION: 'regression',
    CLUSTERING: 'clustering',
};

export const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

export const CHART_COLORS = [
    '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#3B82F6',
];

export const SIDEBAR_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Data Upload', path: '/data/upload', icon: 'Upload' },
    { label: 'Data Processing', path: '/data/processing', icon: 'Database' },
    { label: 'Model Training', path: '/model/training', icon: 'Brain' },
    { label: 'Hyperparameter Tuning', path: '/model/tuning', icon: 'SlidersHorizontal' },
    { label: 'Model Evaluation', path: '/model/evaluation', icon: 'BarChart3' },
    { label: 'Single Prediction', path: '/prediction/single', icon: 'Target' },
    { label: 'Batch Prediction', path: '/prediction/batch', icon: 'Layers' },
    { label: 'Explainability', path: '/explainability', icon: 'Lightbulb' },
    { label: 'Monitoring', path: '/monitoring', icon: 'Activity' },
    { label: 'Analytics', path: '/analytics', icon: 'TrendingUp' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
];
