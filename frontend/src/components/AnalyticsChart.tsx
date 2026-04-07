"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

type DataPoint = { name: string; current?: number; predicted?: number };

const HISTORICAL_SEED = [
  { name: "Day -7", current: 52.3 },
  { name: "Day -6", current: 54.1 },
  { name: "Day -5", current: 51.8 },
  { name: "Day -4", current: 55.6 },
  { name: "Day -3", current: 53.2 },
  { name: "Day -2", current: 56.8 },
  { name: "Day -1", current: 54.9 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "0.625rem",
      padding: "0.75rem 1rem",
      boxShadow: "var(--shadow-md)",
      fontSize: "0.78rem",
    }}>
      <div style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.375rem" }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(3) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsChart() {
  const [data, setData] = useState<DataPoint[]>(HISTORICAL_SEED);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/predict?days=30", { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const json = await res.json();

        if (json.prediction_co_index && Array.isArray(json.prediction_co_index)) {
          const aiPreds: number[] = json.prediction_co_index;
          const combined: DataPoint[] = [...HISTORICAL_SEED];
          aiPreds.forEach((val, idx) => {
            combined.push({ name: `Day +${idx + 1}`, predicted: val });
          });
          setData(combined);
          setModelUsed(json.model_used || "LSTM");
        } else {
          throw new Error("Unexpected API response shape");
        }
      } catch (err: any) {
        setError("Backend offline — start with: uvicorn main:app --reload");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
        <div style={{
          width: "2rem", height: "2rem",
          border: "3px solid var(--accent-light)",
          borderTop: "3px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Fetching AI predictions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem",
        background: "var(--amber-light)", borderRadius: "0.75rem", padding: "2rem", textAlign: "center",
      }}>
        <div style={{ fontSize: "1.5rem" }}>⚡</div>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--amber)" }}>Backend Offline</p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", maxWidth: "20rem", lineHeight: 1.6 }}>{error}</p>
        <div style={{
          background: "#1e293b", borderRadius: "0.5rem", padding: "0.5rem 1rem",
          fontSize: "0.7rem", fontFamily: "monospace", color: "#94a3b8", marginTop: "0.25rem",
        }}>
          cd be && uvicorn main:app --reload
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {modelUsed && (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-accent">Model: {modelUsed}</span>
          <span className="badge badge-green">Live API</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--green)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 500 }}
            tickLine={false} axisLine={false}
            minTickGap={30}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)", fontWeight: 500 }}
            tickLine={false} axisLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="current"
            name="Historical"
            stroke="var(--accent)"
            strokeWidth={2.5}
            fill="url(#gradCurrent)"
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent)" }}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            name="AI Forecast"
            stroke="var(--green)"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            fill="url(#gradPredicted)"
            dot={false}
            activeDot={{ r: 4, fill: "var(--green)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
