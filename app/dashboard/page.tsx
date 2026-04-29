// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import { fetchUsers } from "@/store/slices/userSlice";
import { fetchOrders } from "@/store/slices/orderSlice";
import Card from "@/components/ui/Card";
import DashboardStats from "@/app/dashboard/DashboardStats";
import dynamic from "next/dynamic";

// Lazy load charts for better initial load time
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
  const { statsData } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    Promise.all([
      dispatch(fetchProducts({ page: 1, limit: 20 })).unwrap(),
      dispatch(fetchUsers()).unwrap(),
      dispatch(fetchOrders({ page: 1, limit: 10 })).unwrap(),
    ]).catch((err) => console.error("Background fetch error:", err));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <DashboardStats />

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
              {orders.slice(0, 5).map((order) => (
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
        </div>
      </Card>
    </div>
  );
}
