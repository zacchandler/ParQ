"use client";

import type { Coord } from "./geolocation";

export interface Route {
  /** Polyline as [lat, lng] pairs (Leaflet-friendly order) */
  coords: [number, number][];
  /** Driving distance in meters */
  distanceM: number;
  /** Estimated driving duration in seconds */
  durationS: number;
  /** Where the route came from — useful for "approximate" UI badges */
  source: "valhalla" | "osrm" | "straight-line";
}

/**
 * Fetch a real driving route between two points.
 * Tries Valhalla first (FOSSGIS-hosted, reliable), then OSRM (sometimes flaky),
 * then falls back to a straight-line approximation so the demo never breaks.
 */
export async function fetchRoute(from: Coord, to: Coord): Promise<Route | null> {
  const v = await fetchValhalla(from, to).catch(() => null);
  if (v) return v;
  const o = await fetchOsrm(from, to).catch(() => null);
  if (o) return o;
  return straightLineRoute(from, to);
}

/* ─────────── Valhalla (primary) ─────────── */

async function fetchValhalla(from: Coord, to: Coord): Promise<Route | null> {
  const body = {
    locations: [
      { lat: from[0], lon: from[1] },
      { lat: to[0], lon: to[1] },
    ],
    costing: "auto",
    directions_options: { units: "kilometers" },
  };
  const res = await fetchWithTimeout("https://valhalla1.openstreetmap.de/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const trip = data?.trip;
  if (!trip?.legs?.length) return null;

  // Concatenate all leg shapes
  const coords: [number, number][] = [];
  for (const leg of trip.legs) {
    if (typeof leg.shape === "string") {
      coords.push(...decodeValhallaPolyline(leg.shape));
    }
  }
  if (coords.length < 2) return null;

  return {
    coords,
    distanceM: (trip.summary?.length ?? 0) * 1000, // km → m
    durationS: trip.summary?.time ?? 0,
    source: "valhalla",
  };
}

/* ─────────── OSRM (fallback) ─────────── */

async function fetchOsrm(from: Coord, to: Coord): Promise<Route | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=false`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return null;
  const text = await res.text();
  if (!text.trim().startsWith("{")) return null; // 502 Bad Gateway HTML
  const data = JSON.parse(text);
  const route = data?.routes?.[0];
  if (!route) return null;
  return {
    coords: (route.geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng]),
    distanceM: route.distance,
    durationS: route.duration,
    source: "osrm",
  };
}

/* ─────────── Straight-line fallback ─────────── */

function straightLineRoute(from: Coord, to: Coord): Route {
  // Make a gentle 30-segment arc so it doesn't look like a brutal bisecting line
  const segments = 30;
  const coords: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // simple lerp; could add a slight curve via control point if desired
    const lat = from[0] + (to[0] - from[0]) * t;
    const lng = from[1] + (to[1] - from[1]) * t;
    coords.push([lat, lng]);
  }
  const distanceM = haversineMeters(from, to);
  // Average city driving 30 km/h ≈ 8.33 m/s
  const durationS = distanceM / 8.33;
  return { coords, distanceM, durationS, source: "straight-line" };
}

function haversineMeters(a: Coord, b: Coord): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ─────────── Polyline decoder for Valhalla (precision 6) ─────────── */

function decodeValhallaPolyline(str: string, precision = 6): [number, number][] {
  const factor = Math.pow(10, precision);
  let lat = 0,
    lng = 0,
    idx = 0;
  const result: [number, number][] = [];
  while (idx < str.length) {
    let shift = 0,
      r = 0,
      byte;
    do {
      byte = str.charCodeAt(idx++) - 63;
      r |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += r & 1 ? ~(r >> 1) : r >> 1;

    shift = 0;
    r = 0;
    do {
      byte = str.charCodeAt(idx++) - 63;
      r |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += r & 1 ? ~(r >> 1) : r >> 1;

    result.push([lat / factor, lng / factor]);
  }
  return result;
}

/* ─────────── Utilities ─────────── */

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = 6000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remM = minutes % 60;
  return `${hours}h ${remM}m`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  const miles = meters / 1609.344;
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi`;
}
