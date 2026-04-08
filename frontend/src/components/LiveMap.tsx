"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type CityMapData = {
  city: string;
  latitude: number;
  longitude: number;
  pm25: number;
  co?: number | null;
  no2?: number | null;
  status: "safe" | "warning" | "critical";
  source?: "live" | "fallback";
};

interface Props {
  onCitySelect?: (city: CityMapData) => void;
  selectedCity?: string | null;
}

// 50+ cities, one per state/UT covering all of India
const FALLBACK_DATA: CityMapData[] = [
  // North India
  { city: "Delhi",              latitude: 28.6139, longitude: 77.2090, pm25: 145.2, status: "critical" },
  { city: "Gurugram",           latitude: 28.4595, longitude: 77.0266, pm25: 92.1,  status: "critical" },
  { city: "Faridabad",          latitude: 28.4089, longitude: 77.3178, pm25: 98.4,  status: "critical" },
  { city: "Chandigarh",         latitude: 30.7333, longitude: 76.7794, pm25: 80.2,  status: "warning" },
  { city: "Amritsar",           latitude: 31.6340, longitude: 74.8723, pm25: 87.5,  status: "warning" },
  { city: "Ludhiana",           latitude: 30.9010, longitude: 75.8573, pm25: 91.0,  status: "critical" },
  { city: "Shimla",             latitude: 31.1048, longitude: 77.1734, pm25: 14.8,  status: "safe" },
  { city: "Dehradun",           latitude: 30.3165, longitude: 78.0322, pm25: 38.2,  status: "safe" },
  { city: "Srinagar",           latitude: 34.0837, longitude: 74.7973, pm25: 26.4,  status: "safe" },
  { city: "Jammu",              latitude: 32.7357, longitude: 74.8692, pm25: 45.1,  status: "warning" },
  { city: "Leh",                latitude: 34.1526, longitude: 77.5771, pm25: 8.8,   status: "safe" },
  // East India
  { city: "Kolkata",            latitude: 22.5726, longitude: 88.3639, pm25: 110.5, status: "critical" },
  { city: "Patna",              latitude: 25.5941, longitude: 85.1376, pm25: 135.7, status: "critical" },
  { city: "Ranchi",             latitude: 23.3441, longitude: 85.3096, pm25: 67.2,  status: "warning" },
  { city: "Bhubaneswar",        latitude: 20.2961, longitude: 85.8245, pm25: 39.8,  status: "safe" },
  { city: "Guwahati",           latitude: 26.1445, longitude: 91.7362, pm25: 57.3,  status: "warning" },
  { city: "Shillong",           latitude: 25.5788, longitude: 91.8933, pm25: 16.4,  status: "safe" },
  { city: "Imphal",             latitude: 24.8170, longitude: 93.9368, pm25: 22.1,  status: "safe" },
  { city: "Agartala",           latitude: 23.8315, longitude: 91.2868, pm25: 24.5,  status: "safe" },
  { city: "Aizawl",             latitude: 23.7307, longitude: 92.7173, pm25: 13.4,  status: "safe" },
  { city: "Kohima",             latitude: 25.6751, longitude: 94.1086, pm25: 11.8,  status: "safe" },
  { city: "Itanagar",           latitude: 27.0844, longitude: 93.6053, pm25: 10.9,  status: "safe" },
  { city: "Gangtok",            latitude: 27.3314, longitude: 88.6138, pm25: 9.8,   status: "safe" },
  // Central / UP
  { city: "Lucknow",            latitude: 26.8467, longitude: 80.9462, pm25: 128.4, status: "critical" },
  { city: "Kanpur",             latitude: 26.4499, longitude: 80.3319, pm25: 138.2, status: "critical" },
  { city: "Agra",               latitude: 27.1767, longitude: 78.0081, pm25: 114.6, status: "critical" },
  { city: "Varanasi",           latitude: 25.3176, longitude: 82.9739, pm25: 122.1, status: "critical" },
  { city: "Bhopal",             latitude: 23.2599, longitude: 77.4126, pm25: 55.8,  status: "warning" },
  { city: "Indore",             latitude: 22.7196, longitude: 75.8577, pm25: 62.1,  status: "warning" },
  { city: "Nagpur",             latitude: 21.1458, longitude: 79.0882, pm25: 61.4,  status: "warning" },
  { city: "Raipur",             latitude: 21.2514, longitude: 81.6296, pm25: 73.2,  status: "warning" },
  // West India
  { city: "Mumbai",             latitude: 19.0760, longitude: 72.8777, pm25: 85.4,  status: "warning" },
  { city: "Pune",               latitude: 18.5204, longitude: 73.8567, pm25: 54.1,  status: "warning" },
  { city: "Surat",              latitude: 21.1702, longitude: 72.8311, pm25: 72.1,  status: "warning" },
  { city: "Ahmedabad",          latitude: 23.0225, longitude: 72.5714, pm25: 92.0,  status: "critical" },
  { city: "Rajkot",             latitude: 22.3039, longitude: 70.8022, pm25: 68.4,  status: "warning" },
  { city: "Jaipur",             latitude: 26.9124, longitude: 75.7873, pm25: 78.3,  status: "warning" },
  { city: "Jodhpur",            latitude: 26.2389, longitude: 73.0243, pm25: 63.5,  status: "warning" },
  { city: "Udaipur",            latitude: 24.5854, longitude: 73.7125, pm25: 39.4,  status: "safe" },
  { city: "Panaji",             latitude: 15.4909, longitude: 73.8278, pm25: 20.8,  status: "safe" },
  // South India
  { city: "Bengaluru",          latitude: 12.9716, longitude: 77.5946, pm25: 38.2,  status: "safe" },
  { city: "Mangaluru",          latitude: 12.9141, longitude: 74.8560, pm25: 19.2,  status: "safe" },
  { city: "Hyderabad",          latitude: 17.3850, longitude: 78.4867, pm25: 49.8,  status: "safe" },
  { city: "Visakhapatnam",      latitude: 17.6868, longitude: 83.2185, pm25: 61.8,  status: "warning" },
  { city: "Vijayawada",         latitude: 16.5062, longitude: 80.6480, pm25: 53.4,  status: "warning" },
  { city: "Chennai",            latitude: 13.0827, longitude: 80.2707, pm25: 42.1,  status: "safe" },
  { city: "Madurai",            latitude:  9.9252, longitude: 78.1198, pm25: 35.2,  status: "safe" },
  { city: "Coimbatore",         latitude: 11.0168, longitude: 76.9558, pm25: 31.8,  status: "safe" },
  { city: "Kochi",              latitude:  9.9312, longitude: 76.2673, pm25: 25.4,  status: "safe" },
  { city: "Thiruvananthapuram", latitude:  8.5241, longitude: 76.9366, pm25: 21.6,  status: "safe" },
  // Islands
  { city: "Port Blair",         latitude: 11.7401, longitude: 92.6586, pm25: 7.2,   status: "safe" },
  { city: "Kavaratti",          latitude: 10.5669, longitude: 72.6420, pm25: 5.6,   status: "safe" },
];

const STATUS_COLORS = { safe: "#10b981", warning: "#f59e0b", critical: "#ef4444" };
const STATUS_BG     = { safe: "#d1fae5", warning: "#fef3c7", critical: "#fee2e2" };

export default function LiveMap({ onCitySelect, selectedCity }: Props) {
  const mapRef    = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<any>(null);
  const [mapData, setMapData] = useState<CityMapData[]>([]);
  const [isLive, setIsLive]   = useState(false);

  // Fetch map data from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("http://127.0.0.1:8000/live-map", { signal: AbortSignal.timeout(4000) });
        const json = await res.json();
        if (json.data?.length >= 3) {
          setMapData(json.data);
          setIsLive(json.live_count > 0);
          return;
        }
      } catch {}
      setMapData(FALLBACK_DATA);
    };
    load();
  }, []);

  // Build heatwave map
  useEffect(() => {
    if (!mapRef.current || !mapData.length) return;

    if ((mapRef.current as any)?._leaflet_id) {
      (mapRef.current as any)._leaflet_id = null;
    }

    delete (L.Icon.Default.prototype as any)._getIconUrl;

    const map = L.map(mapRef.current!, {
      center:       [22.5, 80.5],
      zoom:          5,
      zoomControl:   true,
      attributionControl: false,
      preferCanvas: true,        // faster rendering for many layers
    });

    mapObjRef.current = map;

    // Light map tile
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 14,
    }).addTo(map);

    mapData.forEach((node: CityMapData) => {
      const color  = STATUS_COLORS[node.status];
      const radius = Math.max(25000, node.pm25 * 800);

      // Single glow circle sized by PM2.5
      L.circle([node.latitude, node.longitude], {
        radius,
        color,
        fillColor:   color,
        fillOpacity: 0.12,
        weight:      0,
      }).addTo(map);

      // White-bordered dot marker
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

      // Rich popup showing all pollutants
      const popupHtml = `
        <div style="font-family:system-ui;min-width:170px;text-align:center;padding:4px 0">
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:4px">
            <div style="font-weight:800;font-size:14px;color:#0f172a">${node.city}</div>
            <span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:9999px;
              background:${node.source === 'live' ? '#d1fae5' : '#f1f5f9'};
              color:${node.source === 'live' ? '#059669' : '#94a3b8'}">
              ${node.source === 'live' ? '● LIVE' : 'DEMO'}
            </span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:6px 0">
            <div style="background:#f8fafc;border-radius:6px;padding:4px 2px">
              <div style="font-size:13px;font-weight:900;color:${color}">${node.pm25 != null ? node.pm25.toFixed(1) : '—'}</div>
              <div style="font-size:9px;font-weight:700;color:#94a3b8">PM2.5</div>
              <div style="font-size:8px;color:#cbd5e1">µg/m³</div>
            </div>
            <div style="background:#f8fafc;border-radius:6px;padding:4px 2px">
              <div style="font-size:13px;font-weight:900;color:#059669">${node.co != null ? node.co.toFixed(1) : '—'}</div>
              <div style="font-size:9px;font-weight:700;color:#94a3b8">CO</div>
              <div style="font-size:8px;color:#cbd5e1">mg/m³</div>
            </div>
            <div style="background:#f8fafc;border-radius:6px;padding:4px 2px">
              <div style="font-size:13px;font-weight:900;color:#d97706">${node.no2 != null ? node.no2.toFixed(1) : '—'}</div>
              <div style="font-size:9px;font-weight:700;color:#94a3b8">NO₂</div>
              <div style="font-size:8px;color:#cbd5e1">ppb</div>
            </div>
          </div>
          <span style="background:${STATUS_BG[node.status]};color:${color};font-size:10px;font-weight:700;padding:2px 10px;border-radius:9999px;text-transform:uppercase">${node.status}</span>
          <div style="margin-top:8px;font-size:11px;color:#2563eb;font-weight:600;cursor:pointer">Click for AI Forecast →</div>
        </div>`;

      marker.bindPopup(popupHtml, { maxWidth: 220 });
      marker.on("click", () => { if (onCitySelect) onCitySelect(node); });
    });

    return () => {
      map.remove();
      mapObjRef.current = null;
    };
  }, [mapData]);

  // Fly to city on search
  useEffect(() => {
    if (!selectedCity || !mapObjRef.current || !mapData.length) return;
    const node = mapData.find(c => c.city.toLowerCase() === selectedCity.toLowerCase());
    if (node) mapObjRef.current.flyTo([node.latitude, node.longitude], 9, { duration: 1.2 });
  }, [selectedCity, mapData]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Data source badge */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        padding: "0.4rem 0.875rem", borderRadius: "9999px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", gap: "0.4rem",
        fontSize: "0.7rem", fontWeight: 700,
        color: isLive ? "#059669" : "#d97706",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: isLive ? "#059669" : "#d97706", display: "inline-block",
        }} />
        {isLive ? "Live OpenAQ Data" : "Demo Data · 50+ Cities"}
      </div>

      {/* AQI legend */}
      <div style={{
        position: "absolute", bottom: 16, right: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        padding: "0.5rem 0.875rem", borderRadius: "0.75rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
        display: "flex", flexDirection: "column", gap: "4px",
      }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>
          Air Quality
        </div>
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
