import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import pagePermissionReducer from "../slice/permissionSlice";
// import pagePermissionReducer from "./permissionSlice";
// import uiReducer from "./uiSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  permissions: pagePermissionReducer,
  //   ui: uiReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE", // Ignore PURGE to prevent the warning
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
