"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Lightbulb } from "lucide-react";

const links = [
  { href: "/",          label: "Explorer",  icon: Activity  },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/insights",  label: "Insights",  icon: Lightbulb },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="navbar"
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "calc(100% - 2rem)",
        maxWidth: "64rem",
        padding: "0.75rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
        <div style={{
          width: "2.25rem", height: "2.25rem",
          background: "var(--accent)",
          borderRadius: "0.5rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          flexShrink: 0,
        }}>
          <Activity size={16} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            CarbonScope
          </div>
          <div style={{ fontSize: "0.6rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            AI Dashboard
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.375rem 0.875rem",
                borderRadius: "0.5rem",
                fontSize: "0.78rem",
                fontWeight: active ? 600 : 500,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-light)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.375rem",
          fontSize: "0.7rem", fontWeight: 600, color: "var(--green)",
          background: "var(--green-light)",
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
        }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          Live
        </div>
        <div style={{
          width: "2rem", height: "2rem",
          borderRadius: "50%",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)",
        }}>
          G
        </div>
      </div>
    </nav>
  );
};
