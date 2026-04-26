// src/app/dashboard/orders/components/ExportCSV.tsx
"use client";

import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ExportCSVProps {
  orders: any[];
}

export default function ExportCSV({ orders }: ExportCSVProps) {
  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvData = orders.map(order => ({
        'Order ID': order.id,
        'Customer Name': order.user.name,
        'Customer Email': order.user.email,
        'Customer Phone': order.user.phone_number,
        'Total Amount': order.totalAmount,
        'Status': order.status,
        'Payment Method': order.payment?.method || 'N/A',
        'Payment Status': order.payment?.status || 'N/A',
        'Order Date': new Date(order.createdAt).toLocaleString(),
        'Shipping Address': order.shippingAddress ? 
          `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` : 
          'N/A'
      }));

      // Convert to CSV string
      const headers = Object.keys(csvData[0] || {}) as Array<keyof typeof csvData[number]>;
      const csvRows = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','))
      ];
      const csvString = csvRows.join('\n');

      // Download file
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Exported ${orders.length} orders to CSV`);
    } catch (error) {
      toast.error('Failed to export orders');
    }
  };

  return (
    <Button onClick={exportToCSV} variant="secondary" className="gap-2">
      <Download size={16} />
      Export CSV
    </Button>
  );
}