// src/components/dashboard/DashboardStats.tsx
"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardStatsProps {
  data: {
    today: { sales: number; orders: number; items: number };
    this_week: { sales: number; orders: number; items: number };
    this_month: { sales: number; orders: number; items: number };
    this_year: { sales: number; orders: number; items: number };
    lifetime: {
      sales: number;
      orders: number;
      customers: number;
      products_sold: number;
    };
    growth: { daily: number; weekly: number; monthly: number; yearly: number };
  };
  loading?: boolean;
}

export default function DashboardStats({ data, loading }: DashboardStatsProps) {
  const currencySymbol = "৳";

  const periodStats = [
    {
      title: "Today",
      revenue: data?.today?.sales || 0,
      orders: data?.today?.orders || 0,
      items: data?.today?.items || 0,
      growth: data?.growth?.daily || 0,
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      textColor: "text-orange-600",
    },
    {
      title: "This Week",
      revenue: data?.this_week?.sales || 0,
      orders: data?.this_week?.orders || 0,
      items: data?.this_week?.items || 0,
      growth: data?.growth?.weekly || 0,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      textColor: "text-blue-600",
    },
    {
      title: "This Month",
      revenue: data?.this_month?.sales || 0,
      orders: data?.this_month?.orders || 0,
      items: data?.this_month?.items || 0,
      growth: data?.growth?.monthly || 0,
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      textColor: "text-purple-600",
    },
    {
      title: "This Year",
      revenue: data?.this_year?.sales || 0,
      orders: data?.this_year?.orders || 0,
      items: data?.this_year?.items || 0,
      growth: data?.growth?.yearly || 0,
      icon: Activity,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      textColor: "text-emerald-600",
    },
  ];

  const lifetimeStats = [
    {
      label: "Lifetime Revenue",
      value: data?.lifetime?.sales || 0,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      textColor: "text-green-600",
      prefix: currencySymbol,
    },
    {
      label: "Total Orders",
      value: data?.lifetime?.orders || 0,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      textColor: "text-blue-600",
      prefix: "",
    },
    {
      label: "Total Customers",
      value: data?.lifetime?.customers || 0,
      icon: Users,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      textColor: "text-purple-600",
      prefix: "",
    },
    {
      label: "Products Sold",
      value: data?.lifetime?.products_sold || 0,
      icon: Package,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      textColor: "text-orange-600",
      prefix: "",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Period Overview
              </h2>
              <p className="text-sm text-gray-500">
                Revenue and order statistics by period
              </p>
            </div>
          </div>
          <div className="hidden md:block text-xs text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {periodStats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.growth >= 0;
            const formattedRevenue = stat.revenue.toLocaleString();
            const formattedGrowth = Math.abs(stat.growth).toFixed(1);

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              >
                {/* Gradient Background Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  {/* Header with Icon and Growth */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isPositive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      <span>{formattedGrowth}%</span>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {currencySymbol}
                      {formattedRevenue}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-500">
                      <span className="font-semibold text-gray-700">
                        {stat.orders}
                      </span>{" "}
                      orders
                    </div>
                    <div className="text-gray-500">
                      <span className="font-semibold text-gray-700">
                        {stat.items}
                      </span>{" "}
                      items
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                      style={{
                        width: `${Math.min(100, (stat.revenue / (data?.this_year?.sales || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifetime Statistics Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-xl">
            <Target size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Lifetime Overview
            </h2>
            <p className="text-sm text-gray-500">
              Total business performance metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lifetimeStats.map((stat, index) => {
            const Icon = stat.icon;
            const formattedValue =
              typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value;

            // Different gradient for each card
            const gradients = [
              "from-green-500 to-emerald-500",
              "from-blue-500 to-indigo-500",
              "from-purple-500 to-violet-500",
              "from-orange-500 to-amber-500",
            ];

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              >
                {/* Animated Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${gradients[index]} shadow-lg`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    {index === 0 && (
                      <div className="px-2 py-1 bg-amber-100 rounded-full text-xs font-medium text-amber-600">
                        All Time
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.prefix}
                      {formattedValue}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <Award size={12} />
                    <span>Total performance</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Period */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Best Performing Period
            </h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {(() => {
              const periods = [
                { name: "Today", revenue: data?.today?.sales || 0 },
                { name: "This Week", revenue: data?.this_week?.sales || 0 },
                { name: "This Month", revenue: data?.this_month?.sales || 0 },
                { name: "This Year", revenue: data?.this_year?.sales || 0 },
              ];
              const best = periods.reduce(
                (max, p) => (p.revenue > max.revenue ? p : max),
                periods[0],
              );
              return best.revenue > 0
                ? `${best.name} with ${currencySymbol}${best.revenue.toLocaleString()}`
                : "No data available";
            })()}
          </p>
        </div>

        {/* Average Order Value */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ShoppingCart size={18} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Average Order Value</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {currencySymbol}
            {data?.lifetime?.orders && data?.lifetime?.orders > 0
              ? (
                  (data?.lifetime?.sales || 0) / (data?.lifetime?.orders || 1)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
