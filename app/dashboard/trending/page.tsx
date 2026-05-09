"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import {
  fetchTrendingProducts,
  updateTrendingStatus,
} from "@/store/slices/trendingSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Star,
  StarOff,
  Search,
  Loader2,
  Package,
  TrendingUp,
  X,
  AlertCircle,
} from "lucide-react";

export default function FeaturedProductsPage() {
  const dispatch = useDispatch();
  const {
    trendingProducts,
    loading: trendingLoading,
    error: trendingError,
  } = useSelector((state: RootState) => state.trending);
  const { products: allProducts, loading: productsLoading } = useSelector(
    (state: RootState) => state.products,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch trending products and all products on mount
  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchTrendingProducts() as any),
        dispatch(fetchProducts({ page: 1, limit: 100 }) as any),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data. Please refresh the page.");
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleToggleTrending = async (productId: string, trending: boolean) => {
    setUpdatingId(productId);
    try {
      await dispatch(updateTrendingStatus({ productId, trending }) as any);
    } catch (error) {
      console.error("Toggle trending error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter non-trending products for search
  const trendingIds = new Set(trendingProducts.map((p) => p.id));
  const availableProducts = allProducts.filter(
    (p) =>
      !trendingIds.has(p.id) &&
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isLoading = trendingLoading || productsLoading;

  // Show error state if there's an error
  if (trendingError && !trendingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Trending Products
          </h2>
          <p className="text-gray-600 mb-4">{trendingError}</p>
          <button
            onClick={() => dispatch(fetchTrendingProducts() as any)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Trending Products
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Manage products that appear on the homepage trending section. Toggle
            the star icon to add or remove products from trending.
          </p>
        </div>

        {/* Trending Products List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Active Trending Products ({trendingProducts.length})
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  These products will appear in the trending section on the
                  homepage
                </p>
              </div>
              {trendingLoading && (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              )}
            </div>
          </div>

          <div className="p-6">
            {trendingLoading && trendingProducts.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                <p className="mt-4 text-gray-600">
                  Loading trending products...
                </p>
              </div>
            ) : trendingProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <StarOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trending products yet
                </h3>
                <p className="text-gray-500">
                  Search for products below and mark them as trending to get
                  started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {trendingProducts.map((product, index) => {
                  const defaultImage =
                    product.images?.find((img) => img.isDefault) ||
                    product.images?.[0];
                  const isUpdating = updatingId === product.id;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Rank */}
                        <div className="w-10 text-center">
                          <span className="text-lg font-semibold text-gray-500">
                            #{index + 1}
                          </span>
                        </div>

                        {/* Product Image */}
                        <div className="w-16 h-16 relative bg-white rounded-lg overflow-hidden flex-shrink-0">
                          {defaultImage?.url ? (
                            <Image
                              src={defaultImage.url}
                              alt={product.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Category:{" "}
                            {product.category?.name || "Uncategorized"}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-semibold text-gray-900">
                              $
                              {product.finalPrice?.toFixed(2) ||
                                product.price.toFixed(2)}
                            </span>
                            {product.discountPercent > 0 && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                -{product.discountPercent}%
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              Stock: {product.stock}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleToggleTrending(product.id, false)}
                        disabled={isUpdating}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add Trending Products Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Add Products to Trending
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Search for products and click the star icon to add them to
              trending
            </p>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearching(true);
                  }}
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="space-y-2">
                {searching ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  </div>
                ) : availableProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No products found matching "{searchTerm}"
                  </div>
                ) : (
                  availableProducts.slice(0, 20).map((product) => {
                    const defaultImage =
                      product.images?.find((img) => img.isDefault) ||
                      product.images?.[0];
                    const isUpdating = updatingId === product.id;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Product Image */}
                          <div className="w-12 h-12 relative bg-white rounded-lg overflow-hidden flex-shrink-0">
                            {defaultImage?.url ? (
                              <Image
                                src={defaultImage.url}
                                alt={product.name || "Product"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-gray-900">
                                $
                                {product.finalPrice?.toFixed(2) ||
                                  product.price.toFixed(2)}
                              </span>
                              {product.discountPercent > 0 && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                  -{product.discountPercent}%
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                Stock: {product.stock}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Add to Trending Button */}
                        <button
                          onClick={() => handleToggleTrending(product.id, true)}
                          disabled={isUpdating}
                          className="ml-4 p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Star className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {!searchTerm && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>Type a product name to search and add to trending</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
