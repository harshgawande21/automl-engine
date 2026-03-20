import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sidebarOpen: true,
        theme: 'dark',
        toasts: [],
        activeModal: null,
        globalLoading: false,
    },
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        addToast: (state, action) => {
            state.toasts.push({
                id: Date.now(),
                ...action.payload,
            });
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
        openModal: (state, action) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
        setGlobalLoading: (state, action) => {
            state.globalLoading = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    addToast,
    removeToast,
    openModal,
    closeModal,
    setGlobalLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
