// src/store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, DashboardData } from "@/config/api";
import toast from "react-hot-toast";

interface DashboardState {
  statsData: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastFetchAttempt: number | null;
}

const initialState: DashboardState = {
  statsData: null,
  loading: false,
  error: null,
  lastFetchAttempt: null,
};

// dashboardSlice.ts
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDashboardData();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch dashboard statistics",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.statsData = null;
      state.error = null;
    },
    setFallbackData: (state) => {
      // Set fallback data when API fails
      state.statsData = {
        today: { sales: 0, orders: 0, items: 0 },
        this_week: { sales: 0, orders: 0, items: 0 },
        this_month: { sales: 0, orders: 0, items: 0 },
        this_year: { sales: 0, orders: 0, items: 0 },
        lifetime: { sales: 0, orders: 0, customers: 0, products_sold: 0 },
        growth: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
        recent_orders: [],
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastFetchAttempt = Date.now();
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statsData = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch dashboard statistics";

        // Set fallback data so UI doesn't break
        if (!state.statsData) {
          state.statsData = {
            today: { sales: 0, orders: 0, items: 0 },
            this_week: { sales: 0, orders: 0, items: 0 },
            this_month: { sales: 0, orders: 0, items: 0 },
            this_year: { sales: 0, orders: 0, items: 0 },
            lifetime: { sales: 0, orders: 0, customers: 0, products_sold: 0 },
            growth: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
            recent_orders: [],
          };
        }

        // Only show toast on first few failures to avoid spam
        const attempts = state.lastFetchAttempt
          ? Math.floor((Date.now() - state.lastFetchAttempt) / 1000)
          : 0;
        if (attempts === 0 || attempts > 30) {
          toast.error("Unable to load dashboard data. Using fallback values.");
        }
      });
  },
});

export const { clearDashboardData, setFallbackData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
