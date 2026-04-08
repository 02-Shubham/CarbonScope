"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Wind, Droplets, AlertTriangle, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CityMapData } from "@/components/LiveMap";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Loading India Emission Map…</div>
      </div>
    </div>
  ),
});

const ALL_CITIES = [
  // North India
  "Delhi", "Gurugram", "Faridabad", "Chandigarh", "Amritsar", "Ludhiana",
  "Shimla", "Dehradun", "Srinagar", "Jammu", "Leh",
  // East India
  "Kolkata", "Patna", "Ranchi", "Bhubaneswar", "Guwahati", "Shillong",
  "Imphal", "Agartala", "Aizawl", "Kohima", "Itanagar", "Gangtok",
  // Central India
  "Lucknow", "Kanpur", "Agra", "Varanasi", "Bhopal", "Indore", "Nagpur", "Raipur",
  // West India
  "Mumbai", "Pune", "Surat", "Ahmedabad", "Rajkot", "Jaipur", "Jodhpur", "Udaipur", "Panaji",
  // South India
  "Bengaluru", "Chennai", "Hyderabad", "Kochi", "Thiruvananthapuram",
  "Visakhapatnam", "Vijayawada", "Madurai", "Coimbatore", "Mangaluru",
  // Islands
  "Port Blair", "Kavaratti",
];

const CITY_DETAILS: Record<string, { aqi: number; co: number; no2: number; advice: string; status: string; statusColor: string }> = {
  "Delhi":              { aqi: 312, co: 58.1, no2: 42.3, status: "Hazardous",  statusColor: "#7c3aed", advice: "Stay indoors. Use air purifiers. Avoid all outdoor activity." },
  "Gurugram":           { aqi: 198, co: 49.2, no2: 33.1, status: "Unhealthy",  statusColor: "#dc2626", advice: "Avoid prolonged outdoor activity. Wear N95 when outside." },
  "Faridabad":          { aqi: 210, co: 51.0, no2: 34.8, status: "Unhealthy",  statusColor: "#dc2626", advice: "Air quality is unhealthy. Limit time outdoors." },
  "Chandigarh":         { aqi: 172, co: 45.1, no2: 29.3, status: "Unhealthy",  statusColor: "#dc2626", advice: "Unhealthy air. Consider wearing a mask outdoors." },
  "Amritsar":           { aqi: 189, co: 47.8, no2: 31.2, status: "Unhealthy",  statusColor: "#dc2626", advice: "Limit outdoor time especially during peak hours." },
  "Ludhiana":           { aqi: 196, co: 48.9, no2: 32.5, status: "Unhealthy",  statusColor: "#dc2626", advice: "High industrial pollution. Mask recommended." },
  "Shimla":             { aqi: 38,  co: 18.2, no2:  6.1, status: "Good",       statusColor: "#059669", advice: "Excellent air quality. Enjoy outdoor activities freely." },
  "Dehradun":           { aqi: 95,  co: 32.4, no2: 15.8, status: "Moderate",   statusColor: "#d97706", advice: "Acceptable. Sensitive groups should monitor conditions." },
  "Srinagar":           { aqi: 68,  co: 26.1, no2:  9.8, status: "Moderate",   statusColor: "#d97706", advice: "Good air quality. Light outdoor activity is fine." },
  "Jammu":              { aqi: 112, co: 36.8, no2: 18.1, status: "Unhealthy",  statusColor: "#dc2626", advice: "Monitor conditions. Sensitive groups stay cautious." },
  "Leh":                { aqi: 22,  co: 10.1, no2:  3.4, status: "Good",       statusColor: "#059669", advice: "Very clean air. Perfect for outdoor activities." },
  "Kolkata":            { aqi: 214, co: 52.3, no2: 35.6, status: "Unhealthy",  statusColor: "#dc2626", advice: "Everyone may experience health effects. Avoid outdoor exercise." },
  "Patna":              { aqi: 289, co: 56.8, no2: 41.2, status: "Hazardous",  statusColor: "#7c3aed", advice: "Very dangerous air. Keep children and elderly strictly indoors." },
  "Ranchi":             { aqi: 145, co: 41.2, no2: 23.4, status: "Unhealthy",  statusColor: "#dc2626", advice: "Limit outdoor time. Watch for respiratory symptoms." },
  "Bhubaneswar":        { aqi: 98,  co: 33.6, no2: 16.4, status: "Moderate",   statusColor: "#d97706", advice: "Acceptable air quality. Moderate outdoor exertion OK." },
  "Guwahati":           { aqi: 122, co: 38.5, no2: 19.7, status: "Unhealthy",  statusColor: "#dc2626", advice: "Unhealthy for sensitive groups. Limit outdoor activity." },
  "Shillong":           { aqi: 42,  co: 19.8, no2:  7.2, status: "Good",       statusColor: "#059669", advice: "Fresh mountain air. Great for outdoor activities." },
  "Imphal":             { aqi: 55,  co: 22.3, no2:  8.9, status: "Moderate",   statusColor: "#d97706", advice: "Slightly elevated pollution. Generally comfortable." },
  "Agartala":           { aqi: 61,  co: 25.1, no2: 10.1, status: "Moderate",   statusColor: "#d97706", advice: "No special precautions needed." },
  "Aizawl":             { aqi: 34,  co: 16.4, no2:  5.8, status: "Good",       statusColor: "#059669", advice: "Clean air. Enjoy the outdoors!" },
  "Kohima":             { aqi: 30,  co: 14.8, no2:  5.2, status: "Good",       statusColor: "#059669", advice: "Very clean air. No concerns." },
  "Itanagar":           { aqi: 28,  co: 13.2, no2:  4.9, status: "Good",       statusColor: "#059669", advice: "Excellent air quality." },
  "Gangtok":            { aqi: 25,  co: 11.4, no2:  4.1, status: "Good",       statusColor: "#059669", advice: "Among the cleanest cities in India. Enjoy outdoor life." },
  "Lucknow":            { aqi: 276, co: 55.2, no2: 39.8, status: "Hazardous",  statusColor: "#7c3aed", advice: "Hazardous conditions. Avoid going outdoors if possible." },
  "Kanpur":             { aqi: 299, co: 57.5, no2: 41.8, status: "Hazardous",  statusColor: "#7c3aed", advice: "Extremely hazardous. Industrial and vehicular pollution severe." },
  "Agra":               { aqi: 248, co: 54.0, no2: 37.2, status: "Hazardous",  statusColor: "#7c3aed", advice: "Very unhealthy air. Stay indoors with windows closed." },
  "Varanasi":           { aqi: 263, co: 54.9, no2: 38.9, status: "Hazardous",  statusColor: "#7c3aed", advice: "Very high pollution. Avoid outdoor prayers and walks." },
  "Bhopal":             { aqi: 118, co: 37.5, no2: 18.8, status: "Unhealthy",  statusColor: "#dc2626", advice: "Monitor air quality. Limit strenuous outdoor activity." },
  "Indore":             { aqi: 132, co: 39.9, no2: 21.2, status: "Unhealthy",  statusColor: "#dc2626", advice: "Unhealthy for sensitive groups. Monitor daily." },
  "Nagpur":             { aqi: 127, co: 39.0, no2: 20.1, status: "Unhealthy",  statusColor: "#dc2626", advice: "Air quality is unhealthy for sensitive individuals." },
  "Raipur":             { aqi: 158, co: 43.2, no2: 25.8, status: "Unhealthy",  statusColor: "#dc2626", advice: "High coal-belt pollution. Minimize outdoor exposure." },
  "Mumbai":             { aqi: 168, co: 44.2, no2: 28.1, status: "Unhealthy",  statusColor: "#dc2626", advice: "Limit prolonged outdoor exertion. Wear N95 mask if going out." },
  "Pune":               { aqi: 121, co: 38.9, no2: 18.5, status: "Unhealthy",  statusColor: "#dc2626", advice: "Sensitive groups should avoid outdoor activity. Monitor daily." },
  "Surat":              { aqi: 141, co: 40.3, no2: 22.9, status: "Unhealthy",  statusColor: "#dc2626", advice: "Sensitive people should avoid prolonged outdoor exposure." },
  "Ahmedabad":          { aqi: 182, co: 47.0, no2: 30.2, status: "Unhealthy",  statusColor: "#dc2626", advice: "Limit outdoor time. Children and elderly should stay inside." },
  "Rajkot":             { aqi: 148, co: 41.6, no2: 24.1, status: "Unhealthy",  statusColor: "#dc2626", advice: "Elevated pollution. Wear mask during peak traffic." },
  "Jaipur":             { aqi: 154, co: 42.1, no2: 24.6, status: "Unhealthy",  statusColor: "#dc2626", advice: "Unhealthy for sensitive groups. Limit time outdoors." },
  "Jodhpur":            { aqi: 138, co: 40.0, no2: 22.2, status: "Unhealthy",  statusColor: "#dc2626", advice: "Dust-heavy air. Cover nose and mouth outdoors." },
  "Udaipur":            { aqi: 98,  co: 33.2, no2: 16.8, status: "Moderate",   statusColor: "#d97706", advice: "Moderate levels. Sensitive groups should stay cautious." },
  "Panaji":             { aqi: 52,  co: 22.0, no2:  9.1, status: "Moderate",   statusColor: "#d97706", advice: "Generally healthy. Coastal winds keep pollution low." },
  "Bengaluru":          { aqi: 84,  co: 30.1, no2: 12.4, status: "Moderate",   statusColor: "#d97706", advice: "Generally safe. Light outdoor activity is fine." },
  "Mangaluru":          { aqi: 48,  co: 20.8, no2:  8.2, status: "Good",       statusColor: "#059669", advice: "Coastal breeze keeps air clean. Enjoy outdoor activities." },
  "Hyderabad":          { aqi: 108, co: 35.7, no2: 17.1, status: "Moderate",   statusColor: "#d97706", advice: "Sensitive individuals should moderate activity." },
  "Visakhapatnam":      { aqi: 131, co: 39.5, no2: 21.8, status: "Unhealthy",  statusColor: "#dc2626", advice: "Port and industrial pollution elevated. Limit outdoor time." },
  "Vijayawada":         { aqi: 115, co: 37.1, no2: 18.9, status: "Unhealthy",  statusColor: "#dc2626", advice: "Moderate-high pollution. Sensitive groups avoid exertion." },
  "Chennai":            { aqi: 92,  co: 31.5, no2: 15.3, status: "Moderate",   statusColor: "#d97706", advice: "Acceptable. Monitor if you have asthma or heart conditions." },
  "Madurai":            { aqi: 88,  co: 30.8, no2: 14.2, status: "Moderate",   statusColor: "#d97706", advice: "Air is acceptable. No major health concerns for most people." },
  "Coimbatore":         { aqi: 79,  co: 29.2, no2: 12.9, status: "Moderate",   statusColor: "#d97706", advice: "Relatively clean for a metro. Light outdoor activities fine." },
  "Kochi":              { aqi: 62,  co: 27.4, no2: 10.2, status: "Moderate",   statusColor: "#d97706", advice: "Generally good air quality. Enjoy outdoor activities." },
  "Thiruvananthapuram": { aqi: 54,  co: 23.8, no2:  9.4, status: "Moderate",   statusColor: "#d97706", advice: "Air quality is good. No restrictions needed." },
  "Port Blair":         { aqi: 18,  co:  8.2, no2:  2.8, status: "Good",       statusColor: "#059669", advice: "Pristine island air. No restrictions at all." },
  "Kavaratti":          { aqi: 14,  co:  6.1, no2:  2.1, status: "Good",       statusColor: "#059669", advice: "Cleanest air in India. Enjoy island life!" },
};

export default function Home() {
  const [query, setQuery]               = useState("");
  const [suggestions, setSuggestions]   = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityMapData | null>(null);
  const [flyTo, setFlyTo]               = useState<string | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 1) { setSuggestions([]); return; }
    setSuggestions(ALL_CITIES.filter(c => c.toLowerCase().includes(q.toLowerCase())));
  };

  const handleCityPick = (cityName: string) => {
    setQuery(cityName);
    setSuggestions([]);
    setFlyTo(cityName);
    // Build a synthetic CityMapData to populate the panel
    const d = CITY_DETAILS[cityName];
    if (d) {
      setSelectedCity({
        city: cityName,
        latitude: 0, longitude: 0,
        pm25: d.aqi / 2.5, // approximate
        status: d.aqi > 200 ? "critical" : d.aqi > 100 ? "warning" : "safe",
      });
    }
  };

  const handleMapCitySelect = (node: CityMapData) => {
    setSelectedCity(node);
    setQuery(node.city);
    setSuggestions([]);
  };

  const details = selectedCity ? CITY_DETAILS[selectedCity.city] : null;

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <style>{`
        @media (max-width: 640px) {
          .home-search-bar { top: 5rem !important; }
          .home-city-panel { width: 100vw !important; border-left: none !important; }
          .home-bottom-widget { display: none !important; }
          .home-pro-tip { font-size: 0.65rem !important; }
        }
      `}</style>

      {/* ── Full-Screen Map ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <LiveMap onCitySelect={handleMapCitySelect} selectedCity={flyTo} />
      </div>

      {/* ── Floating Search Bar ── */}
      <div className="home-search-bar" style={{
        position: "absolute", top: "6rem", left: "50%", transform: "translateX(-50%)",
        zIndex: 100, width: "min(480px, calc(100vw - 2rem))",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
          border: "1px solid #e2e8f0", borderRadius: "1rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: "0.875rem 1rem",
          display: "flex", alignItems: "center", gap: "0.625rem",
        }}>
          <Search size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search any Indian city — Delhi, Pune, Kolkata…"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: "0.9rem", color: "#0f172a",
            }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setSuggestions([]); setSelectedCity(null); setFlyTo(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{
                marginTop: "0.375rem", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
                border: "1px solid #e2e8f0", borderRadius: "0.875rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)", overflow: "hidden",
              }}>
              {suggestions.slice(0, 6).map((city, i) => (
                <button key={city} onClick={() => handleCityPick(city)}
                  style={{
                    width: "100%", padding: "0.75rem 1rem", textAlign: "left",
                    background: "none", border: "none", borderBottom: i < suggestions.length - 1 ? "1px solid #f1f5f9" : "none",
                    cursor: "pointer", fontSize: "0.85rem", color: "#0f172a",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}>
                  <MapPin size={13} color="#2563eb" />
                  <span style={{ fontWeight: 500 }}>{city}</span>
                  <span style={{
                    marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem",
                    borderRadius: "9999px",
                    background: CITY_DETAILS[city]?.aqi > 200 ? "#ede9fe" : CITY_DETAILS[city]?.aqi > 100 ? "#fee2e2" : "#d1fae5",
                    color: CITY_DETAILS[city]?.aqi > 200 ? "#7c3aed" : CITY_DETAILS[city]?.aqi > 100 ? "#dc2626" : "#059669",
                  }}>
                    AQI {CITY_DETAILS[city]?.aqi ?? "—"}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pro tip when no city selected */}
        {!selectedCity && !query && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.9)", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            🗺️ Or click any glowing city node on the map below
          </motion.p>
        )}
      </div>

      {/* ── City Detail Panel (slides in from right) ── */}
      <AnimatePresence>
        {selectedCity && details && (
          <motion.div
            key={selectedCity.city}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="home-city-panel"
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0, zIndex: 200,
              width: "min(380px, 100vw)",
              background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
              borderLeft: "1px solid #e2e8f0",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
              display: "flex", flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Panel header */}
            <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <MapPin size={14} color="#2563eb" />
                  <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f172a" }}>{selectedCity.city}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, marginTop: "0.125rem" }}>Real-time emission data</div>
              </div>
              <button onClick={() => { setSelectedCity(null); setQuery(""); setFlyTo(null); }}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} color="#64748b" />
              </button>
            </div>

            {/* AQI Big Number */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Air Quality Index</div>
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: details.statusColor, letterSpacing: "-0.04em", lineHeight: 1 }}>{details.aqi}</div>
                </div>
                <div style={{
                  padding: "0.5rem 1rem", borderRadius: "0.75rem",
                  background: details.aqi > 200 ? "#ede9fe" : details.aqi > 100 ? "#fee2e2" : "#d1fae5",
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  {details.aqi > 100 ? <AlertTriangle size={20} color={details.statusColor} /> : <CheckCircle size={20} color="#059669" />}
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: details.statusColor, marginTop: "0.25rem" }}>{details.status}</span>
                </div>
              </div>

              {/* Health advice */}
              <div style={{ background: "#f8fafc", borderRadius: "0.625rem", padding: "0.75rem 0.875rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.3rem" }}>Health Advisory</div>
                <div style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6 }}>{details.advice}</div>
              </div>
            </div>

            {/* Pollutant grid */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.875rem" }}>Pollutant Levels</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
                {[
                  { label: "PM2.5", value: selectedCity.pm25.toFixed(1), unit: "µg/m³", icon: <Droplets size={14} color="#2563eb" /> },
                  { label: "CO",    value: details.co.toFixed(1),        unit: "mg/m³",  icon: <Wind size={14} color="#059669" />   },
                  { label: "NO₂",   value: details.no2.toFixed(1),       unit: "ppb",   icon: <Wind size={14} color="#d97706" />   },
                ].map(m => (
                  <div key={m.label} style={{ background: "#f8fafc", borderRadius: "0.625rem", padding: "0.75rem", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.3rem" }}>{m.icon}</div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>{m.value}</div>
                    <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{m.label}</div>
                    <div style={{ fontSize: "0.58rem", color: "#cbd5e1" }}>{m.unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Forecast teaser */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <TrendingUp size={16} color="#2563eb" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>AI 30-Day Forecast</span>
                <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: "#059669", background: "#d1fae5", padding: "0.125rem 0.5rem", borderRadius: "9999px" }}>LSTM Model</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6, marginBottom: "1rem" }}>
                Based on historical patterns, our LSTM deep learning model projects the next 30 days of CO emission levels for {selectedCity.city}.
              </p>
              <Link href={`/analytics?city=${selectedCity.city}`} style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem" }}>
                  View Full Forecast <ArrowRight size={15} />
                </button>
              </Link>
            </div>

            {/* Status explanations */}
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>AQI Scale Guide</div>
              {[
                { range: "0–50",   label: "Good",      color: "#059669" },
                { range: "51–100", label: "Moderate",  color: "#d97706" },
                { range: "101–200",label: "Unhealthy", color: "#dc2626" },
                { range: "201+",   label: "Hazardous", color: "#7c3aed" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", color: "#475569" }}><strong>{r.range}</strong> — {r.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CarbonScope title bottom-left ── */}
      {!selectedCity && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="home-bottom-widget"
          style={{
            position: "absolute", bottom: "3rem", left: "1.5rem", zIndex: 100,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
            padding: "0.875rem 1.25rem", borderRadius: "1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
            maxWidth: "260px",
          }}>
          <div style={{ fontWeight: 900, fontSize: "1rem", color: "#0f172a", marginBottom: "0.25rem" }}>🌿 CarbonScope</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
            India's AI-powered emission tracker. Search or click any city to see live air quality and 30-day forecast.
          </div>
        </motion.div>
      )}
    </div>
  );
}
