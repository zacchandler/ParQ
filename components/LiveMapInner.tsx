"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import { CAMPUS_CENTER, garages, openSpotsForGarage, statusForGarage, type Garage } from "@/lib/mockData";
import { useUserLocation } from "@/lib/geolocation";

interface Props {
  highlight?: string;
  zoom?: number;
  interactive?: boolean;
}

const statusColor: Record<string, string> = {
  plenty: "#1AAF6E",
  limited: "#E8A33D",
  full: "#E63946",
};

/**
 * Branded Leaflet map: CARTO Voyager tiles with a hue/saturation filter applied
 * via CSS in globals.css to harmonize with the purple palette.
 */
export function LiveMapInner({ highlight, zoom = 16, interactive = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const router = useRouter();
  const loc = useUserLocation();

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = L.map(ref.current, {
      center: CAMPUS_CENTER,
      zoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
    });
    mapRef.current = map;

    // CARTO basemaps — clean, free, no API key, looks great with our brand filter
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      opacity: 0.85,
      pane: "shadowPane",
    }).addTo(map);

    // Custom HTML markers
    const markerGroup: L.Marker[] = [];
    garages.forEach((g) => {
      const marker = L.marker([g.lat, g.lng], {
        icon: makePinIcon(g, highlight === g.id),
        riseOnHover: true,
      }).addTo(map);

      marker.on("click", () => {
        router.push(`/garage/${g.id}`);
      });
      markerGroup.push(marker);
    });

    // Fit map to all garage pins so every garage is visible at once
    if (markerGroup.length > 0) {
      const bounds = L.latLngBounds(markerGroup.map((m) => m.getLatLng()));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
    };
  }, [highlight, zoom, interactive, router]);

  // Place / move the "you are here" dot when geolocation resolves
  useEffect(() => {
    const map = mapRef.current;
    if (!map || loc.status !== "ready") return;

    const here = L.divIcon({
      className: "parq-marker",
      html: `
        <div style="position:relative;width:18px;height:18px;">
          <span style="position:absolute;inset:0;border-radius:9999px;background:#3B82F6;opacity:0.3;animation:pulse-ring 2s ease-out infinite;"></span>
          <span style="position:absolute;inset:4px;border-radius:9999px;background:#3B82F6;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span>
        </div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(loc.coords);
    } else {
      userMarkerRef.current = L.marker(loc.coords, { icon: here, interactive: false }).addTo(map);
    }
  }, [loc]);

  return (
    <div className="relative w-full h-full">
      <div ref={ref} className="w-full h-full rounded-2xl overflow-hidden" />
      {/* Top-right LIVE pill */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-soft" />
        <span className="text-[10px] font-bold text-[var(--color-ink-soft)] tracking-widest">LIVE</span>
      </div>
      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-1.5 rounded-full glass shadow-sm">
        <Dot color="#1AAF6E" label="Plenty" />
        <Dot color="#E8A33D" label="Limited" />
        <Dot color="#E63946" label="Full" />
      </div>
      {/* Decorative top-left "campus" tag */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass shadow-sm text-[10px] font-bold tracking-widest text-[var(--color-purple-700)]">
        CORAL GABLES
      </div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[9px] font-bold text-[var(--color-ink-soft)] tracking-wide">{label}</span>
    </span>
  );
}

function makePinIcon(g: Garage, highlighted: boolean): L.DivIcon {
  const status = statusForGarage(g);
  const color = statusColor[status];
  const open = openSpotsForGarage(g);
  const isFull = status === "full";
  const labelColor = highlighted ? "#fff" : "#100A1C";
  const labelBg = highlighted ? "#5E1FA8" : "rgba(255,255,255,0.96)";
  const labelText = isFull ? "Full" : `${open} spots`;

  const html = `
    <div style="position:relative;width:90px;display:flex;flex-direction:column;align-items:center;transform:translateY(-4px);">
      <div style="
        background:${labelBg};
        color:${labelColor};
        font-family:'Cabinet Grotesk', system-ui, sans-serif;
        font-weight:700;
        font-size:11px;
        letter-spacing:-0.01em;
        padding:3px 9px;
        border-radius:999px;
        border:1px solid rgba(0,0,0,0.06);
        box-shadow:0 2px 8px rgba(16,10,28,0.18);
        white-space:nowrap;
      ">
        <span style="font-weight:800;">${g.shortName}</span>
        <span style="opacity:0.55;font-weight:600;margin-left:5px;">${labelText}</span>
      </div>
      <svg width="28" height="36" viewBox="0 0 28 36" style="margin-top:2px;filter:drop-shadow(0 4px 6px rgba(16,10,28,0.32));">
        <defs>
          <linearGradient id="lg-${g.id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.78"/>
          </linearGradient>
        </defs>
        <path d="M14 0 C 6 0 1 5 1 12 C 1 22 14 36 14 36 C 14 36 27 22 27 12 C 27 5 22 0 14 0 Z" fill="url(#lg-${g.id})" stroke="white" stroke-width="2"/>
        <circle cx="14" cy="12" r="4.5" fill="white"/>
      </svg>
    </div>
  `;
  return L.divIcon({
    className: "parq-marker",
    html,
    iconSize: [90, 56],
    iconAnchor: [45, 52],
  });
}
