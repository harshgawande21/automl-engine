import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import monitoringService from '../services/monitoringService';

export const fetchSystemHealth = createAsyncThunk('monitoring/health', async (_, { rejectWithValue }) => {
    try {
        const response = await monitoringService.getSystemHealth();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch health');
    }
});

export const fetchDriftData = createAsyncThunk('monitoring/drift', async (modelId, { rejectWithValue }) => {
    try {
        const response = await monitoringService.getDriftData(modelId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch drift data');
    }
});

const monitoringSlice = createSlice({
    name: 'monitoring',
    initialState: {
        health: null,
        drift: null,
        latency: [],
        errors: [],
        usage: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearMonitoringError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSystemHealth.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSystemHealth.fulfilled, (state, action) => {
                state.loading = false;
                state.health = action.payload;
            })
            .addCase(fetchSystemHealth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDriftData.fulfilled, (state, action) => {
                state.drift = action.payload;
            });
    },
});

export const { clearMonitoringError } = monitoringSlice.actions;
export default monitoringSlice.reducer;
