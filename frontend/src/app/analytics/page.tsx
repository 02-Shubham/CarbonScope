"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Target, ArrowUpRight, BarChart3, Activity } from "lucide-react";

const AnalyticsChart = dynamic(() => import("@/components/AnalyticsChart"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading chart…</div>
    </div>
  ),
});

const sectorData = [
  { name: "Energy",    value: 45, color: "var(--accent)" },
  { name: "Transport", value: 25, color: "var(--green)"  },
  { name: "Industry",  value: 18, color: "var(--amber)"  },
  { name: "Waste",     value: 12, color: "var(--red)"    },
];

const kpiCards = [
  { icon: <Activity size={18} color="var(--accent)" />, iconBg: "var(--accent-light)", label: "Current CO Index", value: "54.9", unit: "mg/m³", trend: "+2.1%" },
  { icon: <TrendingUp size={18} color="var(--green)" />, iconBg: "var(--green-light)",  label: "30-Day Forecast",  value: "↑ 6.3%", unit: "Projected", trend: "LSTM Model" },
  { icon: <Target size={18} color="var(--amber)" />,     iconBg: "var(--amber-light)",  label: "Model R²",         value: "0.41",  unit: "Accuracy",  trend: "vs Transformer 0.23" },
];

export default function Analytics() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--green)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Real-Time Data Active</span>
          </div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)" }}>
            Climate Insights
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.375rem", fontSize: "0.95rem" }}>
            AI-driven atmospheric analysis and 30-day predictive forecasting.
          </p>
        </motion.div>

        {/* ── KPI Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {kpiCards.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card"
              style={{ padding: "1.25rem 1.5rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                <div style={{ width: "2.25rem", height: "2.25rem", background: k.iconBg, borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {k.icon}
                </div>
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{k.label}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{k.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.375rem" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{k.unit}</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--green)", background: "var(--green-light)", padding: "0.1rem 0.4rem", borderRadius: "9999px" }}>{k.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main Layout: Chart + Sidebar ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem", alignItems: "start" }}>

          {/* Chart Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="card"
            style={{ padding: "1.75rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BarChart3 size={18} color="var(--accent)" />
                  CO Emission Index
                </h2>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Historical + 30-Day AI Projection
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.25rem", background: "var(--bg-subtle)", padding: "0.25rem", borderRadius: "0.5rem" }}>
                {["7D", "30D", "1Y"].map((t, i) => (
                  <button
                    key={t}
                    style={{
                      padding: "0.25rem 0.625rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.7rem", fontWeight: 700,
                      border: "none", cursor: "pointer",
                      background: i === 1 ? "var(--bg-card)" : "transparent",
                      color: i === 1 ? "var(--text-primary)" : "var(--text-muted)",
                      boxShadow: i === 1 ? "var(--shadow-sm)" : "none",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <AnalyticsChart />
          </motion.div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* AI Insight */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="card"
              style={{ padding: "1.25rem", background: "var(--accent-light)", borderColor: "#bfdbfe" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>AI Forecast</span>
                <Zap size={14} color="var(--accent)" />
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
                Northern India emission corridor shows a projected <strong style={{ color: "var(--accent)" }}>4.2% surge</strong> in particulate activity over the next 7 days.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Confidence</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>94.8%</span>
              </div>
            </motion.div>

            {/* Emissions by Source */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="card"
              style={{ padding: "1.25rem" }}
            >
              <h3 style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                Emissions by Source
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {sectorData.map((s) => (
                  <div key={s.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)" }}>{s.name}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}%</span>
                    </div>
                    <div className="progress-track">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Net Zero tracker */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="card"
              style={{ padding: "1.25rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <Target size={16} color="var(--green)" />
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Net Zero 2030</div>
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>12.5%</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--green)", marginTop: "0.25rem" }}>✓ On Track</div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}
