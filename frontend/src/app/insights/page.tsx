"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Award, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is AQI and why does it matter?",
    a: "AQI stands for Air Quality Index. It is a number from 0 to 500 that tells you how clean or polluted the air is. An AQI below 50 is Good — you can safely go outside. Above 200 is Very Unhealthy, and above 300 is Hazardous, meaning you should stay indoors and avoid all physical activity outdoors.",
  },
  {
    q: "What is PM2.5 and why is it dangerous?",
    a: "PM2.5 refers to tiny particles in the air that are smaller than 2.5 micrometers — about 30 times smaller than a human hair. These particles are so small they can bypass your nose and throat and go directly into your lungs and bloodstream, causing heart disease, lung cancer, and respiratory problems over time.",
  },
  {
    q: "How does the AI predict future emissions?",
    a: "CarbonScope uses an LSTM (Long Short-Term Memory) Neural Network — the same technology used in weather forecasting. It has learned patterns from 29,000+ days of daily emission records from Indian cities. By recognizing repeating seasonal, weekly, and event-driven patterns, it can project what CO levels are likely to look like 30 days from now.",
  },
  {
    q: "What is the TimeGAN Simulation Mode?",
    a: "TimeGAN is a Generative AI model (similar to how image generators like Midjourney work, but for time-series data). Instead of predicting one single future, it generates hundreds of possible futures based on your adjusted inputs — like what would emissions look like if we reduced traffic by 20%? It shows you the best-case and worst-case boundaries on the chart.",
  },
  {
    q: "What is CO and why is it tracked?",
    a: "Carbon Monoxide (CO) is a colorless, odorless gas produced by fossil fuel combustion — vehicles, factories, and power plants. While less visible than smoke, high CO concentrations are a strong proxy for total carbon emissions and cause headaches, dizziness, and in extreme cases, are fatal. It is used as the primary tracking signal by our AI models.",
  },
  {
    q: "What is the difference between LSTM, GRU, and Transformer?",
    a: "All three are deep learning models for processing sequences of data over time. LSTM and GRU are recurrent networks that process data step-by-step, making them great at learning daily emission patterns. The Transformer uses attention mechanisms to look at all time steps at once — better for very long sequences. In our tests on Indian city data, LSTM outperformed all others.",
  },
];

const models = [
  { name: "LSTM",        fullName: "Long Short-Term Memory",              score: 94.8, mse: "0.000620", mae: "0.0144", r2: "0.409", winner: true,  plain: "Best performer. Learns what happened over the past 30 days to predict what comes next. Like a person who remembers seasonal patterns to forecast next month's air quality." },
  { name: "GRU",         fullName: "Gated Recurrent Unit",                score: 91.2, mse: "0.000720", mae: "0.0171", r2: "0.371", winner: false, plain: "Simpler and faster than LSTM. Learns shorter-term patterns efficiently. Great for quick updates when live data changes." },
  { name: "TimeGAN",     fullName: "Time-Series Generative Adversarial Network", score: null, mse: "N/A", mae: "N/A", r2: "N/A", winner: false, plain: "Does not predict one future — it imagines hundreds. Like a climate scientist running thousands of simulations to define a 'range of possibilities'. Powers the Scenario Simulation feature." },
  { name: "Transformer", fullName: "Temporal Fusion Transformer",         score: 82.7, mse: "0.000811", mae: "0.0219", r2: "0.227", winner: false, plain: "Originally designed for language translation. Applies 'attention' to all past days simultaneously. Works better with massive global datasets than daily Indian city data." },
];

export default function Insights() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "5.5rem", paddingBottom: "5rem" }}>
      <style>{`
        @media (max-width: 640px) {
          .insights-h1 { font-size: 1.5rem !important; }
          .insights-tips-grid { grid-template-columns: 1fr !important; }
          .insights-stats-row { flex-wrap: wrap; gap: 0.5rem !important; }
        }
      `}</style>
      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2.5rem" }}>
          <span className="badge badge-accent" style={{ marginBottom: "0.75rem" }}>
            <BookOpen size={10} /> Learn More
          </span>
          <h1 className="insights-h1" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            Understanding Air Quality & AI
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: 1.65 }}>
            Plain-English explanations of what the numbers mean, how the AI works, and what you can do about air pollution.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <HelpCircle size={18} color="var(--accent)" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: "0", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "1rem 1.25rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-primary)" }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    style={{ padding: "0 1.25rem 1rem", fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.7, borderTop: "1px solid var(--border)" }}>
                    <div style={{ paddingTop: "0.75rem" }}>{faq.a}</div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Model Comparison — Plain English */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Award size={18} color="var(--amber)" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>AI Model Comparison</h2>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.65 }}>
            CarbonScope tested 4 different AI models on 29,000 days of real Indian city air quality data. Here's how they compared and what each one does.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {models.map((m) => (
              <div key={m.name} style={{
                padding: "1.125rem", borderRadius: "0.75rem",
                background: m.winner ? "var(--accent-light)" : "var(--bg-subtle)",
                border: m.winner ? "1px solid #bfdbfe" : "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>{m.name}</span>
                      {m.winner && <span className="badge badge-green">✓ Best Model</span>}
                      {m.name === "TimeGAN" && <span className="badge badge-accent">Generative AI</span>}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{m.fullName}</div>
                  </div>
                  {m.score && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: m.winner ? "var(--accent)" : "var(--text-primary)", letterSpacing: "-0.03em" }}>{m.score}%</div>
                      <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Accuracy</div>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.625rem" }}>{m.plain}</p>
                {m.score && (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {[{ label: "MSE", val: m.mse }, { label: "MAE", val: m.mae }, { label: "R²", val: m.r2 }].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* What can I do section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
            What Can I Do to Help?
          </h2>
          <div className="insights-tips-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "0.875rem" }}>
            {[
              { emoji: "🚶", title: "Use public transport", desc: "Transport is responsible for 25% of urban emissions. Even one fewer car trip per week makes a measurable difference." },
              { emoji: "🌱", title: "Plant trees locally", desc: "A single mature tree absorbs 22 kg of CO₂ per year. Urban tree cover directly reduces city-level AQI scores." },
              { emoji: "💡", title: "Switch to LEDs", desc: "LED bulbs use 75% less energy than traditional bulbs. Less energy demand = fewer fossil fuels burned at power plants." },
              { emoji: "📊", title: "Monitor & report", desc: "Check air quality before going out. Share alerts with elderly neighbors. Awareness is the first step to action." },
            ].map(tip => (
              <div key={tip.title} style={{ padding: "1rem", background: "var(--bg-subtle)", borderRadius: "0.75rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{tip.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}>{tip.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </main>
  );
}
