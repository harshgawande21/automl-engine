import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import predictionService from '../services/predictionService';

export const predictSingle = createAsyncThunk('prediction/single', async (data, { rejectWithValue }) => {
    try {
        const response = await predictionService.predictSingle(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Prediction failed');
    }
});

export const predictBatch = createAsyncThunk('prediction/batch', async (formData, { rejectWithValue }) => {
    try {
        const response = await predictionService.predictBatch(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Batch prediction failed');
    }
});

export const fetchPredictionHistory = createAsyncThunk('prediction/history', async (params, { rejectWithValue }) => {
    try {
        const response = await predictionService.getHistory(params);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
});

const predictionSlice = createSlice({
    name: 'prediction',
    initialState: {
        results: null,
        batchResults: null,
        history: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearResults: (state) => {
            state.results = null;
            state.batchResults = null;
        },
        clearPredictionError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(predictSingle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(predictSingle.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(predictSingle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(predictBatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(predictBatch.fulfilled, (state, action) => {
                state.loading = false;
                state.batchResults = action.payload;
            })
            .addCase(predictBatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPredictionHistory.fulfilled, (state, action) => {
                state.history = action.payload;
            });
    },
});

export const { clearResults, clearPredictionError } = predictionSlice.actions;
export default predictionSlice.reducer;
