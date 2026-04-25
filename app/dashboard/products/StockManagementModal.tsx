// src/app/dashboard/products/StockManagementModal.tsx
"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateProductStock } from "@/store/slices/productSlice";
import Button from "@/components/ui/Button";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
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

  const handleUpdateStock = async () => {
    if (stockAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      if (operation === "set") {
        await dispatch(
          updateProductStock({ id: product.id, stock: stockAmount }),
        ).unwrap();
        toast.success(`Stock updated to ${stockAmount} units`);
      } else if (operation === "increment") {
        await dispatch(
          updateProductStock({
            id: product.id,
            operation: "increment",
            stock: stockAmount,
          }),
        ).unwrap();
        toast.success(`Added ${stockAmount} units to stock`);
      } else if (operation === "decrement") {
        if (product.stock - stockAmount < 0) {
          toast.error("Cannot decrement below 0");
          return;
        }
        await dispatch(
          updateProductStock({
            id: product.id,
            operation: "decrement",
            stock: stockAmount,
          }),
        ).unwrap();
        toast.success(`Removed ${stockAmount} units from stock`);
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Manage Stock
            </h3>
            <p className="text-sm text-gray-500 mt-1">{product.name}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock
              </label>
              <div className="text-2xl font-bold text-gray-900">
                {product.stock} units
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setOperation("increment")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    operation === "increment"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <TrendingUp size={14} />
                  Add
                </button>
                <button
                  onClick={() => setOperation("decrement")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    operation === "decrement"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <TrendingDown size={14} />
                  Remove
                </button>
                <button
                  onClick={() => setOperation("set")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    operation === "set"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <RefreshCw size={14} />
                  Set
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {operation === "increment"
                  ? "Amount to Add"
                  : operation === "decrement"
                    ? "Amount to Remove"
                    : "New Stock Amount"}
              </label>
              <input
                type="number"
                min="1"
                value={stockAmount}
                onChange={(e) => setStockAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {operation === "decrement" && stockAmount > product.stock && (
              <p className="text-sm text-red-600">
                Cannot remove more than current stock ({product.stock} units)
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpdateStock}
                loading={loading}
                className="flex-1"
              >
                {operation === "increment"
                  ? "Add Stock"
                  : operation === "decrement"
                    ? "Remove Stock"
                    : "Update Stock"}
              </Button>
              <Button variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
