// src/app/dashboard/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, approveUser } from "@/store/slices/userSlice";
import Button from "@/components/ui/Button";
import {
  CheckCircle,
  Mail,
  Phone,
  RefreshCw,
  Calendar,
  Clock,
  Search,
  Users as UsersIcon,
} from "lucide-react";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved"
  >("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleApprove = async (userId: string) => {
    setApprovingId(userId);
    await dispatch(approveUser(userId));
    setApprovingId(null);
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "pending"
          ? !user.isApproved && user.role !== "admin"
          : user.isApproved && user.role === "customer";

    return matchesSearch && matchesStatus;
  });

  const pendingUsers = filteredUsers.filter(
    (u) => !u.isApproved && u.role !== "admin",
  );
  const approvedUsers = filteredUsers.filter(
    (u) => u.isApproved && u.role === "customer",
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {
                  users.filter((u) => !u.isApproved && u.role !== "admin")
                    .length
                }
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {
                  users.filter((u) => u.isApproved && u.role === "customer")
                    .length
                }
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === "approved"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Pending Approvals Table */}
      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-2 border-b border-gray-100 bg-yellow-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-yellow-600" />
              Pending Approvals ({pendingUsers.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-yellow-50/30 transition-colors"
                  >
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name || "Unnamed User"}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{user.phone_number}</span>
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-lg">
                        <Clock size={12} />
                        Pending
                      </span>
                    </td>
                    <td className="py-2 px-6">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        loading={approvingId === user.id}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approved Customers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-2 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Approved Customers ({approvedUsers.length})
          </h2>
        </div>

        {approvedUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No approved customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="text-left py-2 px-6 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{user.phone_number}</span>
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
