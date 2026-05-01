"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Crosshair, Navigation2, MapPin, Building2 } from "lucide-react";
import { useUserLocation } from "@/lib/geolocation";
import { fetchRoute, formatDistance, formatDuration, type Route } from "@/lib/routing";
import { type Garage } from "@/lib/mockData";
import { RouteMap } from "@/components/RouteMap";

export function NavigateClient({ garage }: { garage: Garage }) {
  const loc = useUserLocation();
  const [route, setRoute] = useState<Route | null>(null);

  // Mirror the route fetch outside the map so the bottom-sheet shows ETA/distance
  useEffect(() => {
    if (loc.status !== "ready") return;
    let cancelled = false;
    fetchRoute(loc.coords, [garage.lat, garage.lng]).then((r) => {
      if (!cancelled) setRoute(r);
    });
    return () => {
      cancelled = true;
    };
  }, [loc, garage.lat, garage.lng]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[var(--color-bg)]">
      {/* Map fills the screen */}
      <div className="absolute inset-0">
        {loc.status === "ready" ? (
          <RouteMap user={loc.coords} garage={garage} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 animate-pulse" />
        )}
      </div>

      {/* Top app bar (over the map) */}
      <header className="absolute top-0 inset-x-0 z-[1090] safe-top">
        <div className="px-4 pt-3 pb-3 flex items-center gap-2">
          <Link
            href={`/garage/${garage.id}`}
            aria-label="Back"
            className="w-10 h-10 rounded-full glass shadow-md flex items-center justify-center hover:scale-105 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-ink)]" />
          </Link>
          <div className="flex-1" />
          <button
            aria-label="Recenter"
            className="w-10 h-10 rounded-full glass shadow-md flex items-center justify-center hover:scale-105 transition"
            onClick={() => window.location.reload()}
          >
            <Crosshair className="w-5 h-5 text-[var(--color-purple-600)]" />
          </button>
        </div>
        {loc.status === "ready" && loc.isFallback && (
          <div className="mx-4 px-3 py-2 rounded-xl glass text-[12px] font-semibold text-[var(--color-ink-soft)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Using campus center — enable location for live directions
          </div>
        )}
      </header>

      {/* Bottom sheet (over the map) */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
        className="absolute bottom-0 inset-x-0 z-[1090] safe-bottom"
      >
        <div className="mx-3 mb-3 rounded-[28px] bg-white shadow-[0_-10px_40px_-12px_rgba(94,31,168,0.35)] border border-[var(--color-line)] overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-2.5 pb-1.5">
            <span className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          <div className="px-5 pb-5">
            {/* Garage header */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[var(--color-purple-600)]" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-widest text-[var(--color-purple-700)]">
                  {garage.permitZone.toUpperCase()} ZONE · DESTINATION
                </p>
                <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight">
                  {garage.name}
                </h1>
                <p className="mt-0.5 text-[12px] text-[var(--color-mute)] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {garage.street}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat
                label="ETA"
                value={route ? formatDuration(route.durationS) : "—"}
                tint="purple"
              />
              <Stat
                label="DISTANCE"
                value={route ? formatDistance(route.distanceM) : "—"}
                tint="purple"
              />
              <Stat
                label="SPOTS"
                value={garage.displaySpots > 0 ? String(garage.displaySpots) : "Full"}
                tint={garage.displaySpots > 0 ? "coral" : "red"}
              />
            </div>

            {/* Start button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full h-14 rounded-2xl bg-[var(--color-purple-600)] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-[0_18px_40px_-14px_rgb(94_31_168_/_0.6)]"
              onClick={() => {
                // Demo: in production this would start turn-by-turn
                alert("Turn-by-turn navigation would begin here.");
              }}
            >
              <Navigation2 className="w-5 h-5" />
              Start Navigation
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: "purple" | "coral" | "red";
}) {
  const color =
    tint === "purple"
      ? "text-[var(--color-purple-700)]"
      : tint === "coral"
      ? "text-[var(--color-coral-600)]"
      : "text-red-600";
  return (
    <div className="rounded-xl bg-purple-50/50 border border-[var(--color-line)] px-3 py-2.5 text-center">
      <div className={`num-display text-[18px] leading-none ${color}`}>{value}</div>
      <div className="mt-1 text-[9px] font-bold tracking-widest text-[var(--color-mute)]">
        {label}
      </div>
    </div>
  );
}
