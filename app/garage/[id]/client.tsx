"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { MapPin, Navigation, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { LiveMap } from "@/components/LiveMap";
import { Button } from "@/components/ui/Button";
import { bestFloorForGarage, openSpotsForGarage, wobble, type Garage } from "@/lib/mockData";

export function GarageDetailClient({ garage }: { garage: Garage }) {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const liveOccupancy = garage.floorOccupancy.map((o, i) =>
    mounted ? Math.max(0.05, Math.min(0.99, o + wobble(i + tick * 0.1))) : o
  );
  const bestFloor = bestFloorForGarage(garage);
  const totalOpen = openSpotsForGarage(garage);

  return (
    <div className="min-h-dvh pb-28 bg-[var(--color-bg)]">
      <AppHeader showBack />

      <main className="px-5 pt-4 space-y-6">
        {/* Map preview with garage highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="aspect-[16/10] relative rounded-2xl overflow-hidden ring-1 ring-[var(--color-line)] shadow-[var(--shadow-soft)]"
        >
          <LiveMap highlight={garage.id} interactive={false} />
        </motion.div>

        {/* Title block */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-[var(--color-purple-700)] text-[10px] font-bold tracking-widest">
            {garage.permitZone.toUpperCase()} ZONE
          </span>
          <h1 className="mt-3 font-display text-[40px] leading-[0.95] font-extrabold tracking-[-0.04em]">
            {garage.shortName}
            <br />
            <span className="font-serif italic font-normal text-[var(--color-purple-600)] text-[32px]">Garage</span>
          </h1>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[var(--color-mute)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{garage.street} · {garage.campus}</span>
          </div>
        </motion.section>

        {/* Live Occupancy */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em]">
              Live <span className="font-serif italic font-normal text-[var(--color-purple-600)]">occupancy</span>
            </h2>
            <span className="text-[10px] font-bold tracking-[0.18em] text-[var(--color-mute)]">REAL-TIME</span>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--color-line)] p-5 space-y-4 shadow-[var(--shadow-soft)]">
            {liveOccupancy.map((occ, i) => {
              const pct = Math.round(occ * 100);
              const isFull = pct >= 90;
              const isRecommended = i + 1 === bestFloor;
              const barColor = isFull ? "#E63946" : isRecommended ? "#1AAF6E" : "#7E3DC6";
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold tracking-tight">Floor {i + 1}</span>
                      {isRecommended && (
                        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <span className="num-mono text-[14px] font-bold" style={{ color: barColor }}>
                      {pct}% Full
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--color-bg-deep)] rounded-full overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 18 }}
                      className="h-full rounded-full"
                      style={{ background: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="rounded-2xl bg-coral-500/8 border border-coral-200 p-4 flex gap-3"
          style={{ background: "rgba(255,120,73,0.08)", borderColor: "rgba(255,120,73,0.25)" }}
        >
          <div className="shrink-0 w-9 h-9 rounded-xl bg-white border border-coral-200 flex items-center justify-center" style={{ borderColor: "rgba(255,120,73,0.3)" }}>
            <Sparkles className="w-5 h-5 text-[var(--color-coral-500)]" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold leading-tight">
              <span className="num-mono text-[var(--color-coral-600)]">{Math.max(3, totalOpen)}</span>{" "}
              {garage.permitZone} Zone spots predicted
            </p>
            <p className="mt-1 text-[12px] text-[var(--color-ink-soft)] leading-snug">
              Likely available upon your arrival in ~12 mins based on historical patterns.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          <Link href={`/navigate/${garage.id}`} className="block">
            <Button variant="primary" size="lg" className="w-full">
              <Navigation className="w-5 h-5" />
              Navigate
            </Button>
          </Link>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
