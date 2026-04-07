"use client";

import React, { useEffect, useRef, useState } from "react";

export type CityMapData = {
  city: string;
  latitude: number;
  longitude: number;
  pm25: number;
  status: "safe" | "warning" | "critical";
};

interface Props {
  onCitySelect?: (city: CityMapData) => void;
  selectedCity?: string | null;
}

const FALLBACK_DATA: CityMapData[] = [
  { city: "Delhi",      latitude: 28.6139, longitude: 77.2090, pm25: 145.2, status: "critical" },
  { city: "Mumbai",     latitude: 19.0760, longitude: 72.8777, pm25: 85.4,  status: "warning"  },
  { city: "Pune",       latitude: 18.5204, longitude: 73.8567, pm25: 54.1,  status: "warning"  },
  { city: "Bengaluru",  latitude: 12.9716, longitude: 77.5946, pm25: 38.2,  status: "safe"     },
  { city: "Chennai",    latitude: 13.0827, longitude: 80.2707, pm25: 42.1,  status: "safe"     },
  { city: "Kolkata",    latitude: 22.5726, longitude: 88.3639, pm25: 110.5, status: "critical" },
  { city: "Hyderabad",  latitude: 17.3850, longitude: 78.4867, pm25: 49.8,  status: "safe"     },
  { city: "Ahmedabad",  latitude: 23.0225, longitude: 72.5714, pm25: 92.0,  status: "warning"  },
  { city: "Lucknow",    latitude: 26.8467, longitude: 80.9462, pm25: 128.4, status: "critical" },
  { city: "Patna",      latitude: 25.5941, longitude: 85.1376, pm25: 135.7, status: "critical" },
  { city: "Jaipur",     latitude: 26.9124, longitude: 75.7873, pm25: 78.3,  status: "warning"  },
  { city: "Surat",      latitude: 21.1702, longitude: 72.8311, pm25: 72.1,  status: "warning"  },
  { city: "Nagpur",     latitude: 21.1458, longitude: 79.0882, pm25: 61.4,  status: "warning"  },
  { city: "Bhopal",     latitude: 23.2599, longitude: 77.4126, pm25: 55.8,  status: "warning"  },
  { city: "Chandigarh", latitude: 30.7333, longitude: 76.7794, pm25: 88.2,  status: "warning"  },
  { city: "Kochi",      latitude: 9.9312,  longitude: 76.2673, pm25: 29.4,  status: "safe"     },
];

const STATUS_COLORS = { safe: "#10b981", warning: "#f59e0b", critical: "#ef4444" };
const STATUS_BG     = { safe: "#d1fae5", warning: "#fef3c7", critical: "#fee2e2" };

export default function LiveMap({ onCitySelect, selectedCity }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<CityMapData[]>([]);
  const [isLive, setIsLive]   = useState(false);
  const mapObjRef = useRef<any>(null);

  // Load Leaflet CSS once
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id   = "leaflet-css";
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // Fetch map data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/live-map", { signal: AbortSignal.timeout(4000) });
        const json = await res.json();
        if (json.data?.length >= 3) { setMapData(json.data); setIsLive(true); return; }
      } catch {}
      setMapData(FALLBACK_DATA);
    };
    load();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !mapData.length) return;

    let map: any = null;
    const circles: any[] = [];

    import("leaflet").then((L) => {
      if ((mapRef.current as any)?._leaflet_id) {
        (mapRef.current as any)._leaflet_id = null;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      map = L.map(mapRef.current!, {
        center:    [22.5, 80.0],
        zoom:      5,
        zoomControl: true,
        attributionControl: false,
      });

      mapObjRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 14 }).addTo(map);

      mapData.forEach((node) => {
        const color = STATUS_COLORS[node.status];
        const radius = Math.max(25000, node.pm25 * 800); // heatmap radius based on pm25

        // Outer glow circle (heatmap feel)
        const glowCircle = L.circle([node.latitude, node.longitude], {
          radius,
          color:       color,
          fillColor:   color,
          fillOpacity: 0.12,
          weight:      0,
        }).addTo(map);

        // Inner dot marker
        const dotIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:${color};border:3px solid white;
            box-shadow:0 0 10px ${color}99;cursor:pointer;
          "></div>`,
          iconSize:   [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([node.latitude, node.longitude], { icon: dotIcon }).addTo(map);

        const popupHtml = `
          <div style="font-family:system-ui;min-width:140px;text-align:center;padding:4px 0">
            <div style="font-weight:800;font-size:14px;color:#0f172a">${node.city}</div>
            <div style="font-size:11px;color:#64748b;margin:3px 0">PM2.5 Level</div>
            <div style="font-size:24px;font-weight:900;color:${color};margin:2px 0">${node.pm25}</div>
            <span style="background:${STATUS_BG[node.status]};color:${color};font-size:10px;font-weight:700;padding:2px 10px;border-radius:9999px;text-transform:uppercase">${node.status}</span>
            <div style="margin-top:8px;font-size:11px;color:#2563eb;font-weight:600;cursor:pointer">Click for AI Forecast →</div>
          </div>`;

        marker.bindPopup(popupHtml, { maxWidth: 200 });

        marker.on("click", () => {
          if (onCitySelect) onCitySelect(node);
        });

        circles.push(glowCircle, marker);
      });
    });

    return () => {
      if (map) { map.remove(); map = null; mapObjRef.current = null; }
    };
  }, [mapData]);

  // Fly to selected city when search changes
  useEffect(() => {
    if (!selectedCity || !mapObjRef.current || !mapData.length) return;
    const node = mapData.find(c => c.city.toLowerCase() === selectedCity.toLowerCase());
    if (node) {
      mapObjRef.current.flyTo([node.latitude, node.longitude], 9, { duration: 1.2 });
    }
  }, [selectedCity, mapData]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Live badge */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        padding: "0.4rem 0.875rem", borderRadius: "9999px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: "0.4rem",
        fontSize: "0.7rem", fontWeight: 700, color: isLive ? "#059669" : "#d97706",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: isLive ? "#059669" : "#d97706", display: "inline-block" }} />
        {isLive ? "Live OpenAQ Data" : "Demo Data"}
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 16, right: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        padding: "0.5rem 0.875rem", borderRadius: "0.75rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
        display: "flex", gap: "0.875rem",
      }}>
        {(["safe", "warning", "critical"] as const).map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_COLORS[s] }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#475569", textTransform: "capitalize" }}>{s}</span>
          </div>
        ))}
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
