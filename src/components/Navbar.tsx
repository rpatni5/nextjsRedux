'use client';

import React from "react";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleTheme, toggleSidebar } from "@/lib/store/features/theme/themeSlice";
import * as Tooltip from '@radix-ui/react-tooltip';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { mode, sidebarCollapsed } = useAppSelector((state) => state.theme);

  const handleThemeToggle = () => dispatch(toggleTheme());
  const handleSidebarToggle = () => dispatch(toggleSidebar());

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: sidebarCollapsed ? "70px" : "240px",
        width: sidebarCollapsed ? "calc(100% - 70px)" : "calc(100% - 240px)",
        height: "60px",
        backgroundColor: mode === "dark" ? "#1e293b" : "#fff",
        color: mode === "dark" ? "#f8fafc" : "#1f2937",
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "0 1.5rem",
        boxShadow: mode === "dark"
        ? "0 2px 4px rgba(255, 255, 255, 0.1)"  
        : "0 2px 4px rgba(0, 0, 0, 0.05)", 
        zIndex: 1000,
      }}
    >
      <div style={styles.left}>
        <button onClick={handleSidebarToggle} >
        {sidebarCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}

        </button>
       
      </div>

      <div style={styles.right}>
      <button onClick={handleThemeToggle}>
          {mode === "light" ? "💡" : "🌙"}
        </button>
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{
                  ...styles.logoutBtn,
                  color: mode === "dark" ? "#ffffff" : "#1f2937",
                }}
              >
                <FiLogOut size={20} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="bottom"
                sideOffset={5}
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "10px 10px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                Logout
                <Tooltip.Arrow style={{ fill: "#333" }} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  left: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#1f2937",
  },
  iconBtn: {
    background: "transparent",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "0.3rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};
