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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

const bottomMenuItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // ✅ Deterministic initial state (same on server + first client render)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ After mount: read persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebarCollapsed");
      if (saved !== null) setIsCollapsed(JSON.parse(saved));
    } catch {}
  }, []);

  // ✅ Persist on change (client-only)
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

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-2.5 top-2.5 bottom-2.5 ${sidebarWidth} bg-white rounded-2xl flex flex-col transition-all duration-300 z-30 border border-gray-100`}
      >
        {/* Toggle Button */}
        <div className="flex justify-end p-3">
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
          >
            <ChevronLeft
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* User Profile Section */}
        <div
          className={`px-3 pb-4 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || "Administrator"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Menu */}
            <div>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
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
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                      `}
                    >
                      <Icon
                        size={20}
                        className={`flex-shrink-0 ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-500 group-hover:text-blue-600"
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}

                      {/* Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Notifications */}
            <div>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  Updates
                </p>
              )}

              <div className="space-y-1">
                <button
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-gray-600 hover:bg-gray-50 hover:text-blue-600
                    transition-all duration-200 relative
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <Bell size={20} className="text-gray-500" />

                  {!isCollapsed && (
                    <Link
                      href="/dashboard/notifications"
                      className="text-sm font-medium"
                    >
                      <span className="text-sm">Notifications</span>
                    </Link>
                  )}

                  {!isCollapsed && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      3
                    </span>
                  )}

                  {isCollapsed && (
                    <span className="absolute top-0 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      3
                    </span>
                  )}
                </button>
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
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={20}
                    className={`${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  />

                  {!isCollapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-red-600 hover:bg-red-50 hover:text-red-700
                transition-all duration-200
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Layout spacer */}
      <div className={`${sidebarWidth} ml-2.5 transition-all duration-300`} />
    </>
  );
}
