// src/app/dashboard/orders/components/InvoiceView.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FileText, X } from "lucide-react";

interface InvoiceViewProps {
  order: any;
}

export default function InvoiceView({ order }: InvoiceViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const calculateSubtotal = () => {
    return (
      order.items?.reduce(
        (sum: number, item: any) =>
          sum + parseFloat(item.price) * item.quantity,
        0,
      ) || 0
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors"
        title="View Invoice"
      >
        <FileText size={16} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Invoice Preview"
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Invoice Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-600">MediCare</h2>
            <p className="text-sm text-gray-500">
              Your Trusted Healthcare Partner
            </p>
            <h3 className="text-lg font-semibold mt-2">TAX INVOICE</h3>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Invoice Number</p>
              <p className="font-mono text-sm">
                INV-{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Invoice Date</p>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Bill To:</h4>
            <div className="space-y-1 text-sm">
              <p>{order.user.name}</p>
              <p>{order.user.email}</p>
              <p>{order.user.phone_number}</p>
              {order.shippingAddress && (
                <>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Order Items */}
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 text-sm font-semibold">
                  Product
                </th>
                <th className="text-center py-2 px-3 text-sm font-semibold">
                  Qty
                </th>
                <th className="text-right py-2 px-3 text-sm font-semibold">
                  Unit Price
                </th>
                <th className="text-right py-2 px-3 text-sm font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-3 text-sm">{item.product.name}</td>
                  <td className="text-center py-2 px-3 text-sm">
                    {item.quantity}
                  </td>
                  <td className="text-right py-2 px-3 text-sm">
                    {parseFloat(item.price).toLocaleString()} ৳
                  </td>
                  <td className="text-right py-2 px-3 text-sm">
                    {(parseFloat(item.price) * item.quantity).toLocaleString()}{" "}
                    ৳
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="text-right space-y-1 pt-4 border-t">
            <p className="text-sm">
              Subtotal: {calculateSubtotal().toLocaleString()} ৳
            </p>
            <p className="text-lg font-bold">
              Total: {parseFloat(order.totalAmount).toLocaleString()} ৳
            </p>
            {order.payment?.method === "cod" && (
              <p className="text-xs text-gray-500">
                Payment Method: Cash on Delivery
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Thank you for shopping with MediCare!</p>
            <p>For any queries, please contact us at support@medicare.com</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
