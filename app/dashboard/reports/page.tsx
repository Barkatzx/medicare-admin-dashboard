// src/app/dashboard/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api, SalesSummary } from "@/config/api";
import {
  Download,
  TrendingUp,
  ShoppingBagIcon,
  Users,
  Package,
  DollarSign,
} from "lucide-react";
import SalesChart from "@/app/dashboard/charts/SalesChart";

export default function ReportsPage() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await api.getSalesSummary();
        setSalesSummary(summary);
      } catch (error) {
        console.error("Failed to fetch sales summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await api.exportSalesData(format);
    } catch (error) {
      console.error("Failed to export data:", error);
    } finally {
      setExporting(false);
    }
  };

  const metrics = [
    {
      label: "Total Revenue",
      value: `$${salesSummary?.totalRevenue.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Total Orders",
      value: salesSummary?.totalOrders.toString() || "0",
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
    },
    {
      label: "Average Order Value",
      value: `$${salesSummary?.averageOrderValue.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      label: "Total Customers",
      value: salesSummary?.totalCustomers.toString() || "0",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            View detailed reports and export data
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleExport("csv")} loading={exporting}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleExport("pdf")}
            loading={exporting}
          >
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="dashboard-label">{metric.label}</p>
                  <p className="dashboard-stat mt-2">{metric.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${metric.color} bg-opacity-10 rounded-xl flex items-center justify-center`}
                >
                  <Icon
                    size={24}
                    className={`text-${metric.color.split("-")[1]}-600`}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Sales Trend">
        <SalesChart />
      </Card>
    </div>
  );
}
