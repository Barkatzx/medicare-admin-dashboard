// src/components/dashboard/TopProductsChart.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTopProducts } from "@/store/slices/productSlice";
import type { TopProduct } from "@/config/api";
import {
  Package,
  TrendingUp,
  Loader2,
  Star,
  Award,
  Eye,
  Tag,
  Layers,
  DollarSign,
  ShoppingCart,
  Image as ImageIcon,
} from "lucide-react";

// Default image placeholder - you can replace this URL with your own default image
const DEFAULT_IMAGE_FALLBACK =
  "https://dkohdjvtnkzhmpvxmwtg.supabase.co/storage/v1/object/public/medicare-images/products/default-product-placeholder.webp";

interface ChartDataItem {
  name: string;
  totalRevenue: number;
  totalSold: number;
  price: number;
  discountedPrice: number | null;
  stock: number;
  category: string;
  imageUrl: string | undefined;
  originalProduct: TopProduct;
  rank: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as ChartDataItem;
    const imageUrl = data?.imageUrl || DEFAULT_IMAGE_FALLBACK;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[260px]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={imageUrl}
              alt={data?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_IMAGE_FALLBACK;
              }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-500">{data?.category}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <DollarSign size={12} className="text-blue-600" />
              <span className="text-sm text-gray-600">Total Revenue</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">
              ৳{data?.totalRevenue?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={12} className="text-emerald-600" />
              <span className="text-sm text-gray-600">Units Sold</span>
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {data?.totalSold?.toLocaleString() || 0} units
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-purple-600" />
              <span className="text-sm text-gray-600">Unit Price</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              ৳{data?.price?.toLocaleString() || 0}
            </span>
          </div>
          {data?.discountedPrice && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-orange-600" />
                <span className="text-sm text-gray-600">Discounted Price</span>
              </div>
              <span className="text-sm font-medium text-orange-600">
                ৳{data.discountedPrice}
              </span>
            </div>
          )}
          <div className="pt-2 mt-1 border-t border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-500">Stock Remaining</span>
              <span
                className={`text-xs font-medium ${(data?.stock || 0) <= 10 ? "text-red-600" : "text-gray-700"}`}
              >
                {data?.stock || 0} units
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Colors for bars
const colors = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#a855f7", // Purple
];

export default function TopProductsChart() {
  const dispatch = useAppDispatch();
  const { topProducts, topProductsLoading } = useAppSelector(
    (state) => state.products,
  );
  const [chartType, setChartType] = useState<"revenue" | "units">("revenue");
  const [selectedProduct, setSelectedProduct] = useState<TopProduct | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!topProducts.length) {
      dispatch(fetchTopProducts(10));
    }
  }, [dispatch, topProducts.length]);

  const handleProductClick = (product: TopProduct) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getProductImageUrl = (product: TopProduct) => {
    if (imageErrors[product.id]) {
      return DEFAULT_IMAGE_FALLBACK;
    }
    if (product.images?.[0]?.url) {
      return product.images[0].url;
    }
    return DEFAULT_IMAGE_FALLBACK;
  };

  // Prepare chart data with additional info
  const chartData: ChartDataItem[] = topProducts.map((product, index) => ({
    name: product.name,
    totalRevenue: product.totalRevenue,
    totalSold: product.totalSold,
    price:
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price,
    discountedPrice: product.discountedPrice
      ? typeof product.discountedPrice === "string"
        ? parseFloat(product.discountedPrice)
        : product.discountedPrice
      : null,
    stock: product.stock,
    category: product.category?.name || "Uncategorized",
    imageUrl: getProductImageUrl(product),
    originalProduct: product,
    rank: index + 1,
  }));

  const totalRevenue = topProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalUnits = topProducts.reduce((sum, p) => sum + p.totalSold, 0);
  const topProduct = topProducts[0];

  if (topProductsLoading && !topProducts.length) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading top products...</p>
      </div>
    );
  }

  if (topProducts.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <Package size={32} className="text-gray-400 mb-3" />
        <p className="text-sm text-gray-500">No product data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-600">
              Total Revenue (Top {topProducts.length})
            </p>
            <TrendingUp size={12} className="text-blue-600" />
          </div>
          <p className="text-lg font-bold text-blue-700">
            ৳{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-600">Total Units Sold</p>
            <Package size={12} className="text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-emerald-700">
            {totalUnits.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setChartType("revenue")}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
            chartType === "revenue"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Revenue (৳)
        </button>
        <button
          onClick={() => setChartType("units")}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
            chartType === "units"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Units Sold
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                chartType === "revenue"
                  ? `৳${value.toLocaleString()}`
                  : value.toLocaleString()
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={95}
              tick={(props: any) => {
                const { x, y, payload } = props;
                const item = chartData.find((d) => d.name === payload.value);
                const rank = item?.rank;
                const isTopRank = rank !== undefined && rank <= 3;

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-8}
                      y={0}
                      dy={4}
                      textAnchor="end"
                      fill="#374151"
                      fontSize={11}
                      fontWeight={isTopRank ? 600 : 400}
                    >
                      {isTopRank && (
                        <tspan>
                          {rank === 1 && "🥇 "}
                          {rank === 2 && "🥈 "}
                          {rank === 3 && "🥉 "}
                        </tspan>
                      )}
                      {payload.value.length > 25
                        ? payload.value.substring(0, 22) + "..."
                        : payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
            <Bar
              dataKey={chartType === "revenue" ? "totalRevenue" : "totalSold"}
              radius={[0, 8, 8, 0]}
              onClick={(data) => handleProductClick(data.originalProduct)}
              cursor="pointer"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartType === "revenue"
                      ? colors[index % colors.length]
                      : "#10b981"
                  }
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Product Highlight */}
      {topProduct && (
        <div
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleProductClick(topProduct)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award size={14} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Top Performing Product
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={getProductImageUrl(topProduct)}
                alt={topProduct.name}
                className="w-full h-full object-cover"
                onError={() => handleImageError(topProduct.id)}
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{topProduct.name}</p>
              <p className="text-xs text-gray-500">
                {topProduct.category?.name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-medium text-amber-600">
                  ৳{topProduct.totalRevenue.toLocaleString()} revenue
                </span>
                <span className="text-xs text-gray-500">
                  {topProduct.totalSold} units sold
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Product Header with Default Image Support */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={getProductImageUrl(selectedProduct)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(selectedProduct.id)}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg">
                      <Layers size={10} />
                      {selectedProduct.category?.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      <Package size={10} />
                      ID: {selectedProduct.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sales Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ৳{selectedProduct.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Units Sold</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {selectedProduct.totalSold.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Pricing Information
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Original Price
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ৳
                      {(typeof selectedProduct.price === "string"
                        ? parseFloat(selectedProduct.price)
                        : selectedProduct.price
                      ).toLocaleString()}
                    </span>
                  </div>
                  {selectedProduct.discountedPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Discounted Price
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        ৳
                        {(typeof selectedProduct.discountedPrice === "string"
                          ? parseFloat(selectedProduct.discountedPrice)
                          : selectedProduct.discountedPrice
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedProduct.discountPercent && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Discount</span>
                      <span className="text-sm font-medium text-orange-600">
                        {selectedProduct.discountPercent}% OFF
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Current Stock</span>
                    <span
                      className={`text-sm font-semibold ${selectedProduct.stock <= 10 ? "text-red-600" : "text-gray-900"}`}
                    >
                      {selectedProduct.stock} units remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Images with Default Fallback */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Product Images
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProduct.images.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={img.url}
                          alt={img.altText || selectedProduct.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              DEFAULT_IMAGE_FALLBACK;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-500">Revenue (৳)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs text-gray-500">Units Sold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-amber-500" />
          <span className="text-xs text-gray-500">Top 3 Products</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">Click bars for details</span>
        </div>
      </div>
    </div>
  );
}
