"use client";

import type { Coord } from "./geolocation";

export interface Route {
  /** GeoJSON LineString coordinates as [lng, lat] pairs (OSRM convention) */
  coords: [number, number][];
  /** Driving distance in meters */
  distanceM: number;
  /** Estimated driving duration in seconds */
  durationS: number;
}

/**
 * Fetch a real driving route between two points using the public OSRM demo server.
 * Returns a polyline that follows actual streets — same shape Google/Apple Maps uses.
 *
 * Free, CORS-enabled, no API key. Acceptable for demo / low traffic.
 * https://project-osrm.org/docs/v5.24.0/api/#general-options
 */
export async function fetchRoute(from: Coord, to: Coord): Promise<Route | null> {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson&steps=false`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;
    return {
      coords: route.geometry.coordinates as [number, number][],
      distanceM: route.distance,
      durationS: route.duration,
    };
  } catch (e) {
    console.warn("[ParQ] OSRM route fetch failed:", e);
    return null;
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
