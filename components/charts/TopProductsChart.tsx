"use client";

import { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTopProducts } from "@/store/slices/productSlice";
import type { TopProduct } from "@/config/api";
import {
  Package,
  Layers,
  X,
  Crown,
  Sparkles,
  Zap,
  Star,
  Medal,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

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
  imageUrl: string;
  originalProduct: TopProduct;
  rank: number;
  percentage: number;
}

// Active shape for pie chart
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill="#333"
        className="text-sm font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        dy={8}
        textAnchor="middle"
        fill="#666"
        className="text-xs"
      >
        {(percent * 100).toFixed(0)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300"
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius - 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`${fill}40`}
      />
    </g>
  );
};

export default function TopProductsChart() {
  const dispatch = useAppDispatch();
  const { topProducts, topProductsLoading } = useAppSelector(
    (state) => state.products,
  );
  const [chartType, setChartType] = useState<"revenue" | "units">("revenue");
  const [viewMode, setViewMode] = useState<"bar" | "pie">("bar");
  const [selectedProduct, setSelectedProduct] = useState<TopProduct | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    if (!topProducts.length) dispatch(fetchTopProducts(10));
  }, [dispatch, topProducts.length]);

  const handleProductClick = (product: TopProduct) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getProductImageUrl = (product: TopProduct): string => {
    if (imageErrors[product.id]) return DEFAULT_IMAGE_FALLBACK;
    return product.images?.[0]?.url ?? DEFAULT_IMAGE_FALLBACK;
  };

  const totalRevenue = topProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalUnits = topProducts.reduce((sum, p) => sum + p.totalSold, 0);

  const chartData: ChartDataItem[] = topProducts.map((product, index) => ({
    name: product.name || "Unknown",
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
    percentage:
      chartType === "revenue"
        ? (product.totalRevenue / totalRevenue) * 100
        : (product.totalSold / totalUnits) * 100,
  }));

  const pieData = chartData.map((item) => ({
    name:
      item.name.length > 20 ? item.name.substring(0, 18) + "..." : item.name,
    value: chartType === "revenue" ? item.totalRevenue : item.totalSold,
    fullName: item.name,
    product: item.originalProduct,
  }));

  if (topProductsLoading && !topProducts.length) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-sm text-gray-500 mt-4 font-medium">
          Analyzing top performers...
        </p>
      </div>
    );
  }

  if (topProducts.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
        <div className="relative">
          <Package size={48} className="text-gray-300" />
          <Zap className="absolute -top-2 -right-2 w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-500 mt-4 font-medium">
          No product data available
        </p>
      </div>
    );
  }

  const topProduct = topProducts[0] ?? null;
  const secondProduct = topProducts[1] ?? null;
  const thirdProduct = topProducts[2] ?? null;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Medal size={18} className="text-amber-500" />
            Top Performers
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Based on{" "}
            {chartType === "revenue" ? "revenue generated" : "units sold"}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("bar")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "bar" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <BarChart3 size={14} />
          </button>
          <button
            onClick={() => setViewMode("pie")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "pie" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <PieChartIcon size={14} />
          </button>
        </div>
      </div>

      {/* Mini Podium for Top 3 */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
        <div className="flex items-center justify-around">
          {/* 2nd Place */}
          {secondProduct && (
            <div
              className="text-center group cursor-pointer"
              onClick={() => handleProductClick(secondProduct)}
            >
              <div className="relative">
                <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 ring-2 ring-gray-400 group-hover:scale-105 transition-transform">
                  <img
                    src={getProductImageUrl(secondProduct)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  2
                </div>
              </div>
              <p className="text-xs font-medium text-gray-700 mt-2 line-clamp-1 max-w-[80px]">
                {secondProduct.name?.substring(0, 15) ?? "Unknown"}
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">
                ৳{secondProduct.totalRevenue.toLocaleString()}
              </p>
            </div>
          )}

          {/* 1st Place - Champion */}
          {topProduct && (
            <div
              className="text-center group cursor-pointer -mt-6"
              onClick={() => handleProductClick(topProduct)}
            >
              <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Crown size={20} className="text-yellow-500" />
                </div>
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ring-amber-400 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src={getProductImageUrl(topProduct)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-1 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  1
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800 mt-2 line-clamp-1 max-w-[100px]">
                {topProduct.name?.substring(0, 20) ?? "Unknown"}
              </p>
              <p className="text-xs font-bold text-amber-600 mt-1">
                ৳{topProduct.totalRevenue.toLocaleString()}
              </p>
              <div className="mt-1 inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-200 rounded-full">
                <Star size={10} className="text-amber-700" />
                <span className="text-[10px] font-semibold text-amber-800">
                  BEST
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {thirdProduct && (
            <div
              className="text-center group cursor-pointer"
              onClick={() => handleProductClick(thirdProduct)}
            >
              <div className="relative">
                <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-amber-300 ring-2 ring-amber-300 group-hover:scale-105 transition-transform">
                  <img
                    src={getProductImageUrl(thirdProduct)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  3
                </div>
              </div>
              <p className="text-xs font-medium text-gray-700 mt-2 line-clamp-1 max-w-[80px]">
                {thirdProduct.name?.substring(0, 15) ?? "Unknown"}
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">
                ৳{thirdProduct.totalRevenue.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setChartType("revenue")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${chartType === "revenue" ? "bg-blue-600 text-white shadow-md" : "text-gray-600"}`}
        >
          Revenue (৳)
        </button>
        <button
          onClick={() => setChartType("units")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${chartType === "units" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600"}`}
        >
          Units Sold
        </button>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        {viewMode === "bar" ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
              barSize={32}
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
                tickFormatter={(v) =>
                  chartType === "revenue"
                    ? `৳${(v / 1000).toFixed(0)}k`
                    : v.toLocaleString()
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
                  const medal =
                    item?.rank === 1
                      ? "🥇 "
                      : item?.rank === 2
                        ? "🥈 "
                        : item?.rank === 3
                          ? "🥉 "
                          : "";
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={-8}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="#374151"
                        fontSize={11}
                        fontWeight={item?.rank && item.rank <= 3 ? 600 : 400}
                      >
                        {medal}
                        {payload.value.length > 22
                          ? payload.value.substring(0, 19) + "..."
                          : payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f3f4f6" }}
              />
              <Bar
                dataKey={chartType === "revenue" ? "totalRevenue" : "totalSold"}
                radius={[0, 8, 8, 0]}
                onClick={(data) => handleProductClick(data.originalProduct)}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      chartType === "revenue"
                        ? entry.rank === 1
                          ? "#f59e0b"
                          : entry.rank === 2
                            ? "#94a3b8"
                            : entry.rank === 3
                              ? "#d97706"
                              : colors[index % colors.length]
                        : "#10b981"
                    }
                    fillOpacity={hoveredBar === index ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onClick={(data) => handleProductClick(data.payload.product)}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        chartType === "revenue"
                          ? colors[index % colors.length]
                          : "#10b981"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-800">
                {chartType === "revenue"
                  ? `৳${(totalRevenue / 1000).toFixed(0)}k`
                  : totalUnits.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 bg-black text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Product Header */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-md">
                  <img
                    src={getProductImageUrl(selectedProduct)}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(selectedProduct.id)}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedProduct.totalRevenue ===
                      topProduct?.totalRevenue && (
                      <Crown size={16} className="text-yellow-500" />
                    )}
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedProduct.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      <Layers size={10} />
                      {selectedProduct.category?.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      <Package size={10} />
                      SKU: {selectedProduct.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ৳{selectedProduct.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {(
                      (selectedProduct.totalRevenue / totalRevenue) *
                      100
                    ).toFixed(1)}
                    % of total
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Units Sold</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {selectedProduct.totalSold.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {((selectedProduct.totalSold / totalUnits) * 100).toFixed(
                      1,
                    )}
                    % of total
                  </p>
                </div>
              </div>

              {/* Pricing */}
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
                      ৳{selectedProduct.price.toLocaleString()}
                    </span>
                  </div>
                  {selectedProduct.discountedPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Discounted Price
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        ৳{selectedProduct.discountedPrice.toLocaleString()}
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
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Colors array
const colors = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
];

// CustomTooltip component remains the same as before
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[200px]">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Revenue</span>
            <span className="text-xs font-semibold text-blue-600">
              ৳{data.totalRevenue?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Units</span>
            <span className="text-xs font-semibold text-emerald-600">
              {data.totalSold?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
            <span className="text-xs text-gray-500">Rank</span>
            <span className="text-xs font-semibold text-amber-600">
              #{data.rank}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
