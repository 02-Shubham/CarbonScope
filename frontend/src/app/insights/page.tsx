"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Database, FlaskConical, GitBranch, Trophy } from "lucide-react";

const modelComparison = [
  { model: "LSTM",        mse: "0.000620", mae: "0.014442", r2: "0.4093", winner: true  },
  { model: "Transformer", mse: "0.000811", mae: "0.021940", r2: "0.2273", winner: false },
];

const references = [
  { num: 1, authors: "IPCC", title: "Climate Change Assessment Reports", journal: "IPCC, Geneva" },
  { num: 2, authors: "World Bank", title: "CO₂ Emissions Data", journal: "World Bank Open Data, 2024" },
  { num: 3, authors: "Rehman, M. Z.", title: "Forecasting CO₂ Emissions in India Using ARIMA", journal: "Processes, vol. 12, 2024" },
  { num: 4, authors: "Kumari, S. et al.", title: "Machine Learning–Based Time Series Models for Effective CO₂ Emission Prediction in India", journal: "Journal of Environmental Informatics, 2023" },
  { num: 5, authors: "Das, P. K. et al.", title: "Deep Learning Approaches for CO₂ Emission Forecasting over Indian Cities", journal: "Environmental Modelling & Software, 2023" },
  { num: 6, authors: "Lu, H. et al.", title: "TimeGAN-Based Carbon Emission Prediction", journal: "Journal of Cleaner Production, 2024" },
  { num: 7, authors: "Wu, B. et al.", title: "Interpretable CO₂ Forecasting Using Temporal Fusion Transformer", journal: "Applied Artificial Intelligence, 2024" },
];

const researchGaps = [
  { icon: <Database size={18} color="var(--accent)" />, bg: "var(--accent-light)", title: "No Real-Time Forecasting", desc: "Most existing models rely on static annual data. CarbonScope upgrades to daily granularity for actionable short-term predictions." },
  { icon: <GitBranch size={18} color="var(--green)" />, bg: "var(--green-light)", title: "Lack of Contextual Factors", desc: "We integrate CO, PM2.5, NO₂, and SO₂ as multi-signal proxies to capture real-world emission dynamics missed by single-feature models." },
  { icon: <FlaskConical size={18} color="var(--amber)" />, bg: "var(--amber-light)", title: "Scalability Issues", desc: "Our lightweight FastAPI + Keras architecture runs efficiently on CPU with no GPU requirement for Indian college/research environments." },
  { icon: <BookOpen size={18} color="var(--red)" />, bg: "var(--red-light)", title: "Limited Interpretability", desc: "We provide side-by-side model comparison metrics (MSE, MAE, R²) and visual forecast plots to support transparent academic evaluation." },
];

export default function Insights() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "5.5rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2.5rem" }}>
          <span className="badge badge-accent" style={{ marginBottom: "0.75rem" }}>
            <BookOpen size={10} /> Research Insights
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            Project Insights
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.375rem", fontSize: "0.95rem", lineHeight: 1.65 }}>
            Academic context, model benchmarks, and research gap analysis for the CarbonScope CO₂ Prediction Engine.
          </p>
        </motion.div>

        {/* Model Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: "1.75rem", marginBottom: "1.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Trophy size={18} color="var(--amber)" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Model Benchmark Results</h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.65 }}>
            Both models were evaluated on the last 10% of the 29,000-row Indian Cities Daily Emissions dataset (unseen test set).
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {["Model", "MSE ↓", "MAE ↓", "R² ↑", "Winner"].map(h => (
                    <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((m, i) => (
                  <tr key={m.model} style={{ background: i % 2 === 0 ? "var(--bg-subtle)" : "transparent", borderRadius: "0.5rem" }}>
                    <td style={{ padding: "0.75rem 0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{m.model}</td>
                    <td style={{ padding: "0.75rem 0.875rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>{m.mse}</td>
                    <td style={{ padding: "0.75rem 0.875rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>{m.mae}</td>
                    <td style={{ padding: "0.75rem 0.875rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>{m.r2}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>
                      {m.winner
                        ? <span className="badge badge-green">✓ Winner</span>
                        : <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "1rem", padding: "0.75rem", background: "var(--accent-light)", borderRadius: "0.5rem", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--accent)" }}>Conclusion:</strong> The LSTM model significantly outperformed the Transformer across all metrics on this daily time-series dataset. LSTM's gated memory architecture is better suited to step-by-step pollutant sequences than the Transformer's global attention mechanism, which typically needs much larger datasets.
          </p>
        </motion.section>

        {/* Research Gaps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>Research Gaps Addressed</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))", gap: "0.875rem" }}>
            {researchGaps.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="card"
                style={{ padding: "1.25rem" }}
              >
                <div style={{ width: "2.25rem", height: "2.25rem", background: g.bg, borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                  {g.icon}
                </div>
                <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem" }}>{g.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* References */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
          style={{ padding: "1.75rem" }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>References</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {references.map((r) => (
              <div key={r.num} style={{ display: "flex", gap: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)", width: "1.25rem", flexShrink: 0, paddingTop: "0.1rem" }}>[{r.num}]</span>
                <div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{r.authors}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}> — {r.title}. </span>
                  <span style={{ fontSize: "0.78rem", fontStyle: "italic", color: "var(--text-muted)" }}>{r.journal}.</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </main>
  );
}
