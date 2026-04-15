import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../config/axiosConfig';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const data = response.data;
        const token = data.access_token || data.token;
        if (!token) return rejectWithValue('No token received');
        localStorage.setItem('authToken', token);
        return { token, user: data.user || null };
    } catch (error) {
        const msg = error.response?.data?.detail || error.response?.data?.message || 'Login failed. Check your credentials.';
        return rejectWithValue(msg);
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.detail || error.response?.data?.message || 'Registration failed.';
        return rejectWithValue(msg);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('authToken') || null,
        isAuthenticated: !!localStorage.getItem('authToken'),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authToken');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                localStorage.removeItem('authToken');
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
