"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import { fetchUsers } from "@/store/slices/userSlice";
import { fetchOrders } from "@/store/slices/orderSlice";
import { api, DashboardData } from "@/config/api";
import Card from "@/components/ui/Card";
import DashboardStats from "./DashboardStats";
import dynamic from "next/dynamic";

const SalesChart = dynamic(() => import("@/app/dashboard/charts/SalesChart"), {
  loading: () => <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />,
  ssr: false,
});

const TopProductsChart = dynamic(
  () => import("@/app/dashboard/charts/TopProductsChart"),
  {
    loading: () => (
      <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
    ),
    ssr: false,
  },
);

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { users } = useAppSelector((state) => state.users);
  const { orders } = useAppSelector((state) => state.orders);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch critical data first (dashboard stats)
      const dashboard = await api.getDashboardData();
      setDashboardData(dashboard);

      // Fetch secondary data in background
      Promise.all([
        dispatch(fetchProducts()).unwrap(),
        dispatch(fetchUsers()).unwrap(),
        dispatch(fetchOrders({ page: 1, limit: 10 })).unwrap(),
      ]).catch((err) => console.error("Background fetch error:", err));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayOrders = (dashboardData?.recent_orders || orders).slice(0, 5);

  return (
    <div className="space-y-6">
      <DashboardStats
        data={{
          today: dashboardData?.today || { sales: 0, orders: 0, items: 0 },
          this_week: dashboardData?.this_week || {
            sales: 0,
            orders: 0,
            items: 0,
          },
          this_month: dashboardData?.this_month || {
            sales: 0,
            orders: 0,
            items: 0,
          },
          this_year: dashboardData?.this_year || {
            sales: 0,
            orders: 0,
            items: 0,
          },
          lifetime: dashboardData?.lifetime || {
            sales: 0,
            orders: 0,
            customers: 0,
            products_sold: 0,
          },
          growth: {
            daily: dashboardData?.growth?.daily || 0,
            weekly: dashboardData?.growth?.weekly || 0,
            monthly: dashboardData?.growth?.monthly || 0,
            yearly: dashboardData?.growth?.yearly || 0,
          },
        }}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Overview" className="col-span-1">
          <SalesChart />
        </Card>
        <Card title="Top Products" className="col-span-1">
          <TopProductsChart />
        </Card>
      </div>

      <Card title="Recent Orders">
        <div className="overflow-x-auto">
          {displayOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No recent orders
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-mono text-gray-900">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ৳{parseFloat(order.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "completed" ||
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
