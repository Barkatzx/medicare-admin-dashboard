// src/components/layout/Header.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  Bell,
  ArrowRight,
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import SearchModal from "@/components/ui/SearchModal";

interface SearchItem {
  name: string;
  href: string;
  icon: any;
  category: string;
  keywords: string[];
}

export default function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Define all searchable routes
  const menuItems: SearchItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      category: "Navigation",
      keywords: ["home", "main", "overview"],
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      category: "Management",
      keywords: ["customers", "accounts", "people"],
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: Package,
      category: "Management",
      keywords: ["items", "inventory", "stock"],
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: FolderTree,
      category: "Management",
      keywords: ["tags", "groups", "types"],
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      category: "Management",
      keywords: ["sales", "purchases", "transactions"],
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      category: "Analytics",
      keywords: ["analytics", "statistics", "sales"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      category: "Account",
      keywords: ["preferences", "profile", "account"],
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      category: "Account",
      keywords: ["alerts", "updates"],
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
      category: "Support",
      keywords: ["support", "faq", "guide"],
    },
  ];

  // Search function
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.keywords.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery),
        ),
    );

    // Sort results by relevance (exact matches first)
    const sortedResults = results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === lowerQuery ? 1 : 0;
      const bExact = b.name.toLowerCase() === lowerQuery ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return a.name.length - b.name.length;
    });

    setSearchResults(sortedResults);
    setShowResults(sortedResults.length > 0);
  }, []);

  // Handle search input change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, performSearch]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowResults(false);
      setSearchQuery("");
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Navigate to result
  const navigateTo = (href: string) => {
    router.push(href);
    clearSearch();
  };

  // Keyboard shortcut for search modal (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Group results by category
  const groupedResults = searchResults.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>,
  );

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-3">
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
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div
              className={`relative transition-all duration-200 ${isSearchFocused ? "scale-105" : ""}`}
            >
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search anything... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (searchQuery) performSearch(searchQuery);
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded hidden lg:block">
                ⌘K
              </kbd>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in">
                <div className="max-h-96 overflow-y-auto">
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {category}
                        </span>
                      </div>
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.href}
                            onClick={() => navigateTo(item.href)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                          >
                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                              <Icon
                                size={16}
                                className="text-gray-600 group-hover:text-blue-600"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.href}
                              </p>
                            </div>
                            <ArrowRight
                              size={14}
                              className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                  <span>Press ⏎ to navigate</span>
                  <span>ESC to close</span>
                </div>
              </div>
            )}

            {/* No Results */}
            {showResults && searchResults.length === 0 && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-8 text-center">
                  <Search size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try searching for dashboard, users, products, or settings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </header>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </>
  );
}
