// src/store/slices/salesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import toast from "react-hot-toast";

interface DailyBreakdownItem {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

interface MonthlyBreakdownItem {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

interface ChartDataItem {
  label: string;
  sales: number;
  orders: number;
  avgOrderValue: number;
  itemsSold: number;
}

interface SalesState {
  salesData: {
    daily: ChartDataItem | null;
    weekly: ChartDataItem[] | null;
    monthly: ChartDataItem[] | null;
    yearly: ChartDataItem[] | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  salesData: {
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
  },
  loading: false,
  error: null,
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function transformDaily(data: any): ChartDataItem {
  return {
    label: data.date || "Today",
    sales: data.totalSales || 0,
    orders: data.totalOrders || 0,
    avgOrderValue: data.averageOrderValue || 0,
    itemsSold: data.totalItemsSold || 0,
  };
}

function transformWeekly(data: any): ChartDataItem[] {
  const breakdown: DailyBreakdownItem[] = data.daily_breakdown || [];
  // Figure out which day of week today is to label correctly
  const today = new Date();
  const todayIndex = today.getDay(); // 0=Sun
  return breakdown.map((item, i) => {
    // breakdown[0] = start of week (Sun), up to [6] = Sat
    const dayIndex = i % 7;
    return {
      label: DAY_NAMES[dayIndex],
      sales: item.totalSales || 0,
      orders: item.totalOrders || 0,
      avgOrderValue: item.averageOrderValue || 0,
      itemsSold: item.totalItemsSold || 0,
    };
  });
}

function transformMonthly(data: any): ChartDataItem[] {
  const breakdown: DailyBreakdownItem[] = data.daily_breakdown || [];
  return breakdown.map((item, i) => ({
    label: `${i + 1}`,
    sales: item.totalSales || 0,
    orders: item.totalOrders || 0,
    avgOrderValue: item.averageOrderValue || 0,
    itemsSold: item.totalItemsSold || 0,
  }));
}

function transformYearly(data: any): ChartDataItem[] {
  const breakdown: MonthlyBreakdownItem[] = data.monthly_breakdown || [];
  return breakdown.map((item, i) => ({
    label: MONTH_NAMES[i] || `M${i + 1}`,
    sales: item.totalSales || 0,
    orders: item.totalOrders || 0,
    avgOrderValue: item.averageOrderValue || 0,
    itemsSold: item.totalItemsSold || 0,
  }));
}

export const fetchSalesData = createAsyncThunk(
  "sales/fetchData",
  async (period: "daily" | "weekly" | "monthly" | "yearly") => {
    let raw: any;
    switch (period) {
      case "daily":
        raw = await api.getDailySales();
        return { period, data: transformDaily(raw?.data ?? raw) };
      case "weekly":
        raw = await api.getWeeklySales();
        return { period, data: transformWeekly(raw?.data ?? raw) };
      case "monthly":
        raw = await api.getMonthlySales();
        return { period, data: transformMonthly(raw?.data ?? raw) };
      case "yearly":
        raw = await api.getYearlySales();
        return { period, data: transformYearly(raw?.data ?? raw) };
    }
  },
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSalesData: (state) => {
      state.salesData = {
        daily: null,
        weekly: null,
        monthly: null,
        yearly: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          (state.salesData as any)[action.payload.period] = action.payload.data;
        }
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sales data";
        toast.error("Failed to load sales data");
      });
  },
});

export const { clearSalesData } = salesSlice.actions;
export default salesSlice.reducer;
