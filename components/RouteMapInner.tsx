"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Coord } from "@/lib/geolocation";
import { fetchRoute, formatDistance, formatDuration, type Route } from "@/lib/routing";
import { statusForGarage, openSpotsForGarage, type Garage } from "@/lib/mockData";

interface Props {
  user: Coord;
  garage: Garage;
}

const statusColor: Record<string, string> = {
  plenty: "#1AAF6E",
  limited: "#E8A33D",
  full: "#E63946",
};

export function RouteMapInner({ user, garage }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [routeError, setRouteError] = useState(false);

  // Fetch the driving route once we have both endpoints
  useEffect(() => {
    let cancelled = false;
    setRoute(null);
    setRouteError(false);
    fetchRoute(user, [garage.lat, garage.lng]).then((r) => {
      if (cancelled) return;
      if (!r) setRouteError(true);
      else setRoute(r);
    });
    return () => {
      cancelled = true;
    };
  }, [user, garage.lat, garage.lng]);

  // Initialize the map
  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = L.map(ref.current, {
      center: user,
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;

    L.control.zoom({ position: "topright" }).addTo(map);

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

    // User dot
    L.marker(user, { icon: makeUserIcon(), zIndexOffset: 1000 }).addTo(map);

    // Garage pin
    L.marker([garage.lat, garage.lng], {
      icon: makeGaragePin(garage),
      zIndexOffset: 999,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [user, garage]);

  // Draw the route once available
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route) return;

    // Convert OSRM [lng, lat] -> Leaflet [lat, lng]
    const latlngs: [number, number][] = route.coords.map(([lng, lat]) => [lat, lng]);

    // Glow / outer stroke
    const outer = L.polyline(latlngs, {
      color: "#1B0438",
      weight: 9,
      opacity: 0.18,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    // Main route line
    const inner = L.polyline(latlngs, {
      color: "#5E1FA8",
      weight: 5,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    // Fit bounds to the route with padding
    const bounds = inner.getBounds();
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });

    return () => {
      map.removeLayer(outer);
      map.removeLayer(inner);
    };
  }, [route]);

  return (
    <div className="relative w-full h-full">
      <div ref={ref} className="w-full h-full" />

      {/* Floating route status pill — top */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 px-3 py-1.5 rounded-full glass shadow-md">
        {!route && !routeError && (
          <>
            <span className="w-2 h-2 rounded-full bg-purple-500 pulse-soft" />
            <span className="text-[12px] font-semibold text-[var(--color-ink-soft)]">Calculating route…</span>
          </>
        )}
        {route && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-bold tracking-wide text-[var(--color-ink)]">
              <span className="num-mono">{formatDuration(route.durationS)}</span>
              <span className="opacity-50 mx-1.5">·</span>
              <span className="num-mono">{formatDistance(route.distanceM)}</span>
            </span>
          </>
        )}
        {routeError && (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[12px] font-semibold text-red-700">Route unavailable</span>
          </>
        )}
      </div>
    </div>
  );
}

function makeUserIcon(): L.DivIcon {
  return L.divIcon({
    className: "parq-marker",
    html: `
      <div style="position:relative;width:22px;height:22px;">
        <span style="position:absolute;inset:0;border-radius:9999px;background:#3B82F6;opacity:0.3;animation:pulse-ring 2s ease-out infinite;"></span>
        <span style="position:absolute;inset:5px;border-radius:9999px;background:#3B82F6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></span>
      </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function makeGaragePin(g: Garage): L.DivIcon {
  const status = statusForGarage(g);
  const color = statusColor[status];
  const open = openSpotsForGarage(g);
  const labelText = status === "full" ? "Full" : `${open} spots`;

  const html = `
    <div style="position:relative;width:140px;display:flex;flex-direction:column;align-items:center;transform:translateY(-4px);">
      <div style="
        background:#5E1FA8;color:#fff;
        font-family:'Cabinet Grotesk', system-ui, sans-serif;
        font-weight:800;font-size:12px;letter-spacing:-0.01em;
        padding:4px 10px;border-radius:999px;
        box-shadow:0 4px 14px rgba(94,31,168,0.4);
        white-space:nowrap;
      ">
        ${g.shortName} <span style="opacity:0.7;font-weight:600;margin-left:4px;">${labelText}</span>
      </div>
      <svg width="34" height="42" viewBox="0 0 28 36" style="margin-top:2px;filter:drop-shadow(0 5px 8px rgba(16,10,28,0.4));">
        <defs>
          <linearGradient id="dest-${g.id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.78"/>
          </linearGradient>
        </defs>
        <path d="M14 0 C 6 0 1 5 1 12 C 1 22 14 36 14 36 C 14 36 27 22 27 12 C 27 5 22 0 14 0 Z" fill="url(#dest-${g.id})" stroke="white" stroke-width="2"/>
        <circle cx="14" cy="12" r="4.5" fill="white"/>
      </svg>
    </div>
  `;
  return L.divIcon({
    className: "parq-marker",
    html,
    iconSize: [140, 60],
    iconAnchor: [70, 56],
  });
}
