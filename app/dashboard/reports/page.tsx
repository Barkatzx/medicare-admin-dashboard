"use client";

import { useEffect, useState } from "react";
import { api, SalesSummaryData, TopProduct } from "@/config/api";
import {
  TrendingUp,
  Package,
  PieChart,
  Calendar,
  Tag,
  Star,
  Layers,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";

// Types
interface DailyBreakdownItem {
  period: "daily";
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

interface WeeklyResponse {
  daily_breakdown: DailyBreakdownItem[];
  weekly_totals: {
    totalSales: number;
    totalOrders: number;
    totalItemsSold: number;
  };
  average_daily_sales: number;
}

interface MonthlyResponse {
  daily_breakdown: DailyBreakdownItem[];
  monthly_totals: {
    totalSales: number;
    totalOrders: number;
    totalItemsSold: number;
  };
  average_daily_sales: number;
  best_day?: DailyBreakdownItem;
}

interface YearlyResponse {
  monthly_breakdown: Array<{
    period: "monthly";
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    totalItemsSold: number;
  }>;
  yearly_totals: {
    totalSales: number;
    totalOrders: number;
    totalItemsSold: number;
  };
  average_monthly_sales: number;
  best_month?: {
    totalSales: number;
    totalOrders: number;
    totalItemsSold: number;
  };
}

interface DailyResponse {
  period: "daily";
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
  totalDiscounts: number;
}

interface TodayOrderedProduct {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
}

interface TodayOrderedResponse {
  products: TodayOrderedProduct[];
  summary: {
    totalProducts: number;
    totalQuantity: number;
    totalRevenue: number;
  };
}

type ChartPeriod = "daily" | "weekly" | "monthly" | "yearly";

interface ChartDataPoint {
  label: string;
  sales: number;
  orders: number;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: "#10b981",
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  confirmed: "#06b6d4",
  cancelled: "#ef4444",
};

const GRADIENT_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
];

function buildChartData(period: ChartPeriod, raw: any): ChartDataPoint[] {
  if (!raw) return [];
  if (period === "daily")
    return [
      {
        label: (raw as DailyResponse).date,
        sales: raw.totalSales,
        orders: raw.totalOrders,
      },
    ];
  if (period === "weekly")
    return (
      (raw as WeeklyResponse).daily_breakdown?.map((item, i) => ({
        label: `Day ${i + 1}`,
        sales: item.totalSales,
        orders: item.totalOrders,
      })) || []
    );
  if (period === "monthly")
    return (
      (raw as MonthlyResponse).daily_breakdown?.map((item, i) => ({
        label: `${i + 1}`,
        sales: item.totalSales,
        orders: item.totalOrders,
      })) || []
    );
  if (period === "yearly") {
    const months = [
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
    return (
      (raw as YearlyResponse).monthly_breakdown?.map((item, i) => ({
        label: months[i] || `M${i + 1}`,
        sales: item.totalSales,
        orders: item.totalOrders,
      })) || []
    );
  }
  return [];
}

export default function ReportsPage() {
  const [salesSummary, setSalesSummary] = useState<SalesSummaryData | null>(
    null,
  );
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [todayOrders, setTodayOrders] = useState<TodayOrderedResponse | null>(
    null,
  );
  const [rawData, setRawData] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [period, setPeriod] = useState<ChartPeriod>("monthly");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [customData, setCustomData] = useState<{
    totalSales: number;
    totalOrders: number;
    totalItemsSold: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [loadingTodayOrders, setLoadingTodayOrders] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [summary, products, todayOrdered] = await Promise.all([
          api.getSalesSummary(),
          api.getTopProducts(10),
          api.getTodayOrderedProducts(),
        ]);
        setSalesSummary(summary);
        setTopProducts(products);
        setTodayOrders(todayOrdered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshTodayOrders = async () => {
    setLoadingTodayOrders(true);
    try {
      const data = await api.getTodayOrderedProducts();
      setTodayOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTodayOrders(false);
    }
  };

  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      try {
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
          case "yearly":
            data = await api.getYearlySales();
            break;
        }
        setRawData(data);
        setChartData(buildChartData(period, data));
      } catch (err) {
        console.error(err);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [period]);

  const handleCustomRange = async () => {
    if (!customStart || !customEnd) return;
    try {
      const res = await api.getCustomRangeSales(customStart, customEnd);
      setCustomData(res?.salesData ?? null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await api.exportSalesData(format);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const periodTotals = (() => {
    if (!rawData) return { totalSales: 0, totalOrders: 0, totalItemsSold: 0 };
    if (period === "daily")
      return {
        totalSales: rawData.totalSales || 0,
        totalOrders: rawData.totalOrders || 0,
        totalItemsSold: rawData.totalItemsSold || 0,
      };
    if (period === "weekly")
      return (
        rawData.weekly_totals || {
          totalSales: 0,
          totalOrders: 0,
          totalItemsSold: 0,
        }
      );
    if (period === "monthly")
      return (
        rawData.monthly_totals || {
          totalSales: 0,
          totalOrders: 0,
          totalItemsSold: 0,
        }
      );
    return (
      rawData.yearly_totals || {
        totalSales: 0,
        totalOrders: 0,
        totalItemsSold: 0,
      }
    );
  })();

  const pieData = (salesSummary?.sales_by_status ?? [])
    .filter((s) => s.totalSales > 0)
    .map((s) => ({
      name: s.status,
      value: s.totalSales,
      orders: s.totalOrders,
    }));

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Today's Ordered Products Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Today's Ordered Products
                </h3>
                <p className="text-sm text-gray-500">
                  Products ordered in the last 24 hours
                </p>
              </div>
            </div>
            <button
              onClick={refreshTodayOrders}
              disabled={loadingTodayOrders}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              <RefreshCw
                size={16}
                className={loadingTodayOrders ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {todayOrders && todayOrders.products.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Products</p>
                <p className="text-xl font-bold text-blue-600">
                  {todayOrders.summary.totalProducts}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Quantity</p>
                <p className="text-xl font-bold text-emerald-600">
                  {todayOrders.summary.totalQuantity}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-purple-600">
                  ৳{todayOrders.summary.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todayOrders.products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                      </td>
                      <td className="py-2 px-3">
                        <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-sm font-semibold text-gray-900">
                          ৳{product.totalPrice.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No orders today</p>
            <p className="text-sm text-gray-400 mt-1">
              Products ordered today will appear here
            </p>
          </div>
        )}
      </div>

      {/* Sales Chart Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sales Trend</h3>
                <p className="text-sm text-gray-500">
                  Revenue over selected period
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
                    period === p
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              {
                label: "Period Revenue",
                value: `৳${periodTotals.totalSales.toLocaleString()}`,
              },
              {
                label: "Period Orders",
                value: periodTotals.totalOrders.toString(),
              },
              {
                label: "Items Sold",
                value: periodTotals.totalItemsSold.toString(),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 rounded-xl p-3 text-center"
              >
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          {chartLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `৳${v.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0/0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "sales" ? `৳${value.toLocaleString()}` : value,
                      name === "sales" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#gSales)"
                    name="sales"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#gOrders)"
                    name="orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-500">Revenue (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-500">Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Custom Date Range</h3>
            <p className="text-sm text-gray-500">
              Query sales for any date window
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCustomRange}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={14} /> Fetch
          </button>
        </div>
        {customData && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              {
                label: "Revenue",
                value: `৳${customData.totalSales.toLocaleString()}`,
              },
              { label: "Orders", value: customData.totalOrders.toString() },
              {
                label: "Items Sold",
                value: customData.totalItemsSold.toString(),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-indigo-50 rounded-xl p-4 text-center"
              >
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-indigo-700 mt-1">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Products & Sales by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-500">By total revenue</p>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">
                No product data available
              </p>
            ) : (
              topProducts.slice(0, 5).map((product, idx) => {
                const price =
                  typeof product.price === "string"
                    ? parseFloat(product.price)
                    : product.price;
                const maxRevenue = topProducts[0]?.totalRevenue || 1;
                const pct = Math.round(
                  (product.totalRevenue / maxRevenue) * 100,
                );
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {product.images?.[0]?.url ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={product.images[0].url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package size={16} className="text-amber-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">
                            {medals[idx] ?? `#${idx + 1}`}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500">
                            {product.totalSold} units sold
                          </span>
                          <span className="text-xs text-gray-400">
                            ৳{price.toLocaleString()} / unit
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-emerald-600">
                          ৳{product.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.category?.name ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sales by Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sales by Status</h3>
              <p className="text-sm text-gray-500">
                Revenue breakdown per order status
              </p>
            </div>
          </div>
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <PieChart size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No completed orders yet</p>
            </div>
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            STATUS_COLORS[entry.name] ||
                            GRADIENT_COLORS[i % GRADIENT_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [
                        `৳${v.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {(salesSummary?.sales_by_status ?? []).map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: STATUS_COLORS[s.status] ?? "#9ca3af",
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">
                        {s.totalOrders} orders
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ৳{s.totalSales.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Categories */}
      {(salesSummary?.overall_summary?.topCategories ?? []).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Layers size={18} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Top Categories</h3>
              <p className="text-sm text-gray-500">By units sold</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesSummary!.overall_summary.topCategories}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip formatter={(v: number) => [v, "Units sold"]} />
                <Bar dataKey="totalSold" radius={[0, 8, 8, 0]}>
                  {salesSummary!.overall_summary.topCategories.map((_, i) => (
                    <Cell
                      key={i}
                      fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Discounts & Items Sold Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Tag size={18} className="text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Total Discounts Given
            </h3>
          </div>
          <p className="text-3xl font-bold text-rose-600">
            ৳
            {salesSummary?.overall_summary?.totalDiscounts?.toLocaleString() ??
              "0"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Across all orders lifetime
          </p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Package size={18} className="text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Items Sold</h3>
          </div>
          <p className="text-3xl font-bold text-violet-600">
            {salesSummary?.overall_summary?.totalItemsSold?.toLocaleString() ??
              "0"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Across all orders lifetime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-2">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
