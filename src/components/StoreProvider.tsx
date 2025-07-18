"use client";

import React, { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, createStore } from "@/lib/store/store";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createStore()
  }
  
  return <Provider store={ storeRef.current}>{children}</Provider>;
};

export default StoreProvider;

