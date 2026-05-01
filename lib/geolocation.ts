"use client";

import { useEffect, useState } from "react";
import { CAMPUS_CENTER } from "./mockData";

export type Coord = [number, number]; // [lat, lng]

export type LocationState =
  | { status: "idle" }
  | { status: "requesting" }
  | { status: "ready"; coords: Coord; accuracy: number; isFallback: boolean }
  | { status: "denied"; reason: string };

/**
 * React hook that requests the browser's geolocation.
 * - Returns a Coord ready for use with Leaflet.
 * - Falls back to UM campus center if the user denies/times out, so the demo
 *   never breaks. The fallback is flagged via `isFallback: true` for UI.
 */
export function useUserLocation(opts?: { fallback?: Coord; timeoutMs?: number }) {
  const fallback = opts?.fallback ?? CAMPUS_CENTER;
  const timeoutMs = opts?.timeoutMs ?? 8000;
  const [state, setState] = useState<LocationState>({ status: "idle" });

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState({ status: "ready", coords: fallback, accuracy: 0, isFallback: true });
      return;
    }
    setState({ status: "requesting" });

    const timer = setTimeout(() => {
      setState((prev) => {
        if (prev.status === "requesting") {
          return { status: "ready", coords: fallback, accuracy: 0, isFallback: true };
        }
        return prev;
      });
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        setState({
          status: "ready",
          coords: [pos.coords.latitude, pos.coords.longitude],
          accuracy: pos.coords.accuracy,
          isFallback: false,
        });
      },
      (err) => {
        clearTimeout(timer);
        setState({
          status: "ready",
          coords: fallback,
          accuracy: 0,
          isFallback: true,
        });
        // Best-effort: keep the error available if we want to surface it
        console.info("[ParQ] geolocation fallback:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: timeoutMs }
    );

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
