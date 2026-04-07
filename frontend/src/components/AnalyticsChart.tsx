"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

type DataPoint = { name: string; current?: number; predicted?: number; best_case?: number; worst_case?: number };

const DEMO_PREDICTIONS = [53.1,54.2,55.8,54.6,56.9,58.1,57.3,59.0,60.2,59.4,61.0,62.3,61.8,63.2,64.5,63.9,65.1,66.4,65.7,67.0,68.2,67.5,69.0,70.1,69.4,71.0,72.3,71.6,73.0,74.2];

const HISTORICAL_SEED: DataPoint[] = [
  { name: "Day -7", current: 48.3 },
  { name: "Day -6", current: 50.1 },
  { name: "Day -5", current: 49.8 },
  { name: "Day -4", current: 51.6 },
  { name: "Day -3", current: 50.2 },
  { name: "Day -2", current: 52.8 },
  { name: "Day -1", current: 53.1 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "0.625rem", padding: "0.75rem 1rem",
      boxShadow: "var(--shadow-md)", fontSize: "0.78rem",
    }}>
      <div style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.375rem" }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [modelUsed, setModelUsed] = useState<string>("");
  
  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState(false);
  const [energyFactor, setEnergyFactor] = useState(1.0);
  const [transportFactor, setTransportFactor] = useState(1.0);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        if (!isSimulating) {
            // Standard Forecast
            const res = await fetch("http://127.0.0.1:8000/predict?days=30", { signal: AbortSignal.timeout(5000) });
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            const json = await res.json();
            
            if (json.prediction_co_index) {
                const combined: DataPoint[] = [...HISTORICAL_SEED];
                json.prediction_co_index.forEach((val: number, idx: number) => {
                    combined.push({ name: `Day +${idx + 1}`, predicted: val });
                });
                setData(combined);
                setModelUsed(json.model_used || "LSTM");
            } else { throw new Error("Unexpected API shape"); }
        } else {
            // Generative AI Simulation using TimeGAN
            const url = `http://127.0.0.1:8000/simulate?energy_factor=${energyFactor}&transport_factor=${transportFactor}`;
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            const json = await res.json();
            
            if (json.best_case && json.worst_case) {
                const combined: DataPoint[] = [...HISTORICAL_SEED];
                json.worst_case.forEach((val: number, idx: number) => {
                    combined.push({ 
                        name: `Day +${idx + 1}`, 
                        worst_case: val,
                        best_case: json.best_case[idx]
                    });
                });
                setData(combined);
                setModelUsed(json.model_used || "TimeGAN");
            } else { throw new Error("Unexpected API shape"); }
        }
        setIsDemo(false);
      } catch {
        // Fallback demo data
        const fallback: DataPoint[] = [...HISTORICAL_SEED];
        DEMO_PREDICTIONS.forEach((val, idx) => {
          if (isSimulating) {
              // Fake simulated bounds
              fallback.push({ name: `Day +${idx + 1}`, worst_case: val + 2.5, best_case: val * energyFactor });
          } else {
              fallback.push({ name: `Day +${idx + 1}`, predicted: val });
          }
        });
        setData(fallback);
        setModelUsed("Demo (Backend Offline)");
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };

    // Debounce fast slider changes
    const timer = setTimeout(() => {
        fetchPredictions();
    }, 500);
    return () => clearTimeout(timer);
  }, [isSimulating, energyFactor, transportFactor]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Top Banner and Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {modelUsed && (
              <span className={isSimulating ? "badge badge-accent" : "badge"} style={{ background: isSimulating ? "#8b5cf6" : "var(--accent-light)", color: isSimulating ? "#fff" : "var(--accent)" }}>
                Model: {modelUsed}
              </span>
            )}
            {isDemo ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem", fontWeight: 600, color: "var(--amber)", background: "var(--amber-light)", padding: "0.2rem 0.65rem", borderRadius: "9999px" }}>
                ⚡ Demo mode (Backend offline)
              </span>
            ) : modelUsed && (
              <span className="badge badge-green">✓ Live AI</span>
            )}
            
            <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className="btn-secondary"
                style={{ padding: "0.25rem 0.75rem", fontSize: "0.65rem", borderRadius: "9999px" }}
            >
                {isSimulating ? "Exit Simulation" : "Enter TimeGAN Simulation"}
            </button>
          </div>

          {/* Sliders shown only when simulating */}
          {isSimulating && (
              <div style={{ display: "flex", gap: "1rem", background: "var(--bg-subtle)", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                          Energy Usage ({Math.round(energyFactor * 100)}%)
                      </label>
                      <input 
                          type="range" min="0.5" max="1.5" step="0.1" 
                          value={energyFactor} onChange={(e) => setEnergyFactor(parseFloat(e.target.value))} 
                          style={{ width: "80px", accentColor: "#8b5cf6" }} 
                      />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                          Transport ({Math.round(transportFactor * 100)}%)
                      </label>
                      <input 
                          type="range" min="0.5" max="1.5" step="0.1" 
                          value={transportFactor} onChange={(e) => setTransportFactor(parseFloat(e.target.value))} 
                          style={{ width: "80px", accentColor: "#8b5cf6" }} 
                      />
                  </div>
              </div>
          )}
      </div>

      <div style={{ position: "relative" }}>
          {loading && (
             <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
                 <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
             </div>
          )}
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSimBest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSimWorst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.10} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 500 }} tickLine={false} axisLine={false} minTickGap={30} dy={8} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 500 }} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>{value}</span>} />
              
              <Area type="monotone" dataKey="current" name="Historical" stroke="var(--accent)" strokeWidth={2.5} fill="url(#gradCurrent)" dot={false} activeDot={{ r: 4, fill: "var(--accent)" }} />
              
              {!isSimulating && (
                  <Area type="monotone" dataKey="predicted" name="AI Forecast (LSTM)" stroke="var(--green)" strokeWidth={2.5} strokeDasharray="6 4" fill="url(#gradSimBest)" dot={false} />
              )}
              
              {isSimulating && (
                  <>
                    <Area type="monotone" dataKey="worst_case" name="Worst Case Limit" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" fill="url(#gradSimWorst)" dot={false} />
                    <Area type="monotone" dataKey="best_case" name="Best Case Limit" stroke="#10b981" strokeWidth={2.5} strokeDasharray="4 4" fill="url(#gradSimBest)" dot={false} />
                  </>
              )}
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}
