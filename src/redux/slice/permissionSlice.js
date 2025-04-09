import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagePermissions: [],
  buttonPermissions: [],
  userTypeRole: [],
  years: [],
  isLoading: false,
  isError: false,
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    fetchPagePermissionSuccess: (state, action) => {
      state.pagePermissions = action.payload;
      state.isLoading = false;
    },
    fetchButtonPermissionSuccess: (state, action) => {
      state.buttonPermissions = action.payload;
      state.isLoading = false;
    },
    fetchUserTypeSuccess: (state, action) => {
      state.userTypeRole = action.payload;
      state.isLoading = false;
    },
    fetchYearsSuccess: (state, action) => {
      state.years = action.payload;
      state.isLoading = false;
    },
    fetchFailure: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const {
  fetchStart,
  fetchPagePermissionSuccess,
  fetchButtonPermissionSuccess,
  fetchUserTypeSuccess,
  fetchYearsSuccess,
  fetchFailure,
} = permissionSlice.actions;

export default permissionSlice.reducer;
