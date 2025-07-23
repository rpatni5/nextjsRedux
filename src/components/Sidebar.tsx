'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaCogs, FaLayerGroup, FaKey } from "react-icons/fa";
import { useAppSelector } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mode } = useAppSelector((state) => state.theme);
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      href: "/admin/dashboard",
      roles: ["admin", "worker"],
    },
    {
      title: "Users",
      icon: <FaUsers />,
      href: "/admin/users",
      roles: ["admin"],
    },
    {
      title: "Settings",
      icon: <FaCogs />,
      href: "#",
      roles: ["admin"],
      isParent: true,
      toggle: () => setSettingsOpen(prev => !prev),
      open: settingsOpen,
      children: [
        {
          title: "Screens",
          icon: <FaLayerGroup />,
          href: "/admin/settings/screens",
        },
        {
          title: "Permissions",
          icon: <FaKey />,
          href: "/admin/settings/permissions",
        },
      ]
    }
  ];

  const visibleNavItems = role
    ? navItems.filter(item => item.roles.includes(role))
    : [];

  return (
    <div
      style={{
        ...styles.sidebar,
        width: sidebarCollapsed ? "70px" : "240px",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, rgb(15, 23, 42), rgb(3, 11, 34), rgb(51, 65, 85))"
            : "linear-gradient(135deg, #1e293b, #3b82f6, #f0f9ff)",
      }}
    >
      <div style={styles.header}>
        {!sidebarCollapsed && <h2 style={styles.logo}>Admin Panel</h2>}
      </div>
      <nav style={styles.nav}>
        {visibleNavItems.map((item) => {
          if (item.isParent) {
            return (
              <div key={item.title}>
                <div
                  onClick={item.toggle}
                  style={{
                    ...styles.link,
                    cursor: "pointer",
                    justifyContent: "space-between", 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={styles.icon}>{item.icon}</span>
                    {!sidebarCollapsed && item.title}
                  </div>
                  {!sidebarCollapsed && (
                    <span style={styles.arrowIcon}>
                      {item.open ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  )}
                </div>

                {!sidebarCollapsed && item.open && item.children && (
                  <div style={styles.subMenu}>
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          ...styles.childLink,
                          ...(pathname === child.href ? styles.activeLink : {})
                        }}
                      >
                        <span style={styles.icon}>{child.icon}</span>
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.link,
                ...(pathname === item.href ? styles.activeLink : {})
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {!sidebarCollapsed && item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: 'linear-gradient(135deg, #1e293b, #3b82f6, #f0f9ff)',
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "1rem 0",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "width 0.3s ease",
    overflow: "hidden",
  },
  header: {
    padding: "0 1.5rem",
    marginBottom: "2rem",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  arrowIcon: {
    marginLeft: "auto",
    fontSize: "0.8rem",
    color: "#cbd5e1",
  },
  
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    color: "#f1f5f9",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "background 0.2s ease",
  },
  activeLink: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    fontWeight: "bold",
  },
  icon: {
    marginRight: "0.75rem",
    fontSize: "1.1rem",
  },
  subMenu: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "2rem",
    gap: "0.3rem",
    marginTop: "0.3rem",
  },
  childLink: {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    color: "#e2e8f0",
    textDecoration: "none",
    fontSize: "0.95rem",
    borderRadius: "4px",
  },
};
