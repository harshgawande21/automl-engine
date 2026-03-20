const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
// always ensure we hit the /api prefix, regardless of env variable
const environment = {
    API_BASE_URL: rawBase.endsWith('/api') ? rawBase : rawBase.replace(/\/+$/, '') + '/api',
    WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
    APP_NAME: 'AutoInsight',
    VERSION: '1.0.0',
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
};

export default environment;
