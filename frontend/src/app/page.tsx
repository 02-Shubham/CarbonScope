"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false, loading: () => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
    <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Loading map…</div>
  </div>
) });

const CITY_DATA: Record<string, { pm25: number; co: number; no2: number; aqi: number; status: "Good"|"Moderate"|"Unhealthy"|"Hazardous"; trend: string }> = {
  "Delhi":     { pm25: 145.2, co: 58.1, no2: 42.3, aqi: 312, status: "Hazardous",  trend: "↑ 8.2% this week"  },
  "Mumbai":    { pm25: 85.4,  co: 44.2, no2: 28.1, aqi: 168, status: "Unhealthy",  trend: "↓ 2.1% this week"  },
  "Pune":      { pm25: 54.1,  co: 38.9, no2: 18.5, aqi: 121, status: "Unhealthy",  trend: "→ Stable"          },
  "Bengaluru": { pm25: 38.2,  co: 30.1, no2: 12.4, aqi: 84,  status: "Moderate",   trend: "↓ 4.3% this week"  },
  "Chennai":   { pm25: 42.1,  co: 31.5, no2: 15.3, aqi: 92,  status: "Moderate",   trend: "↑ 1.2% this week"  },
  "Kolkata":   { pm25: 110.5, co: 52.3, no2: 35.6, aqi: 214, status: "Unhealthy",  trend: "↑ 5.7% this week"  },
  "Hyderabad": { pm25: 49.8,  co: 35.7, no2: 17.1, aqi: 108, status: "Moderate",   trend: "→ Stable"          },
  "Ahmedabad": { pm25: 92.0,  co: 47.0, no2: 30.2, aqi: 182, status: "Unhealthy",  trend: "↑ 3.8% this week"  },
};

const AQI_COLORS = {
  "Good":      { color: "#059669", bg: "#d1fae5", icon: <CheckCircle size={18} color="#059669" /> },
  "Moderate":  { color: "#d97706", bg: "#fef3c7", icon: <Wind size={18} color="#d97706" /> },
  "Unhealthy": { color: "#dc2626", bg: "#fee2e2", icon: <AlertTriangle size={18} color="#dc2626" /> },
  "Hazardous": { color: "#7c3aed", bg: "#ede9fe", icon: <AlertTriangle size={18} color="#7c3aed" /> },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    setSuggestions(Object.keys(CITY_DATA).filter(c => c.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  const cityInfo = selected ? CITY_DATA[selected] : null;
  const statusStyle = cityInfo ? AQI_COLORS[cityInfo.status] : null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Hero ── */}
      <section style={{ padding: "7rem 1.5rem 3rem", textAlign: "center", maxWidth: "52rem", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="badge badge-accent" style={{ marginBottom: "1.25rem" }}>
            <Activity size={10} /> Live Air Quality · India
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Check Your City's <span style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Air Quality</span> Right Now
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Real-time PM2.5, CO and NO₂ levels for major Indian cities, powered by AI-driven forecasting.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ position: "relative", maxWidth: "32rem", margin: "0 auto 2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "2px solid var(--border)", borderRadius: "0.875rem", padding: "0.75rem 1rem", boxShadow: "var(--shadow-md)", gap: "0.625rem" }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search your city — Delhi, Mumbai, Pune…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontSize: "0.9rem", color: "var(--text-primary)", background: "transparent" }}
            />
            {query && <button onClick={() => { setQuery(""); setSelected(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem" }}>✕</button>}
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "0.75rem", boxShadow: "var(--shadow-md)", zIndex: 100, overflow: "hidden" }}>
              {suggestions.map(city => (
                <button key={city} onClick={() => { setSelected(city); setQuery(city); setSuggestions([]); }}
                  style={{ width: "100%", padding: "0.75rem 1rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                  <MapPin size={14} color="var(--accent)" /> {city}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* City Result Card */}
        {cityInfo && statusStyle && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="card" style={{ padding: "1.75rem", maxWidth: "36rem", margin: "0 auto 2.5rem", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <MapPin size={14} color="var(--accent)" />
                  <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>{selected}</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{cityInfo.trend}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: statusStyle.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{cityInfo.aqi}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>AQI</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.875rem", background: statusStyle.bg, borderRadius: "0.625rem", marginBottom: "1.25rem" }}>
              {statusStyle.icon}
              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: statusStyle.color }}>{cityInfo.status}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: "0.25rem" }}>
                — {cityInfo.status === "Good" ? "Air quality is satisfactory." : cityInfo.status === "Moderate" ? "Sensitive groups should limit outdoor exposure." : cityInfo.status === "Unhealthy" ? "Everyone may experience health effects." : "Avoid outdoor activity completely."}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { label: "PM2.5", value: cityInfo.pm25, unit: "µg/m³", icon: <Droplets size={14} color="#2563eb" /> },
                { label: "CO",    value: cityInfo.co,   unit: "mg/m³",  icon: <Wind size={14} color="#059669" /> },
                { label: "NO₂",   value: cityInfo.no2,  unit: "ppb",   icon: <Thermometer size={14} color="#d97706" /> },
              ].map(m => (
                <div key={m.label} style={{ background: "var(--bg-subtle)", borderRadius: "0.625rem", padding: "0.875rem", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.375rem" }}>{m.icon}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{m.value}</div>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{m.label} · {m.unit}</div>
                </div>
              ))}
            </div>

            <Link href="/analytics" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                View 30-Day AI Forecast for {selected} <ArrowRight size={15} />
              </button>
            </Link>
          </motion.div>
        )}
      </section>

      {/* ── Live Map ── */}
      <section style={{ padding: "0 1.5rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>India Emission Heatmap</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Click any city marker to see live PM2.5 levels</p>
        </div>
        <div style={{ height: "560px", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
          <LiveMap />
        </div>
      </section>

    </main>
  );
}
