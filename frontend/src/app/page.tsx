"use client";

import React from "react";
import { Hero } from "@/components/Hero";
import LiveMap from "@/components/LiveMap";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Hero />
      <div style={{ height: "600px", width: "100%", padding: "0 2rem 2rem 2rem", margin: "0 auto", maxWidth: "1400px" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <LiveMap />
        </div>
      </div>
    </main>
  );
}
