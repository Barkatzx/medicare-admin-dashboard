// src/components/dashboard/SalesChart.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSalesData, fetchSalesSummary } from "@/store/slices/salesSlice";
import {
  TrendingUp,
  Loader2,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  Percent,
  Tag,
} from "lucide-react";

type Period = "daily" | "weekly" | "monthly";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  period: Period;
}

interface SalesDataItem {
  date?: string;
  week?: string;
  month?: string;
  sales: number;
  orders: number;
}

interface StatusItem {
  status: string;
  totalSales: number;
  totalOrders: number;
}

interface TopCategory {
  id: string;
  name: string;
  totalSold: number;
}

interface OverallSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
  totalDiscounts: number;
  totalCustomers: number;
  topProducts: Array<{
    id: string;
    name: string;
    price: string;
    images: Array<{ url: string }>;
    totalSold: number;
  }>;
  topCategories: TopCategory[];
}

interface SalesSummary {
  overall_summary: OverallSummary;
  growth_percentage: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  sales_by_status: StatusItem[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
  period,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[200px]">
        <p className="text-sm font-semibold text-gray-900 mb-2">
          {period === "daily" ? "Date" : period === "weekly" ? "Week" : "Month"}
          : {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              ৳{payload[0]?.value?.toLocaleString() || 0}
            </span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {payload[1]?.value?.toLocaleString() || 0}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const STATUS_COLORS: Record<string, string> = {
  delivered: "#10b981",
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  confirmed: "#06b6d4",
  cancelled: "#ef4444",
};

export default function SalesChart() {
  const dispatch = useAppDispatch();
  const { salesData, salesSummary, loading, summaryLoading } = useAppSelector(
    (state) => state.sales,
  );
  const [period, setPeriod] = useState<Period>("daily");
  const [chartType, setChartType] = useState<"area" | "line">("area");
  const [view, setView] = useState<"chart" | "summary">("chart");

  useEffect(() => {
    dispatch(fetchSalesData(period));
  }, [dispatch, period]);

  useEffect(() => {
    if (!salesSummary) {
      dispatch(fetchSalesSummary());
    }
  }, [dispatch, salesSummary]);

  const getXAxisKey = (): string => {
    switch (period) {
      case "daily":
        return "date";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      default:
        return "date";
    }
  };

  const currentData: SalesDataItem[] = salesData[period] || [];
  const totalRevenue = currentData.reduce(
    (sum: number, item: SalesDataItem) => sum + (item.sales || 0),
    0,
  );
  const totalOrders = currentData.reduce(
    (sum: number, item: SalesDataItem) => sum + (item.orders || 0),
    0,
  );
  const averageRevenue =
    currentData.length > 0 ? totalRevenue / currentData.length : 0;

  const bestDay = currentData.reduce(
    (best: SalesDataItem, item: SalesDataItem) =>
      (item.sales || 0) > (best.sales || 0) ? item : best,
    { sales: 0, orders: 0 } as SalesDataItem,
  );

  const pieData =
    salesSummary?.sales_by_status
      ?.filter(
        (item: StatusItem) => item.totalSales > 0 || item.totalOrders > 0,
      )
      .map((item: StatusItem) => ({
        name: item.status,
        value: item.totalSales,
        orders: item.totalOrders,
      })) || [];

  if (loading && !salesData[period]?.length) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("chart")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            view === "chart"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <BarChart3 size={16} />
          Sales Chart
        </button>
        <button
          onClick={() => setView("summary")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            view === "summary"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <PieChartIcon size={16} />
          Sales Summary
        </button>
      </div>

      {view === "chart" ? (
        <div className="space-y-4">
          {/* Chart Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    period === p
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType("area")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  chartType === "area"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Area Chart
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  chartType === "line"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Line Chart
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-blue-700">
                ৳{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">Total Orders</p>
              <p className="text-lg font-bold text-emerald-700">
                {totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">Average Revenue</p>
              <p className="text-lg font-bold text-purple-700">
                ৳{averageRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">
                Best{" "}
                {period === "daily"
                  ? "Day"
                  : period === "weekly"
                    ? "Week"
                    : "Month"}
              </p>
              <p className="text-lg font-bold text-orange-700">
                ৳{bestDay.sales?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <ResponsiveContainer width="100%" height={350}>
              {chartType === "area" ? (
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey={getXAxisKey()}
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip period={period} />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorSales)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                </AreaChart>
              ) : (
                <ComposedChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey={getXAxisKey()}
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#3b82f6"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip period={period} />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Revenue (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Number of Orders</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign size={20} className="text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                ৳
                {salesSummary?.overall_summary?.totalSales?.toLocaleString() ||
                  0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart size={20} className="text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">
                  Total
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {salesSummary?.overall_summary?.totalOrders || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Orders</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Users size={20} className="text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">
                  Unique
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {salesSummary?.overall_summary?.totalCustomers || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Customers</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Package size={20} className="text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  Total
                </span>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {salesSummary?.overall_summary?.totalItemsSold || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Items Sold</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Percent size={20} className="text-rose-600" />
                <span className="text-xs text-rose-600 font-medium">
                  Average
                </span>
              </div>
              <p className="text-2xl font-bold text-rose-700">
                ৳
                {salesSummary?.overall_summary?.averageOrderValue?.toLocaleString() ||
                  0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Average Order Value</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Tag size={20} className="text-indigo-600" />
                <span className="text-xs text-indigo-600 font-medium">
                  Total
                </span>
              </div>
              <p className="text-2xl font-bold text-indigo-700">
                ৳
                {salesSummary?.overall_summary?.totalDiscounts?.toLocaleString() ||
                  0}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Total Discounts Given
              </p>
            </div>
          </div>

          {/* Growth Section */}
          {salesSummary?.growth_percentage && (
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" />
                Growth Percentage
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(salesSummary.growth_percentage).map(
                  ([key, value]) => {
                    const isPositive = (value as number) >= 0;
                    return (
                      <div
                        key={key}
                        className="text-center p-2 bg-gray-50 rounded-lg"
                      >
                        <p className="text-xs text-gray-500 capitalize">
                          {key}
                        </p>
                        <p
                          className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
                        >
                          {isPositive ? "+" : ""}
                          {value as number}%
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* Sales by Status - Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <PieChartIcon size={18} className="text-blue-600" />
                Sales by Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({
                          name,
                          percent,
                        }: {
                          name: string;
                          percent: number;
                        }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map(
                          (entry: { name: string }, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.name] || "#9ca3af"}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {pieData.map(
                    (item: { name: string; value: number; orders: number }) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[item.name] || "#9ca3af",
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ৳{item.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.orders} orders
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Top Categories */}
          {salesSummary?.overall_summary?.topCategories &&
            salesSummary.overall_summary.topCategories.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-purple-600" />
                  Top Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {salesSummary.overall_summary.topCategories.map(
                    (category: TopCategory) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          {category.totalSold} units
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
