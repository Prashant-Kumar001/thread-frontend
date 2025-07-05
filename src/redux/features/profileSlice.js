import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  edit: false,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setEdit: (state, action) => {
      state.edit = action.payload;
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
  },
});

export const {
  setEdit,
  setLoading,
  setError,
  clearError,
} = profileSlice.actions;

export default profileSlice.reducer;
