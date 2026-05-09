"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import {
  fetchTrendingProducts,
  updateTrendingStatus,
} from "@/store/slices/trendingSlice";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Star,
  Award,
  Loader2,
  Package,
  AlertCircle,
  TrendingUp,
  Shield,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
} from "lucide-react";

export default function TrendingProductsPage() {
  const dispatch = useDispatch();
  const { trendingProducts, loading, error } = useSelector(
    (state: RootState) => state.trending,
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTrendingProducts() as any);
  }, [dispatch]);

  const handleRemoveTrending = async (productId: string) => {
    setUpdatingId(productId);
    try {
      await dispatch(
        updateTrendingStatus({ productId, trending: false }) as any,
      );
      toast.success("Product removed from trending");
    } catch (err) {
      console.error("Remove trending error:", err);
      toast.error("Failed to remove from trending");
    } finally {
      setUpdatingId(null);
    }
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Trending Products
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchTrendingProducts() as any)}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Trending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trendingProducts.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ৳
                  {trendingProducts
                    .reduce((sum, p) => sum + (p.finalPrice || p.price), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(trendingProducts.map((p) => p.categoryId)).size}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trendingProducts
                    .reduce((sum, p) => sum + p.stock, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Trending Products Table */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Trending Products
              </h2>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 ml-auto">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading && trendingProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-yellow-100 rounded-full animate-pulse" />
                  <Loader2 className="w-8 h-8 text-yellow-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                </div>
                <p className="text-gray-500 mt-4">
                  Loading trending products...
                </p>
              </div>
            ) : trendingProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No trending products yet
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  Go to the Products page and click the Star icon to mark
                  products as trending and showcase them here.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                      PRODUCT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                      CATEGORY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                      STOCK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trendingProducts.map((product, index) => {
                    const defaultImage =
                      product.images?.find((img) => img.isDefault) ||
                      product.images?.[0];
                    const isUpdating = updatingId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-yellow-600">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {defaultImage?.url ? (
                                <Image
                                  src={defaultImage.url}
                                  alt={product.name || "Product"}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {product.name}
                              </p>
                              {product.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                  {product.description.substring(0, 60)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              ৳
                              {(
                                product.finalPrice || product.price
                              ).toLocaleString()}
                            </p>
                            {product.discountPercent > 0 && (
                              <p className="text-xs text-gray-400 line-through">
                                ৳{product.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                              product.stock <= 20
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.discountPercent > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="inline-flex px-2 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-lg">
                                -{product.discountPercent}%
                              </span>
                              <span className="text-xs text-gray-500">
                                Save ৳
                                {(
                                  product.price -
                                  (product.finalPrice || product.price)
                                ).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No discount
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleRemoveTrending(product.id)}
                            disabled={isUpdating}
                            className="group/btn relative p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove from trending"
                          >
                            {isUpdating ? (
                              <Loader2
                                size={16}
                                className="animate-spin text-red-600"
                              />
                            ) : (
                              <>
                                <Star
                                  size={16}
                                  className="text-yellow-600 fill-yellow-600"
                                />
                                <div className="absolute inset-0 bg-yellow-200 rounded-lg scale-0 transition-transform duration-200" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
