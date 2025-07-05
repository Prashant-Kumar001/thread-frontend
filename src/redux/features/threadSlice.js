import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    input: false,
    loading: false,
    error: null,
};

const threadSlice = createSlice({
    name: 'thread',
    initialState,
    reducers: {
        setInput: (state, action) => {
            state.input = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetThreadState: (state) => {
            state.input = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setInput,
    setLoading,
    setError,
    clearError,
    resetThreadState,
} = threadSlice.actions;

export default threadSlice.reducer;
