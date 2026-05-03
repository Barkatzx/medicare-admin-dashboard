"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, approveUser, deleteUser } from "@/store/slices/userSlice";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  CheckCircle,
  Mail,
  Phone,
  RefreshCw,
  Calendar,
  Clock,
  Search,
  Users as UsersIcon,
  UserCheck,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap();
      // ✅ No toast here — slice handles it
      // ✅ No fetchUsers() needed — slice removes user from state immediately
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      // ✅ No toast here — slice handles it
      // Error is already shown by the slice's rejected case
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

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

  const totalUsers = users.length;
  const totalPending = users.filter(
    (u) => !u.isApproved && u.role !== "admin",
  ).length;
  const totalApproved = users.filter(
    (u) => u.isApproved && u.role === "customer",
  ).length;
  const approvalRate = totalUsers > 0 ? (totalApproved / totalUsers) * 100 : 0;

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 transition-all duration-300">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalUsers}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={10} />
                +12% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300">
              <UsersIcon size={22} className="text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 transition-all duration-300">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pending Approvals
              </p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {totalPending}
              </p>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300">
              <Clock size={22} className="text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 transition-all duration-300">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Active Customers
              </p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {totalApproved}
              </p>
              <p className="text-xs text-gray-500 mt-1">Verified accounts</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300">
              <UserCheck size={22} className="text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 transition-all duration-300">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Approval Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {approvalRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={10} />
                +5.2% vs last month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filterStatus === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filterStatus === "pending"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filterStatus === "approved"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Pending Approvals Table */}
      {pendingUsers.length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <Clock size={16} className="text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Approvals
              </h2>
              <span className="px-2.5 py-0.5 bg-amber-200 text-amber-800 text-xs font-medium rounded-full ml-2">
                {pendingUsers.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-amber-50/20 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name || "Unnamed User"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{user.phone_number}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        <Clock size={10} />
                        Pending
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleApprove(user.id)}
                          loading={approvingId === user.id}
                          className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-all duration-200 text-emerald-600"
                        >
                          <CheckCircle
                            size={16}
                            className="text-emerald-600"
                          />{" "}
                        </Button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200"
                          title="Delete User"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approved Customers Table */}
      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Approved Customers
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full ml-2">
              {approvedUsers.length}
            </span>
          </div>
        </div>

        {approvedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              No approved customers found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              New customers will appear here after approval
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name || "N/A"}
                          </p>
                          {user.pharmacy_name && (
                            <p className="text-xs text-gray-500">
                              {user.pharmacy_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{user.phone_number}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        <CheckCircle size={10} />
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the user{" "}
                <strong className="text-gray-900">
                  "{userToDelete?.name || userToDelete?.email}"
                </strong>
                ?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone. All user data will be permanently
                removed.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={deletingId === userToDelete?.id}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
