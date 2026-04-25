"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateProductStock } from "@/store/slices/productSlice";
import Button from "@/components/ui/Button";

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
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      if (operation === "set") {
        await dispatch(
          updateProductStock({ id: product.id, stock: stockAmount }),
        ).unwrap();
      } else if (operation === "increment") {
        await dispatch(
          updateProductStock({
            id: product.id,
            operation: "increment",
            stock: stockAmount,
          }),
        ).unwrap();
      } else if (operation === "decrement") {
        if (product.stock - stockAmount < 0) {
          alert("Cannot decrement below 0");
          return;
        }
        await dispatch(
          updateProductStock({
            id: product.id,
            operation: "decrement",
            stock: stockAmount,
          }),
        ).unwrap();
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Stock update error:", error);
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
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-medium mb-4">
            Manage Stock: {product.name}
          </h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Current Stock: <strong>{product.stock} units</strong>
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Operation</label>
            <div className="flex gap-2">
              <button
                onClick={() => setOperation("increment")}
                className={`px-3 py-1 rounded ${operation === "increment" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                Add
              </button>
              <button
                onClick={() => setOperation("decrement")}
                className={`px-3 py-1 rounded ${operation === "decrement" ? "bg-red-600 text-white" : "bg-gray-200"}`}
              >
                Remove
              </button>
              <button
                onClick={() => setOperation("set")}
                className={`px-3 py-1 rounded ${operation === "set" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Set
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={stockAmount}
              onChange={(e) => setStockAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleUpdateStock} loading={loading}>
              Update
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
