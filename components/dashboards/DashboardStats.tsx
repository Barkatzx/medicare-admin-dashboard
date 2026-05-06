"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardStats } from "@/store/slices/dashboardSlice";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  RefreshCw,
  TrendingUp as TrendingUpIcon,
  ShoppingBag,
  UserCheck,
  BarChart3,
  LineChart,
  Activity,
} from "lucide-react";
import Button from "@/components/ui/Button";

// Skeleton Loader Component
const StatsSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardStats() {
  const dispatch = useAppDispatch();
  const { statsData, loading, error } = useAppSelector(
    (state) => state.dashboard,
  );
  const currencySymbol = "৳";

  useEffect(() => {
    if (!statsData) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, statsData]);

  const handleRetry = () => {
    dispatch(fetchDashboardStats());
  };

  if (error && !statsData) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-12 text-center border border-gray-100 shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Dashboard Data
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            The dashboard statistics are currently unavailable. This could be
            due to server maintenance or network issues.
          </p>
          <Button
            onClick={handleRetry}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading && !statsData) {
    return <StatsSkeleton />;
  }

  if (!statsData) {
    return null;
  }

  // Period Stats with Growth
  const periodStats = [
    {
      title: "Today",
      revenue: statsData?.today?.sales || 0,
      orders: statsData?.today?.orders || 0,
      items: statsData?.today?.items || 0,
      growth: statsData?.growth?.daily || 0,
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      borderGradient: "from-orange-200 to-red-200",
      period: "Today",
    },
    {
      title: "This Week",
      revenue: statsData?.this_week?.sales || 0,
      orders: statsData?.this_week?.orders || 0,
      items: statsData?.this_week?.items || 0,
      growth: statsData?.growth?.weekly || 0,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderGradient: "from-blue-200 to-cyan-200",
      period: "This Week",
    },
    {
      title: "This Month",
      revenue: statsData?.this_month?.sales || 0,
      orders: statsData?.this_month?.orders || 0,
      items: statsData?.this_month?.items || 0,
      growth: statsData?.growth?.monthly || 0,
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderGradient: "from-purple-200 to-pink-200",
      period: "This Month",
    },
    {
      title: "This Year",
      revenue: statsData?.this_year?.sales || 0,
      orders: statsData?.this_year?.orders || 0,
      items: statsData?.this_year?.items || 0,
      growth: statsData?.growth?.yearly || 0,
      icon: Activity,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      borderGradient: "from-emerald-200 to-teal-200",
      period: "This Year",
    },
  ];

  const lifetimeStats = [
    {
      label: "Total Revenue",
      value: statsData?.lifetime?.sales || 0,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      prefix: currencySymbol,
      description: "Lifetime earnings",
    },
    {
      label: "Total Orders",
      value: statsData?.lifetime?.orders || 0,
      icon: ShoppingBag,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      prefix: "",
      description: "Completed purchases",
    },
    {
      label: "Active Customers",
      value: statsData?.lifetime?.customers || 0,
      icon: UserCheck,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      prefix: "",
      description: "Registered users",
    },
    {
      label: "Products Sold",
      value: statsData?.lifetime?.products_sold || 0,
      icon: Package,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      prefix: "",
      description: "Total units sold",
    },
  ];

  const getMaxRevenue = () => {
    return Math.max(
      statsData?.today?.sales || 0,
      statsData?.this_week?.sales || 0,
      statsData?.this_month?.sales || 0,
      statsData?.this_year?.sales || 0,
    );
  };

  const maxRevenue = getMaxRevenue();

  // Find best performing period
  const periods = [
    { name: "Today", revenue: statsData?.today?.sales || 0 },
    { name: "This Week", revenue: statsData?.this_week?.sales || 0 },
    { name: "This Month", revenue: statsData?.this_month?.sales || 0 },
    { name: "This Year", revenue: statsData?.this_year?.sales || 0 },
  ];
  const bestPeriod = periods.reduce(
    (max, p) => (p.revenue > max.revenue ? p : max),
    periods[0],
  );

  // Calculate average order value
  const avgOrderValue =
    statsData?.lifetime?.orders && statsData?.lifetime?.orders > 0
      ? (statsData?.lifetime?.sales || 0) / (statsData?.lifetime?.orders || 1)
      : 0;

  return (
    <div className="space-y-8">
      {/* Period Statistics Section - Modern Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Period Overview
              </h2>
              <p className="text-sm text-gray-500">
                Real-time revenue and order statistics
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">Live updates</span>
          </div>
        </div>
        {/* Daily, weekly, monthly, and yearly performance metrics with growth indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {periodStats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.growth >= 0;
            const formattedRevenue = stat.revenue.toLocaleString();
            const formattedGrowth = Math.abs(stat.growth).toFixed(1);
            const progressPercent =
              maxRevenue > 0 ? (stat.revenue / maxRevenue) * 100 : 0;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100"
              >
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isPositive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
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

                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1 font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                      {currencySymbol}
                      {formattedRevenue}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <ShoppingCart size={12} />
                      <span className="font-semibold text-gray-700">
                        {stat.orders}
                      </span>
                      <span className="text-xs">orders</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Package size={12} />
                      <span className="font-semibold text-gray-700">
                        {stat.items}
                      </span>
                      <span className="text-xs">items</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="absolute -top-6 right-0 text-xs text-gray-400">
                      {progressPercent.toFixed(0)}% of max
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifetime Statistics Section - Premium Cards */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-500 shadow-lg">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Lifetime Performance
            </h2>
            <p className="text-sm text-gray-500">
              Total business metrics across all time
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
            const gradients = [
              "from-green-500 to-emerald-500",
              "from-blue-500 to-indigo-500",
              "from-purple-500 to-violet-500",
              "from-orange-500 to-amber-500",
            ];
            const bgGradients = [
              "from-green-50 to-emerald-50",
              "from-blue-50 to-indigo-50",
              "from-purple-50 to-violet-50",
              "from-orange-50 to-amber-50",
            ];

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 border border-gray-100"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${gradients[index]}`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    {index === 0 && (
                      <div className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full text-xs font-semibold text-amber-700 shadow-sm">
                        All Time
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                      {stat.prefix}
                      {formattedValue}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Award size={12} />
                      <span>{stat.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights Section - Modern Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Period Card */}
        <div className="rounded-2xl text-black border border-gray-100 p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500 rounded-xl">
                <TrendingUpIcon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold">Best Performing Period</h3>
            </div>
          </div>

          <p className="text-3xl font-bold">
            {bestPeriod.revenue > 0
              ? `${bestPeriod.name} — ${currencySymbol}${bestPeriod.revenue.toLocaleString()}`
              : "No data available"}
          </p>
          <p className="text-sm mt-2">Highest revenue generating period</p>
        </div>

        {/* Average Order Value Card */}
        <div className="rounded-2xl text-black border border-gray-100 p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-600 rounded-xl">
                <ShoppingCart size={20} className="text-white" />
              </div>
              <h3 className="font-semibold">Average Order Value</h3>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {currencySymbol}
            {avgOrderValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm mt-2">Average spent per transaction</p>

          <div className="absolute bottom-4 right-4 opacity-20">
            <TrendingUpIcon size={32} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }
        .bg-grid-pattern-white {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
}
