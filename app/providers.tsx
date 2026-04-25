"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "react-hot-toast";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <>
        {children}
        <Toaster position="top-right" />
      </>
    </Provider>
  );
}
