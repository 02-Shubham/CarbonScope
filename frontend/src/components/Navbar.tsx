"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, HelpCircle, MapPin, Menu, X } from "lucide-react";

const links = [
  { href: "/",          label: "City Search",  icon: MapPin     },
  { href: "/analytics", label: "Forecast",     icon: BarChart3  },
  { href: "/insights",  label: "Learn",        icon: HelpCircle },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
          padding: "0.625rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{
            width: "2.1rem", height: "2.1rem",
            background: "var(--accent)",
            borderRadius: "0.5rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            flexShrink: 0,
          }}>
            <Activity size={15} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              CarbonScope
            </div>
            <div style={{ fontSize: "0.58rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              AI Dashboard
            </div>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <div className="navbar-desktop-links" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
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

        {/* Right side — desktop */}
        <div className="navbar-desktop-right" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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

        {/* Mobile hamburger button */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            width: "2.25rem", height: "2.25rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="navbar-mobile-menu"
          style={{
            position: "fixed",
            top: "4.5rem",
            left: "1rem",
            right: "1rem",
            zIndex: 49,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(16px)",
            borderRadius: "1rem",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.88rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--accent)" : "var(--text-primary)",
                  background: active ? "var(--accent-light)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.12s ease",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          {/* Live badge in mobile menu */}
          <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--green)" }}>Live Data Active</span>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-desktop-right { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
        @media (min-width: 641px) {
          .navbar-hamburger { display: none !important; }
          .navbar-mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
};
