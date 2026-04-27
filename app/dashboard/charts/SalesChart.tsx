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
} from "recharts";
import { api } from "@/config/api";
import { Calendar, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

type Period = "daily" | "weekly" | "monthly";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  period: Period;
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

export default function SalesChart() {
  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"area" | "line">("area");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let salesData;
        switch (period) {
          case "daily":
            salesData = await api.getDailySales();
            break;
          case "weekly":
            salesData = await api.getWeeklySales();
            break;
          case "monthly":
            salesData = await api.getMonthlySales();
            break;
        }
        setData(Array.isArray(salesData) ? salesData : []);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const getXAxisKey = () => {
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

  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, item) => sum + (item.sales || 0), 0);
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
  const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0;
  const bestDay = data.reduce(
    (best, item) => ((item.sales || 0) > (best.sales || 0) ? item : best),
    { sales: 0, [getXAxisKey()]: "" },
  );

  if (loading) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <TrendingDown size={32} className="text-gray-400 mb-3" />
        <p className="text-sm text-gray-500">No sales data available</p>
      </div>
    );
  }

  return (
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
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
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
            <ComposedChart data={data}>
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

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Revenue (৳)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Number of Orders</span>
        </div>
        {chartType === "area" && (
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              {period === "daily"
                ? "Daily"
                : period === "weekly"
                  ? "Weekly"
                  : "Monthly"}{" "}
              breakdown
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
