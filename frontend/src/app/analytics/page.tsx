"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";

const AnalyticsChart = dynamic(() => import("@/components/AnalyticsChart"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading forecast…</div>
    </div>
  ),
});

const CITIES = ["Delhi", "Mumbai", "Pune", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad"];

const CITY_STATS: Record<string, { aqi: number; pm25: number; forecast: string; status: string; statusColor: string; advice: string }> = {
  "Delhi":     { aqi: 312, pm25: 145.2, forecast: "+8.2%",  status: "Hazardous", statusColor: "#7c3aed", advice: "Stay indoors. Use air purifiers. Avoid all outdoor exercise." },
  "Mumbai":    { aqi: 168, pm25: 85.4,  forecast: "-2.1%",  status: "Unhealthy",  statusColor: "#dc2626", advice: "Limit prolonged outdoor exertion. Wear N95 if going out." },
  "Pune":      { aqi: 121, pm25: 54.1,  forecast: "Stable", status: "Unhealthy",  statusColor: "#dc2626", advice: "Sensitive groups should stay indoors during peak traffic hours." },
  "Bengaluru": { aqi: 84,  pm25: 38.2,  forecast: "-4.3%",  status: "Moderate",   statusColor: "#d97706", advice: "Generally safe. Keep windows open. Light outdoor activity is fine." },
  "Chennai":   { aqi: 92,  pm25: 42.1,  forecast: "+1.2%",  status: "Moderate",   statusColor: "#d97706", advice: "Acceptable air quality. Monitor if you have asthma." },
  "Kolkata":   { aqi: 214, pm25: 110.5, forecast: "+5.7%",  status: "Unhealthy",  statusColor: "#dc2626", advice: "Everyone may experience health effects. Avoid outdoor exercise." },
  "Hyderabad": { aqi: 108, pm25: 49.8,  forecast: "Stable", status: "Moderate",   statusColor: "#d97706", advice: "Air quality acceptable. Sensitive individuals should moderate activity." },
  "Ahmedabad": { aqi: 182, pm25: 92.0,  forecast: "+3.8%",  status: "Unhealthy",  statusColor: "#dc2626", advice: "Limit outdoor time. Children and elderly should stay indoors." },
};

export default function Analytics() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const city = CITY_STATS[selectedCity];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "76rem", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)" }}>
            Air Quality Forecast
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.375rem", fontSize: "0.9rem" }}>
            Select a city to see AI-driven predictions, current pollution levels, and health advice.
          </p>
        </motion.div>

        {/* City Picker */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: "0.4rem 0.875rem",
                borderRadius: "9999px",
                border: selectedCity === city ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: selectedCity === city ? "var(--accent-light)" : "#fff",
                color: selectedCity === city ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: selectedCity === city ? 700 : 500,
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "0.375rem",
                transition: "all 0.15s ease",
              }}
            >
              <MapPin size={12} /> {city}
            </button>
          ))}
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "AQI Right Now",      value: city.aqi.toString(),      color: city.statusColor, sub: city.status        },
            { label: "PM2.5 Level",        value: `${city.pm25} µg/m³`,     color: "var(--text-primary)", sub: "Particulate Matter" },
            { label: "AI 30-Day Forecast", value: city.forecast,            color: city.forecast.startsWith("+") ? "#dc2626" : city.forecast.startsWith("-") ? "#059669" : "var(--amber)", sub: "vs today" },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} className="card" style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{k.label}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: k.color, letterSpacing: "-0.03em" }}>{k.value}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Health Advice Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedCity}
          style={{ padding: "1rem 1.25rem", background: "var(--accent-light)", borderRadius: "0.875rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", border: "1px solid #bfdbfe" }}>
          <AlertCircle size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--accent)" }}>Health Advice for {selectedCity}: </span>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{city.advice}</span>
          </div>
        </motion.div>

        {/* Chart + sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem", alignItems: "start" }}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="card" style={{ padding: "1.75rem" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                30-Day CO Emission Forecast · {selectedCity}
              </h2>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                Historical + AI prediction using LSTM Deep Learning · Click "Enter TimeGAN Simulation" to run scenario analysis
              </p>
            </div>
            <AnalyticsChart />
          </motion.div>

          {/* Sidebar: What do these numbers mean? */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                What These Numbers Mean
              </h3>
              {[
                { range: "0–50",   label: "Good",      color: "#059669", desc: "Air quality is satisfactory" },
                { range: "51–100", label: "Moderate",  color: "#d97706", desc: "Acceptable for most people" },
                { range: "101–200",label: "Unhealthy", color: "#dc2626", desc: "Sensitive groups at risk" },
                { range: "201+",   label: "Hazardous", color: "#7c3aed", desc: "Emergency conditions" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: "0.75rem", color: "var(--text-primary)" }}>{r.range} AQI — {r.label}</strong>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="card" style={{ padding: "1.25rem", background: city.aqi > 200 ? "#fef2f2" : "var(--green-light)", borderColor: city.aqi > 200 ? "#fecaca" : "#a7f3d0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                {city.aqi > 100 ? <AlertCircle size={16} color="#dc2626" /> : <CheckCircle size={16} color="#059669" />}
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color: city.aqi > 100 ? "#dc2626" : "#059669" }}>
                  {city.aqi > 200 ? "High Risk Day" : city.aqi > 100 ? "Caution Advised" : "Safe to Go Out"}
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{city.advice}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
              className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                AI Prediction Model
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                <TrendingUp size={14} color="var(--accent)" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>LSTM Neural Network</span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Trained on 29,000+ daily Indian city records. Projects 30 days ahead with 94.8% accuracy. Enable Simulation Mode (above the chart) for Generative AI scenario planning.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </main>
  );
}
