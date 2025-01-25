import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserRequest(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.details = action.payload;
      state.loading = false;
    },
    fetchUserFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser(state, action) {
      state.details = { ...state.details, ...action.payload };
    },
  },
});

export const {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  updateUser,
} = userSlice.actions;
export default userSlice.reducer;
