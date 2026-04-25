// src/store/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, Order } from "@/config/api";
import toast from "react-hot-toast";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async ({
    page,
    limit,
    status,
  }: {
    page: number;
    limit: number;
    status?: string;
  }) => {
    const response = await api.getAllOrders(page, limit, status);
    return response;
  },
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }: { orderId: string; status: string }) => {
    const response = await api.updateOrderStatus(orderId, status);
    return response;
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        toast.success("Order status updated");
      });
  },
});

export default orderSlice.reducer;
