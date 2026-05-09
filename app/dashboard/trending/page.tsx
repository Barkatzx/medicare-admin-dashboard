"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { fetchTrendingProducts, updateTrendingStatus } from "@/store/slices/trendingSlice";
import Image from "next/image";
import toast from "react-hot-toast";
import { Star, TrendingUp, Loader2, Package, AlertCircle } from "lucide-react";

export default function TrendingProductsPage() {
  const dispatch = useDispatch();
  const { trendingProducts, loading, error } = useSelector((state: RootState) => state.trending);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTrendingProducts() as any);
  }, [dispatch]);

  const handleRemoveTrending = async (productId: string) => {
    setUpdatingId(productId);
    try {
      await dispatch(updateTrendingStatus({ productId, trending: false }) as any);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Trending Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchTrendingProducts() as any)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            <h1 className="text-3xl font-bold text-gray-900">Trending Products</h1>
          </div>
          <p className="text-sm text-gray-600">
            View products that appear on the homepage trending section. You can remove them here or manage them from the Products page.
          </p>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Trending Products ({trendingProducts.length})
            </h2>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
          </div>

          <div className="p-6">
            {loading && trendingProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p>Loading trending products...</p>
              </div>
            ) : trendingProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Star className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No trending products yet</h3>
                <p className="text-sm text-gray-500">
                  Go to the Products page and click the Star icon to mark products as trending.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingProducts.map((product) => {
                  const defaultImage = product.images?.find((img) => img.isDefault) || product.images?.[0];
                  const isUpdating = updatingId === product.id;

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="w-full h-48 relative bg-gray-100">
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
                            <Package className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full shadow-sm">
                            <Star size={12} className="fill-current" />
                            Trending
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{product.category?.name || "Uncategorized"}</p>
                        
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              ৳{product.finalPrice?.toLocaleString() || product.price.toLocaleString()}
                            </span>
                            {product.discountPercent > 0 && (
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                                <span className="text-xs text-emerald-600 font-medium">-{product.discountPercent}%</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleRemoveTrending(product.id)}
                            disabled={isUpdating}
                            className="flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove from trending"
                          >
                            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} className="fill-red-600 text-red-600" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
