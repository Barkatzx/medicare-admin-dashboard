// src/store/slices/salesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import toast from "react-hot-toast";

interface SalesState {
  salesData: {
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
  salesSummary: any | null;
  loading: boolean;
  summaryLoading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  salesData: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  salesSummary: null,
  loading: false,
  summaryLoading: false,
  error: null,
};

export const fetchSalesData = createAsyncThunk(
  "sales/fetchData",
  async (period: "daily" | "weekly" | "monthly") => {
    let data;
    switch (period) {
      case "daily":
        data = await api.getDailySales();
        break;
      case "weekly":
        data = await api.getWeeklySales();
        break;
      case "monthly":
        data = await api.getMonthlySales();
        break;
    }
    return { period, data: Array.isArray(data) ? data : [] };
  },
);

export const fetchSalesSummary = createAsyncThunk(
  "sales/fetchSummary",
  async () => {
    const data = await api.getSalesSummary();
    return data;
  },
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSalesData: (state) => {
      state.salesData = { daily: [], weekly: [], monthly: [] };
      state.salesSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales Data
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData[action.payload.period] = action.payload.data;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sales data";
        toast.error("Failed to load sales data");
      })
      // Fetch Sales Summary
      .addCase(fetchSalesSummary.pending, (state) => {
        state.summaryLoading = true;
      })
      .addCase(fetchSalesSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.salesSummary = action.payload;
      })
      .addCase(fetchSalesSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.error.message || "Failed to fetch sales summary";
        toast.error("Failed to load sales summary");
      });
  },
});

export const { clearSalesData } = salesSlice.actions;
export default salesSlice.reducer;
