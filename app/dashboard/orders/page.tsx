// src/app/dashboard/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOrders,
  updateOrderStatus,
  confirmPayment,
} from "@/store/slices/orderSlice";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  ShoppingBag,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Download,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";
import InvoicePDF from "./InvoicePDF";
import InvoiceView from "./InvoiceView";
import ExportCSV from "./ExportCSV";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, pagination, loading } = useAppSelector(
    (state) => state.orders,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(
    null,
  );

  useEffect(() => {
    dispatch(
      fetchOrders({ page: currentPage, limit: 10, status: statusFilter }),
    );
  }, [dispatch, currentPage, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleConfirmPayment = async (orderId: string) => {
    setConfirmingPayment(orderId);
    try {
      await dispatch(confirmPayment(orderId)).unwrap();
      toast.success("Payment confirmed successfully");
    } catch (error) {
      toast.error("Failed to confirm payment");
    } finally {
      setConfirmingPayment(null);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Package size={16} className="text-yellow-600" />;
      case "confirmed":
        return <CheckCircle size={16} className="text-blue-600" />;
      case "processing":
        return <Truck size={16} className="text-purple-600" />;
      case "shipped":
        return <Truck size={16} className="text-indigo-600" />;
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filter orders based on search
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(search) ||
      order.user.name.toLowerCase().includes(search) ||
      order.user.email.toLowerCase().includes(search)
    );
  });

  // Calculate statistics
  const totalOrders = pagination?.total || 0;
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + parseFloat(order.totalAmount),
    0,
  );
  const pendingOrders = filteredOrders.filter(
    (o) => o.status.toLowerCase() === "pending",
  ).length;
  const completedOrders = filteredOrders.filter(
    (o) => o.status.toLowerCase() === "delivered",
  ).length;

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {totalRevenue.toLocaleString()} ৳
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {pendingOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {completedOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            Order List ({filteredOrders.length})
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Payment
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{order.id.slice(-8)}
                      </code>
                    </td>
                    <td className="py-3 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="font-bold text-gray-900">
                        {parseFloat(order.totalAmount).toLocaleString()} ৳
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      {/* <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.payment?.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.payment?.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span>
                            {order.payment?.status || "N/A"}{" "}
                            {order.payment?.method && (
                              <span className="text-xs text-gray-500 capitalize">
                                {order.payment.method}
                              </span>
                            )}
                          </span>
                        </span>
                      </div> */}
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.payment?.status === "paid"
                              ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                              : order.payment?.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                                : "bg-red-100 text-red-700 ring-1 ring-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.payment?.status === "paid"
                                ? "bg-green-500"
                                : order.payment?.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {order.payment?.status || "N/A"}
                        </span>

                        {/* Separator Dot (Optional) */}
                        {order.payment?.method && (
                          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        )}

                        {/* Payment Method */}
                        {order.payment?.method && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <span className="capitalize">
                              {order.payment.method}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <InvoiceView order={order} />
                        <InvoicePDF order={order} />
                        {order.payment?.status === "pending" &&
                          order.payment?.method === "cod" && (
                            <button
                              onClick={() => handleConfirmPayment(order.id)}
                              disabled={confirmingPayment === order.id}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Confirm Payment"
                            >
                              <CreditCard size={16} />
                            </button>
                          )}
                        <select
                          value={order.status.toLowerCase()}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          disabled={updatingStatus === order.id}
                          className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} orders
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(pagination.totalPages, p + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal with Invoice Actions */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Order Details"
      >
        {selectedOrder && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Invoice Actions Header */}
            <div className="flex gap-2 justify-end">
              <InvoiceView order={selectedOrder} />
              <InvoicePDF order={selectedOrder} />
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-mono font-medium">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedOrder.status)}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="text-sm font-medium capitalize">
                    {selectedOrder.payment?.method} -{" "}
                    {selectedOrder.payment?.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Name:</span>{" "}
                  {selectedOrder.user.name}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-500">Email:</span>{" "}
                  {selectedOrder.user.email}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-500">Phone:</span>{" "}
                  {selectedOrder.user.phone_number}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  Shipping Address
                </h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.street}
                  </p>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}
                  </p>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.postalCode},{" "}
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items with Per-Item Total */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          @ {parseFloat(item.price).toLocaleString()} ৳
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {(
                          parseFloat(item.price) * item.quantity
                        ).toLocaleString()}{" "}
                        ৳
                      </p>
                      <p className="text-xs text-gray-500">Total for item</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-gray-900 text-lg">
                    {parseFloat(selectedOrder.totalAmount).toLocaleString()} ৳
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <InvoicePDF order={selectedOrder} />
              <Button
                onClick={() => {
                  // Export as JSON
                  const orderData = {
                    "Order ID": selectedOrder.id,
                    "Customer Name": selectedOrder.user.name,
                    "Customer Email": selectedOrder.user.email,
                    "Customer Phone": selectedOrder.user.phone_number,
                    "Total Amount": selectedOrder.totalAmount,
                    Status: selectedOrder.status,
                    "Payment Status": selectedOrder.payment?.status,
                    "Payment Method": selectedOrder.payment?.method,
                    "Order Date": new Date(
                      selectedOrder.createdAt,
                    ).toLocaleString(),
                    "Paid Date": selectedOrder.payment?.paidAt
                      ? new Date(selectedOrder.payment.paidAt).toLocaleString()
                      : "N/A",
                    "Shipping Address": selectedOrder.shippingAddress
                      ? `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}, ${selectedOrder.shippingAddress.postalCode}, ${selectedOrder.shippingAddress.country}`
                      : "N/A",
                    Items: selectedOrder.items
                      ?.map(
                        (item: any) =>
                          `${item.product.name} (x${item.quantity} - $${(parseFloat(item.price) * item.quantity).toLocaleString()})`,
                      )
                      .join("; "),
                  };

                  const dataStr = JSON.stringify(orderData, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const exportFileDefaultName = `order_${selectedOrder.id.slice(-8)}_details.json`;
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  linkElement.click();

                  toast.success("Order details exported as JSON");
                }}
                variant="secondary"
                className="flex-1 gap-2"
              >
                <Download size={16} />
                Export JSON
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
