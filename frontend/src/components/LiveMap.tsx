"use client";

import React, { useEffect, useRef, useState } from "react";

type MapNode = {
  city: string;
  latitude: number;
  longitude: number;
  pm25: number;
  status: "safe" | "warning" | "critical";
};

const FALLBACK_DATA: MapNode[] = [
  { city: "Delhi",      latitude: 28.6139, longitude: 77.2090, pm25: 145.2, status: "critical" },
  { city: "Mumbai",     latitude: 19.0760, longitude: 72.8777, pm25: 85.4,  status: "warning"  },
  { city: "Pune",       latitude: 18.5204, longitude: 73.8567, pm25: 54.1,  status: "warning"  },
  { city: "Bengaluru",  latitude: 12.9716, longitude: 77.5946, pm25: 38.2,  status: "safe"     },
  { city: "Chennai",    latitude: 13.0827, longitude: 80.2707, pm25: 42.1,  status: "safe"     },
  { city: "Kolkata",    latitude: 22.5726, longitude: 88.3639, pm25: 110.5, status: "critical" },
  { city: "Hyderabad",  latitude: 17.3850, longitude: 78.4867, pm25: 49.8,  status: "safe"     },
  { city: "Ahmedabad",  latitude: 23.0225, longitude: 72.5714, pm25: 92.0,  status: "warning"  },
];

const STATUS_COLORS = { safe: "#10b981", warning: "#f59e0b", critical: "#ef4444" };
const STATUS_BG    = { safe: "#d1fae5", warning: "#fef3c7", critical: "#fee2e2" };

export default function LiveMap() {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [isLive, setIsLive]     = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    let map: any = null;

    // Dynamic import so SSR is never hit
    import("leaflet").then((L) => {
      // If the div was already initialized by a previous StrictMode run, remove it first
      if ((mapRef.current as any)._leaflet_id) {
        (mapRef.current as any)._leaflet_id = null;
      }

      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current!, {
        center:    [22.5, 80.0],
        zoom:      5,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Positron — clean light tile layer (no API key needed)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 14 }
      ).addTo(map);

      const renderMarkers = (nodes: MapNode[]) => {
        nodes.forEach((node) => {
          const color = STATUS_COLORS[node.status];

          const icon = L.divIcon({
            className: "",
            html: `
              <div style="
                width: 18px; height: 18px; border-radius: 50%;
                background: ${color}; border: 3px solid white;
                box-shadow: 0 0 12px ${color}88;
                cursor: pointer;
              "></div>`,
            iconSize:   [18, 18],
            iconAnchor: [9, 9],
          });

          const marker = L.marker([node.latitude, node.longitude], { icon }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: system-ui; min-width: 130px; text-align:center; padding: 4px 0;">
              <div style="font-weight: 800; font-size: 14px; color: #0f172a;">${node.city}</div>
              <div style="font-size: 11px; color: #64748b; margin: 3px 0;">PM2.5 Air Quality</div>
              <div style="font-size: 22px; font-weight: 900; color: ${color}; margin-bottom: 4px;">${node.pm25}</div>
              <span style="
                background: ${STATUS_BG[node.status]}; color: ${color};
                font-size: 10px; font-weight: 700; padding: 2px 9px;
                border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;
              ">${node.status}</span>
            </div>
          `, { maxWidth: 180 });
        });
      };

      // Try live data, fall back gracefully
      fetch("http://127.0.0.1:8000/live-map", { signal: AbortSignal.timeout(4000) })
        .then((r) => r.json())
        .then((json) => {
          if (json.data?.length >= 3) {
            renderMarkers(json.data);
            setIsLive(true);
          } else {
            renderMarkers(FALLBACK_DATA);
          }
        })
        .catch(() => renderMarkers(FALLBACK_DATA));
    });

    // Load Leaflet CSS dynamically
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id    = "leaflet-css";
      link.rel   = "stylesheet";
      link.href  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Cleanup: destroy map so React StrictMode double-invoke doesn't crash
    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Overlay header */}
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        padding: "0.75rem 1.25rem", borderRadius: "0.875rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)", border: "1px solid #e2e8f0",
        pointerEvents: "none",
      }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#2563eb" }}>
          🌏 Live Emission Tracking
        </h2>
        <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#64748b" }}>
          Real-time PM2.5 across Indian cities · {isLive ? "🟢 Live OpenAQ" : "🟡 Demo data"}
        </p>
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        padding: "0.6rem 1rem", borderRadius: "0.75rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
        display: "flex", gap: "1rem",
      }}>
        {(["safe", "warning", "critical"] as const).map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLORS[s] }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#475569", textTransform: "capitalize" }}>{s}</span>
          </div>
        ))}
      </div>

      {/* The actual map */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
