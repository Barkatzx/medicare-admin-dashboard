// src/app/dashboard/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/config/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Bell,
  Moon,
  Sun,
  Shield,
  User,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  AlertCircle,
  Store,
  Calendar,
  Plus,
  Trash2,
  Home,
  Save,
  Star,
  RefreshCw,
  LogOut,
  Settings,
  ChevronRight,
  CreditCard,
  Lock,
  Fingerprint,
  BellRing,
  Smartphone,
  Monitor,
  Globe2,
  AtSign,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface Profile {
  id: string;
  email: string;
  phone_number: string;
  name: string;
  pharmacy_name: string | null;
  role: string;
  isApproved: boolean;
  createdAt: string;
  defaultAddressId: string | null;
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    pharmacy_name: "",
    phone_number: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    isDefault: false,
  });

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please login again.");
      setLoading(false);
      return;
    }
    await fetchAllData();
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchProfile();
      await fetchAddresses();
      await fetchNotifications();
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      setError(error?.message || "Failed to load data");
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      if (data) {
        setProfile(data);
        setEditForm({
          name: data.name || "",
          pharmacy_name: data.pharmacy_name || "",
          phone_number: data.phone_number || "",
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setAddresses([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data?.notifications || []);
      setUnreadCount(data?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.updateProfile(editForm);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      await fetchProfile();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await api.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
      setShowPassword(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password");
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.country) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      if (editingAddress) {
        await api.updateAddress(editingAddress.id, addressForm);
        toast.success("Address updated successfully");
      } else {
        await api.createAddress(addressForm);
        toast.success("Address added successfully");
      }
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Bangladesh",
        isDefault: false,
      });
      await fetchAddresses();
      await fetchProfile();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await api.deleteAddress(addressId);
        toast.success("Address deleted successfully");
        await fetchAddresses();
        await fetchProfile();
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete address");
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await api.setDefaultAddress(addressId);
      toast.success("Default address updated");
      await fetchAddresses();
      await fetchProfile();
    } catch (error: any) {
      toast.error(error?.message || "Failed to set default address");
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId);
      await fetchNotifications();
    } catch (error: any) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      toast.success("All notifications marked as read");
      await fetchNotifications();
    } catch (error: any) {
      toast.error("Failed to mark notifications");
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-gray-700 mb-2">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={fetchAllData} className="gap-2">
              <RefreshCw size={16} />
              Retry
            </Button>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-white/5"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-blue-100">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card - Redesigned */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <User size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      View and manage your personal information
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit size={14} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {isEditing ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pharmacy Name
                      </label>
                      <input
                        type="text"
                        value={editForm.pharmacy_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            pharmacy_name: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            phone_number: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleUpdateProfile} className="gap-2">
                      <Save size={16} />
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    {
                      icon: User,
                      label: "Full Name",
                      value: profile?.name || "N/A",
                    },
                    {
                      icon: Building2,
                      label: "Pharmacy Name",
                      value: profile?.pharmacy_name || "N/A",
                    },
                    {
                      icon: AtSign,
                      label: "Email Address",
                      value: profile?.email,
                    },
                    {
                      icon: Phone,
                      label: "Phone Number",
                      value: profile?.phone_number,
                    },
                    {
                      icon: Calendar,
                      label: "Member Since",
                      value: new Date(profile?.createdAt).toLocaleDateString(),
                    },
                    {
                      icon: Shield,
                      label: "Role",
                      value: profile?.role?.toUpperCase(),
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100"
                    >
                      <item.icon size={18} className="mt-0.5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Addresses Card - Redesigned */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <MapPin size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Saved Addresses
                    </h3>
                    <p className="text-xs text-gray-500">
                      Manage your delivery addresses
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({
                      street: "",
                      city: "",
                      state: "",
                      postalCode: "",
                      country: "Bangladesh",
                      isDefault: false,
                    });
                    setIsAddressModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {addresses?.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No saved addresses</p>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Add your first address
                    </button>
                  </div>
                ) : (
                  addresses?.map((address) => (
                    <div
                      key={address.id}
                      className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Home size={14} className="text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">
                              {address.street}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 ml-5">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-xs text-gray-500 ml-5">
                            {address.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {address.isDefault && (
                            <span className="mr-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              Default
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setEditingAddress(address);
                              setAddressForm({
                                street: address.street,
                                city: address.city,
                                state: address.state,
                                postalCode: address.postalCode,
                                country: address.country,
                                isDefault: address.isDefault,
                              });
                              setIsAddressModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit size={14} />
                          </button>
                          {!address.isDefault && (
                            <>
                              <button
                                onClick={() =>
                                  handleSetDefaultAddress(address.id)
                                }
                                className="rounded-lg p-1.5 text-yellow-600 hover:bg-yellow-50"
                                title="Set as default"
                              >
                                <Star size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Security Card - Modern */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Shield size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Security</h3>
                  <p className="text-xs text-gray-500">Protect your account</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex w-full items-center justify-between rounded-xl p-3 transition-all hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Change Password</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl p-3 transition-all hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Fingerprint size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Two-Factor Authentication
                  </span>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  Soon
                </span>
              </button>
            </div>
          </div>

          {/* Notifications Card - Modern */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Bell size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <p className="text-xs text-gray-500">Stay updated</p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="mb-3 w-full rounded-xl bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-blue-600 transition-all hover:bg-gray-100"
              >
                View all notifications ({notifications.length})
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full text-center text-xs text-gray-500 hover:text-gray-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Preferences Card - Modern */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Globe size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preferences</h3>
                  <p className="text-xs text-gray-500">
                    Customize your experience
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-all hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon size={16} className="text-gray-500" />
                  ) : (
                    <Sun size={16} className="text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700">Dark Mode</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-all hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <BellRing size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Email Notifications
                  </span>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Confirm your new password"
            />
          </div>
          {passwordData.newPassword &&
            passwordData.confirmPassword &&
            passwordData.newPassword !== passwordData.confirmPassword && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={14} />
                Passwords do not match
              </div>
            )}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleChangePassword} className="flex-1">
              Update Password
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={addressForm.street}
              onChange={(e) =>
                setAddressForm({ ...addressForm, street: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postalCode: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveAddress} className="flex-1">
              {editingAddress ? "Update Address" : "Add Address"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsAddressModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notifications"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  notification.isRead
                    ? "bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
                onClick={() =>
                  !notification.isRead && handleMarkAsRead(notification.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
