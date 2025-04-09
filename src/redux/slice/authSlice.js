import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  allUsers: [],
  id: null,
  name: null,
  user_position: null,
  user_type: null,
  company_id: null,
  company_name: null,
  email: null,
  token_expire_time: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.allUsers = action.payload.allUsers;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.user_position = action.payload.user_position;
      state.user_type = action.payload.user_type;
      state.company_id = action.payload.company_id;
      state.company_name = action.payload.company_name;
      state.email = action.payload.email;
      state.token_expire_time = action.payload.token_expire_time;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
