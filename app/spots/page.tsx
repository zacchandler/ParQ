"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMemo } from "react";
import { ChevronRight, MapPin, Navigation2, Filter } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { LiveMap } from "@/components/LiveMap";
import { currentUser, garages, openSpotsForGarage, statusForGarage, type Garage } from "@/lib/mockData";
import { useUserLocation } from "@/lib/geolocation";

const statusBadge: Record<string, { color: string; bg: string; label: string }> = {
  plenty: { color: "#0F8C57", bg: "#D7F3E5", label: "Open" },
  limited: { color: "#B97800", bg: "#FFE6C2", label: "Filling" },
  full: { color: "#B91C1C", bg: "#FFE0E0", label: "Full" },
};

export default function SpotsPage() {
  const loc = useUserLocation();
  const userPermit = currentUser.permit.replace(" Zone", ""); // "Pink Zone" -> "Pink"

  // Garages the user can park in based on their permit.
  // Pink Zone permit can park in Pink + Visitor garages (typical UM rule).
  const accessibleGarages = useMemo(
    () => garages.filter((g) => g.permitZone === userPermit || g.permitZone === "Visitor"),
    [userPermit]
  );

  // Garages they can't park in — shown below in a muted "Other lots" group
  const otherGarages = useMemo(
    () => garages.filter((g) => g.permitZone !== userPermit && g.permitZone !== "Visitor"),
    [userPermit]
  );

  const userCoord: [number, number] | null = loc.status === "ready" ? loc.coords : null;

  return (
    <div className="min-h-dvh pb-28 bg-[var(--color-bg)]">
      <AppHeader showBack />

      <main className="px-5 pt-4 space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[12px] font-semibold tracking-widest text-[var(--color-mute)] uppercase">
            Available Now
          </p>
          <h1 className="mt-1 font-display text-[36px] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Find a<br />
            <span className="font-serif italic font-normal text-[var(--color-purple-600)]">spot</span>
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[12px] font-bold tracking-wide text-[var(--color-purple-700)]">
            <Filter className="w-3.5 h-3.5" />
            Showing {currentUser.permit} access
          </div>
        </motion.section>

        {/* Mini map */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-[var(--color-line)] shadow-[var(--shadow-soft)]"
        >
          <LiveMap interactive />
        </motion.div>

        {/* Eligible garages list */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <h2 className="font-display text-[20px] font-extrabold tracking-tight mb-3">
            Your <span className="font-serif italic font-normal text-[var(--color-purple-600)]">eligible</span> garages
            <span className="ml-2 text-[12px] font-semibold text-[var(--color-mute)] tracking-wide">
              ({accessibleGarages.length})
            </span>
          </h2>
          <ul className="space-y-3">
            {accessibleGarages.map((g, i) => (
              <GarageRow key={g.id} garage={g} index={i} userCoord={userCoord} eligible />
            ))}
          </ul>
        </motion.section>

        {/* Other lots (locked-out, dimmed) */}
        {otherGarages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
          >
            <h2 className="font-display text-[20px] font-extrabold tracking-tight mb-3">
              Other <span className="font-serif italic font-normal text-[var(--color-purple-600)]">lots</span>
              <span className="ml-2 text-[12px] font-semibold text-[var(--color-mute)] tracking-wide">
                Different permit required
              </span>
            </h2>
            <ul className="space-y-3">
              {otherGarages.map((g, i) => (
                <GarageRow key={g.id} garage={g} index={i + accessibleGarages.length} userCoord={userCoord} eligible={false} />
              ))}
            </ul>
          </motion.section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function GarageRow({
  garage,
  index,
  userCoord,
  eligible,
}: {
  garage: Garage;
  index: number;
  userCoord: [number, number] | null;
  eligible: boolean;
}) {
  const status = statusForGarage(garage);
  const open = openSpotsForGarage(garage);
  const badge = statusBadge[status];

  // Approximate straight-line distance for at-a-glance sorting cue
  const distMi = userCoord ? haversineMiles(userCoord, [garage.lat, garage.lng]) : null;

  return (
    <motion.li
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 + index * 0.04 }}
      className={eligible ? "" : "opacity-55"}
    >
      <div className="rounded-2xl bg-white border border-[var(--color-line)] p-4 shadow-[var(--shadow-soft)] flex items-center gap-3">
        <div
          className="shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
          style={{ background: badge.bg, color: badge.color }}
        >
          <span className="num-display text-[18px] leading-none">
            {status === "full" ? "0" : open}
          </span>
          <span className="text-[8px] font-bold tracking-wider mt-0.5">SPOTS</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[17px] font-extrabold tracking-tight leading-tight truncate">
              {garage.name}
            </h3>
            <span
              className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider"
              style={{ background: badge.bg, color: badge.color }}
            >
              {badge.label.toUpperCase()}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-[var(--color-mute)] flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {garage.street}
            {distMi !== null && (
              <span className="ml-1.5 num-mono">· {distMi.toFixed(1)} mi</span>
            )}
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-purple-50 text-[var(--color-purple-700)]">
              {garage.permitZone.toUpperCase()}
            </span>
          </p>
        </div>
        {eligible ? (
          <Link
            href={`/navigate/${garage.id}`}
            className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-purple-600)] text-white flex items-center justify-center shadow-[0_8px_18px_-8px_rgb(94_31_168_/_0.6)] hover:scale-105 transition"
            aria-label="Navigate"
          >
            <Navigation2 className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/garage/${garage.id}`}
            className="shrink-0 w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
            aria-label="View details"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </motion.li>
  );
}

function haversineMiles(a: [number, number], b: [number, number]): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
