import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload || null;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload || "An unexpected error occurred.";
            state.loading = false;
        },
    },
    // You can add extraReducers for handling other actions if needed
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

// Export the reducer as the default export
export default userSlice.reducer;
