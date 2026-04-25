"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuthStatus } from "@/store/slices/authSlice";
import Spinner from "../ui/Spinner";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <Spinner />;
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
