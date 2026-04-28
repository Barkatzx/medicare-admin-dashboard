// src/components/layout/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  BarChart3,
  LogOut,
  ChevronLeft,
  Bell,
  Settings,
  HelpCircle,
  Sparkles,
  FolderCheck,
  Layers2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { api } from "@/config/api";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    description: "Manage customers",
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
    description: "Inventory management",
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: Layers2,
    description: "Organize products",
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    description: "Track shipments",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    description: "Sales analytics",
  },
];

const bottomMenuItems = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Preferences",
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
    description: "Support & docs",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Load collapsed state from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebarCollapsed");
      if (saved !== null) setIsCollapsed(JSON.parse(saved));
    } catch {}
  }, []);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await api.getNotifications(true);
        const count = data?.unreadCount || data?.notifications?.length || 0;
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    const handleNotificationUpdate = () => fetchUnreadCount();
    window.addEventListener("notificationsUpdated", handleNotificationUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationUpdate,
      );
    };
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    } catch {}
  }, [isCollapsed]);

  const handleToggle = () => setIsCollapsed((v) => !v);
  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  // When collapsed, only show text on hover
  const showText = !isCollapsed || isHovered;
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      <aside
        className={`fixed left-3 top-3 bottom-3 ${sidebarWidth} bg-white rounded-2xl flex flex-col transition-all duration-300 z-30 shadow-xl border border-gray-100`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div
          className={`relative p-5 ${isCollapsed ? "px-3" : ""} border-b border-gray-100`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
              </div>
              {showText && (
                <div className="transition-opacity duration-200 whitespace-nowrap">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    MediCarePLC
                  </h1>
                  <p className="text-[10px] text-gray-400 -mt-0.5">
                    Administration Portal
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleToggle}
              className={`absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            >
              <ChevronLeft size={12} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {/* <div
          className={`mx-3 mt-4 p-2.5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {showText && (
              <div className="flex-1 min-w-0 transition-opacity duration-200">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">
                  {user?.role || "Administrator"}
                </p>
              </div>
            )}
          </div>
        </div> */}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* Main Menu */}
            <div>
              {showText && (
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Main Menu
                </p>
              )}
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                        transition-all duration-200
                        ${isCollapsed ? "justify-center" : ""}
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={`flex-shrink-0 transition-all duration-200 ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-500 group-hover:text-blue-600 group-hover:scale-105"
                        }`}
                      />
                      {showText && (
                        <span className="text-sm font-medium whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                      {isActive && showText && (
                        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />
                      )}
                      {/* Tooltip for collapsed state - only show when collapsed AND not hovered */}
                      {isCollapsed && !isHovered && (
                        <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              {showText && (
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Updates
                </p>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/notifications"
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      pathname === "/dashboard/notifications"
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <Bell
                      size={20}
                      className={`transition-all duration-200 ${
                        pathname === "/dashboard/notifications"
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                  {showText && (
                    <>
                      <span className="text-sm font-medium whitespace-nowrap">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="ml-auto text-xs text-red-500 font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </>
                  )}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isHovered && unreadCount > 0 && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                      <p className="font-medium">Notifications</p>
                      <p className="text-[10px] text-red-400 mt-0.5">
                        {unreadCount} unread
                      </p>
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Menu */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="space-y-1">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  />
                  {showText && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isHovered && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-red-600 hover:bg-red-50 hover:text-red-700
                transition-all duration-200 group
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <LogOut
                size={20}
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              {showText && (
                <span className="text-sm font-medium whitespace-nowrap">
                  Logout
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && !isHovered && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                  <p className="font-medium">Logout</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Sign out</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for layout */}
      <div className={`${sidebarWidth} ml-3 transition-all duration-300`} />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </>
  );
}
