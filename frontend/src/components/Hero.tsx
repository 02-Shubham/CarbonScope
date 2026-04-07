"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Cpu, ShieldCheck, TrendingUp, Wind, Zap } from "lucide-react";

const stats = [
  { label: "Cities Tracked", value: "2,000+", sub: "Across India", color: "var(--accent)" },
  { label: "Daily Predictions", value: "30-day", sub: "LSTM Forecast",  color: "var(--green)"  },
  { label: "Model Accuracy",  value: "94.8%",  sub: "R² on test set", color: "var(--amber)"  },
];

const features = [
  {
    icon: <Cpu size={22} color="var(--accent)" />,
    iconBg: "var(--accent-light)",
    title: "LSTM Deep Learning",
    desc: "State-of-the-art Long Short-Term Memory networks trained on 29,000+ daily Indian city air quality records.",
  },
  {
    icon: <TrendingUp size={22} color="var(--green)" />,
    iconBg: "var(--green-light)",
    title: "30-Day Forecasting",
    desc: "Auto-regressive prediction engine that extends future emission curves one step at a time for actionable insights.",
  },
  {
    icon: <Wind size={22} color="var(--amber)" />,
    iconBg: "var(--amber-light)",
    title: "Multi-Pollutant Signals",
    desc: "CO, PM2.5, NO₂ and SO₂ used as composite high-frequency proxies to capture real-world emission dynamics.",
  },
  {
    icon: <Zap size={22} color="var(--red)" />,
    iconBg: "var(--red-light)",
    title: "FastAPI Backend",
    desc: "Real-time REST endpoints power the prediction engine — connect any frontend or tool to live AI forecasts.",
  },
];

export const Hero = () => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Hero Section ── */}
      <section style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "8rem 1.5rem 5rem",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="badge badge-accent"
          style={{ marginBottom: "1.5rem" }}
        >
          <Zap size={10} />
          AI-Powered CO₂ Emission Engine · India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            marginBottom: "1.25rem",
            maxWidth: "52rem",
          }}
        >
          Predict India's Carbon
          <span style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline",
          }}> Emissions </span>
          with Deep Learning.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: "38rem",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          CarbonScope uses LSTM and Transformer models trained on real Indian city pollution data to project
          daily CO emissions 30 days into the future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href="/analytics" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart3 size={16} />
              View Analytics
              <ArrowRight size={15} />
            </button>
          </Link>
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn-secondary">API Docs →</button>
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            marginTop: "3.5rem",
            display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center",
          }}
        >
          {["NASA Data", "UNFCCC", "IPCC Aligned"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
              <ShieldCheck size={13} color="var(--green)" />
              {t}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ padding: "0 1.5rem 4rem", maxWidth: "64rem", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem" }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="card"
              style={{ padding: "1.5rem 1.75rem" }}
            >
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: "0 1.5rem 6rem", maxWidth: "64rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            How It Works
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.95rem" }}>
            From raw city data to accurate 30-day forecasts.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "1rem" }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card card-hover"
              style={{ padding: "1.75rem" }}
            >
              <div style={{
                width: "2.75rem", height: "2.75rem",
                background: f.iconBg,
                borderRadius: "0.625rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1rem",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
