import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../config/axiosConfig';

export const trainModel = createAsyncThunk('model/train', async (config, { rejectWithValue }) => {
    try {
        // Use smart-train endpoint — auto-detects task type, target, algorithm
        const params = new URLSearchParams({ filename: config.filename });
        if (config.targetColumn) params.append('target_column', config.targetColumn);
        if (config.features && config.features.length > 0) {
            config.features.forEach(f => params.append('features', f));
        }
        const response = await api.post(`/models/smart-train?${params.toString()}`);
        return response.data?.data || response.data;
    } catch (error) {
        const msg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Training failed';
        return rejectWithValue(msg);
    }
});

export const fetchModels = createAsyncThunk('model/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/models/');
        return response.data?.data || [];
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch models');
    }
});

export const deleteModel = createAsyncThunk('model/delete', async (modelId, { rejectWithValue }) => {
    try {
        await api.delete(`/models/${modelId}`);
        return modelId;
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to delete model');
    }
});

const modelSlice = createSlice({
    name: 'model',
    initialState: {
        models: [],
        currentModel: null,
        trainingStatus: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearTrainingStatus: (state) => { state.trainingStatus = null; },
        setCurrentModel: (state, action) => { state.currentModel = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(trainModel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.trainingStatus = 'training';
            })
            .addCase(trainModel.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingStatus = 'completed';
                state.currentModel = action.payload;
                if (action.payload?.id) {
                    state.models.unshift(action.payload);
                }
            })
            .addCase(trainModel.rejected, (state, action) => {
                state.loading = false;
                state.trainingStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchModels.pending, (state) => { state.loading = true; })
            .addCase(fetchModels.fulfilled, (state, action) => {
                state.loading = false;
                state.models = action.payload;
            })
            .addCase(fetchModels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteModel.fulfilled, (state, action) => {
                state.models = state.models.filter(m => m.id !== action.payload);
            });
    },
});

export const { clearError, clearTrainingStatus, setCurrentModel } = modelSlice.actions;
export default modelSlice.reducer;
