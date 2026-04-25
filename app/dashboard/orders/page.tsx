// src/app/dashboard/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrders, updateOrderStatus } from "@/store/slices/orderSlice";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, pagination, loading } = useAppSelector(
    (state) => state.orders,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchOrders({ page: currentPage, limit: 10, status: statusFilter }),
    );
  }, [dispatch, currentPage, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package size={16} className="text-yellow-600" />;
      case "processing":
        return <Truck size={16} className="text-blue-600" />;
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
      </div>

      <div className="flex gap-3">
        {["all", "pending", "processing", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ),
        )}
      </div>

      <Card>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-mono text-gray-900">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    ${parseFloat(order.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} orders
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
