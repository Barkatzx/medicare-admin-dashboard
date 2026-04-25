"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { api } from "@/config/api";

type Period = "daily" | "weekly" | "monthly";

export default function SalesChart() {
  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let salesData;
        switch (period) {
          case "daily":
            salesData = await api.getDailySales();
            break;
          case "weekly":
            salesData = await api.getWeeklySales();
            break;
          case "monthly":
            salesData = await api.getMonthlySales();
            break;
        }
        setData(Array.isArray(salesData) ? salesData : []);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              period === p
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={
              period === "daily"
                ? "date"
                : period === "weekly"
                  ? "week"
                  : "month"
            }
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#3b82f6" />
          <Bar dataKey="orders" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
