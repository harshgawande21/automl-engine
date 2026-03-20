import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dataReducer from './dataSlice';
import modelReducer from './modelSlice';
import monitoringReducer from './monitoringSlice';
import predictionReducer from './predictionSlice';
import uiReducer from './uiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        data: dataReducer,
        model: modelReducer,
        prediction: predictionReducer,
        monitoring: monitoringReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
