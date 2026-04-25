// src/app/dashboard/layout.tsx
"use client";

import { useAppSelector } from "@/store/hooks";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return <Spinner />;
  }

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-white rounded-xl m-3 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
