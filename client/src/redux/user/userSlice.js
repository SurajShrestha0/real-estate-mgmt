import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true; // Set loading to true when starting sign-in
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
    updateUserStart: (state) => {
      state.loading = true; // Set loading to true when starting the update operation
      state.error = null; // Reset error when starting the update operation
    },
    updateUserSuccess: (state, action) => {
      console.log("Updated user data:", action.payload);
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.currentUser = null; // Reset currentUser to null on failure
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
