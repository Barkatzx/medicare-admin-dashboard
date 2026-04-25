// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export default function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Add keyboard shortcut for search (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Welcome Message */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, {user?.name?.split(" ")[0] || "Admin"}!
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Here's what's happening with your store today
            </p>
          </div>
        </div>

        {/* Right Section - Search Bar */}
        <div className="flex-1 max-w-md">
          <div
            className={`relative transition-all duration-200 ${isSearchFocused ? "scale-105" : ""}`}
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f7f7f7] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded hidden lg:block">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </header>
  );
}
