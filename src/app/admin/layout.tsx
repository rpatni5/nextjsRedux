'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/lib/store/hooks";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: mode === "dark" ? "#1f2937" : "#ffffff", color: mode === "dark" ? "#f9fafb" : "#1f2937" }}
    >

      <Sidebar />
      <div className="flex flex-col flex-1 ml-[240px]">
        <div className="h-[60px]">
          <Navbar />
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
