// src/app/dashboard/products/StockManagementModal.tsx
"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateProductStock } from "@/store/slices/productSlice";
import Button from "@/components/ui/Button";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  Package,
  X,
  Minus,
  Plus,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface StockManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

export default function StockManagementModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: StockManagementModalProps) {
  const dispatch = useAppDispatch();
  const [stockAmount, setStockAmount] = useState(1);
  const [operation, setOperation] = useState<"increment" | "decrement" | "set">(
    "increment",
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  // In StockManagementModal.tsx, add console logs

  const handleUpdateStock = async () => {
    if (stockAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    console.log("Updating stock with:", {
      id: product.id,
      operation,
      stock: stockAmount,
    });

    setLoading(true);
    try {
      let result;
      if (operation === "set") {
        result = await dispatch(
          updateProductStock({ id: product.id, stock: stockAmount }),
        ).unwrap();
        console.log("Set stock result:", result);
      } else if (operation === "increment") {
        result = await dispatch(
          updateProductStock({
            id: product.id,
            operation: "increment",
            stock: stockAmount,
          }),
        ).unwrap();
        console.log("Increment result:", result);
      } else if (operation === "decrement") {
        if (product.stock - stockAmount < 0) {
          toast.error("Cannot decrement below 0");
          return;
        }
        result = await dispatch(
          updateProductStock({
            id: product.id,
            operation: "decrement",
            stock: stockAmount,
          }),
        ).unwrap();
        console.log("Decrement result:", result);
      }
      toast.success("Stock updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Stock update error details:", error);
      toast.error(error.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const getNewStock = () => {
    if (operation === "increment") return product.stock + stockAmount;
    if (operation === "decrement")
      return Math.max(0, product.stock - stockAmount);
    return stockAmount;
  };

  const isLowStock = getNewStock() <= 10 && getNewStock() > 0;
  const isOutOfStock = getNewStock() === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Package size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Manage Stock
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{product.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Current Stock Display */}
            <div
              className={`rounded-xl p-4 transition-all duration-300 ${
                product.stock <= 10
                  ? "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Current Stock
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      product.stock <= 10
                        ? "text-red-600"
                        : product.stock <= 20
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}
                  >
                    {product.stock} units
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    product.stock <= 10
                      ? "bg-red-100"
                      : product.stock <= 20
                        ? "bg-amber-100"
                        : "bg-emerald-100"
                  }`}
                >
                  <Package
                    size={24}
                    className={
                      product.stock <= 10
                        ? "text-red-600"
                        : product.stock <= 20
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }
                  />
                </div>
              </div>
              {product.stock <= 20 && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 bg-amber-50 inline-flex px-2 py-1 rounded-full">
                  <AlertCircle size={12} />
                  Low stock warning
                </div>
              )}
            </div>

            {/* Operation Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Operation Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOperation("increment")}
                  className={`group relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    operation === "increment"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  <Plus size={14} />
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setOperation("decrement")}
                  className={`group relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    operation === "decrement"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  <Minus size={14} />
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setOperation("set")}
                  className={`group relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    operation === "set"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  <RefreshCw size={14} />
                  Set
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {operation === "increment"
                  ? "Amount to Add"
                  : operation === "decrement"
                    ? "Amount to Remove"
                    : "New Stock Amount"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={stockAmount}
                  onChange={(e) =>
                    setStockAmount(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-semibold"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  units
                </div>
              </div>
            </div>

            {/* Preview New Stock */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg">
                    <RefreshCw size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    New Stock Preview
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      isOutOfStock
                        ? "text-red-600"
                        : isLowStock
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}
                  >
                    {getNewStock()} units
                  </p>
                  {isLowStock && !isOutOfStock && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      ⚠️ Will be low stock
                    </p>
                  )}
                  {isOutOfStock && (
                    <p className="text-xs text-red-600 mt-0.5">
                      ⚠️ Will be out of stock
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Validation Message */}
            {operation === "decrement" && stockAmount > product.stock && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600">
                  Cannot remove more than current stock ({product.stock} units)
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <Button
              onClick={handleUpdateStock}
              loading={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              disabled={
                operation === "decrement" && stockAmount > product.stock
              }
            >
              {operation === "increment"
                ? "Add Stock"
                : operation === "decrement"
                  ? "Remove Stock"
                  : "Update Stock"}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
