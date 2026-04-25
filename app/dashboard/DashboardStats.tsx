"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Card from "@/components/ui/Card";

interface DashboardStatsProps {
  data: {
    this_month: { sales: number; orders: number };
    lifetime: { customers: number; products_sold: number };
    growth: { monthly: number };
  };
  loading?: boolean;
}

export default function DashboardStats({ data, loading }: DashboardStatsProps) {
  const stats = [
    {
      title: "Monthly Revenue",
      value: `$${data?.this_month?.sales?.toLocaleString() || "0"}`,
      icon: DollarSign,
      change: `${data?.growth?.monthly || 0}%`,
      trend: (data?.growth?.monthly || 0) >= 0 ? "up" : "down",
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Monthly Orders",
      value: data?.this_month?.orders?.toString() || "0",
      icon: ShoppingCart,
      change: "+8.2%",
      trend: "up",
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: data?.lifetime?.customers?.toString() || "0",
      icon: Users,
      change: "+5.4%",
      trend: "up",
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Products Sold",
      value: data?.lifetime?.products_sold?.toString() || "0",
      icon: Package,
      change: `${data?.growth?.monthly || 0}%`,
      trend: (data?.growth?.monthly || 0) >= 0 ? "up" : "down",
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-label">{stat.title}</p>
                <p className="dashboard-stat mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span
                    className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}
              >
                <Icon size={24} className={stat.textColor} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
