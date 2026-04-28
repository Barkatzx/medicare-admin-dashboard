// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import orderReducer from "./slices/orderSlice";
import salesReducer from "./slices/salesSlice";
import dashboardReducer from "./slices/dashboardSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    sales: salesReducer,
    dashboard: dashboardReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
