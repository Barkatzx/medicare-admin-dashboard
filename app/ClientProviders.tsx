// src/app/ClientProviders.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "@/components/Initializer/AuthInitializer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
        <Toaster position="top-right" />
      </AuthInitializer>
    </Provider>
  );
}
