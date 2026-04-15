import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dataService from '../services/dataService';

export const uploadDataset = createAsyncThunk('data/upload', async (formData, { rejectWithValue }) => {
    try {
        const response = await dataService.uploadDataset(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
});

export const fetchDatasets = createAsyncThunk('data/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await dataService.listDatasets();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch datasets');
    }
});

export const fetchPreview = createAsyncThunk('data/preview', async (datasetId, { rejectWithValue }) => {
    try {
        const response = await dataService.getPreview(datasetId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch preview');
    }
});

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        datasets: [],
        currentDataset: null,
        activeDataset: null,  // persists across pages for the session
        preview: null,
        loading: false,
        uploadProgress: 0,
        error: null,
    },
    reducers: {
        setCurrentDataset: (state, action) => {
            state.currentDataset = action.payload;
        },
        setActiveDataset: (state, action) => {
            // Persists the active dataset for the entire session
            state.activeDataset = action.payload;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        clearDataError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadDataset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadDataset.fulfilled, (state, action) => {
                state.loading = false;
                state.datasets.push(action.payload);
                state.currentDataset = action.payload;
                state.activeDataset = action.payload; // auto-set as active
            })
            .addCase(uploadDataset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDatasets.fulfilled, (state, action) => {
                state.datasets = action.payload;
            })
            .addCase(fetchPreview.fulfilled, (state, action) => {
                state.preview = action.payload;
            });
    },
});

export const { setCurrentDataset, setActiveDataset, setUploadProgress, clearDataError } = dataSlice.actions;
export default dataSlice.reducer;
