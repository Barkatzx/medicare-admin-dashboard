// src/app/dashboard/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api, SalesSummary } from "@/config/api";
import {
  Download,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileText,
  BarChart3,
  PieChart,
} from "lucide-react";
import SalesChart from "@/app/dashboard/charts/SalesChart";
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
} from "recharts";

export default function ReportsPage() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await api.getSalesSummary();
        setSalesSummary(summary);

        // Fetch sales data based on period
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
        setSalesData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await api.exportSalesData(format);
    } catch (error) {
      console.error("Failed to export data:", error);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const metrics = [
    {
      label: "Total Revenue",
      value: `৳${salesSummary?.totalRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      label: "Total Orders",
      value: salesSummary?.totalOrders?.toString() || "0",
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      label: "Average Order Value",
      value: `৳${salesSummary?.averageOrderValue?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      trend: "+5.4%",
      trendUp: true,
    },
    {
      label: "Total Customers",
      value: salesSummary?.totalCustomers?.toString() || "0",
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      trend: "+15.3%",
      trendUp: true,
    },
  ];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-white/5"></div>
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-xl">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              </div>
              <p className="text-gray-300">
                Comprehensive sales insights and performance metrics
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePrint}
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <Printer size={16} className="mr-2" />
                Print
              </Button>
              <Button
                onClick={() => handleExport("csv")}
                loading={exporting}
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <FileText size={16} className="mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport("pdf")}
                loading={exporting}
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <Download size={16} className="mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                    <ArrowUpRight size={12} />
                    {metric.trend}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color} w-3/4`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Chart Section */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sales Overview</h3>
                <p className="text-sm text-gray-500">
                  Revenue and order trends over time
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
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
        </div>
        <div className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={getXAxisKey()}
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `৳${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [
                    `৳${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Additional Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Preview */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-500">Best selling products</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: "Paracetamol 600mg", sales: 3200, growth: "+15%" },
              { name: "Vitamin C Complex", sales: 2800, growth: "+12%" },
              { name: "Antibiotic Cream", sales: 2100, growth: "+8%" },
            ].map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">Total sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ৳{product.sales.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              <p className="text-sm text-gray-500">Performance at a glance</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Conversion Rate</p>
                <p className="text-lg font-bold text-gray-900">3.24%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">vs last month</p>
                <p className="text-sm text-green-600">+0.8%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Customer Retention</p>
                <p className="text-lg font-bold text-gray-900">78.5%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">vs last month</p>
                <p className="text-sm text-green-600">+5.2%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Avg. Response Time</p>
                <p className="text-lg font-bold text-gray-900">2.4 hrs</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">vs last month</p>
                <p className="text-sm text-red-600">-0.3 hrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Last Updated */}
      <div className="text-center text-xs text-gray-400 pt-4">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
