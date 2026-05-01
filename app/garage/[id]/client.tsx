"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Navigation, Bookmark, BarChart3 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CampusMap } from "@/components/CampusMap";
import { Button } from "@/components/ui/Button";
import { bestFloorForGarage, openSpotsForGarage, wobble, type Garage } from "@/lib/mockData";

export function GarageDetailClient({ garage }: { garage: Garage }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const liveOccupancy = garage.floorOccupancy.map((o, i) =>
    Math.max(0.05, Math.min(0.99, o + wobble(i + tick * 0.1)))
  );
  const bestFloor = bestFloorForGarage(garage);
  const totalOpen = openSpotsForGarage(garage);

  return (
    <div className="min-h-dvh pb-24 bg-[var(--color-bg)]">
      <AppHeader showBack />

      <main className="px-5 pt-4 space-y-5">
        {/* Map header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="aspect-[16/10] relative rounded-2xl overflow-hidden"
        >
          <CampusMap variant="compact" highlight={garage.id} showLegend={false} showLabel={`${garage.permitZone} Zone`} />
        </motion.div>

        {/* Title block */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h1 className="text-[34px] leading-[1.1] font-extrabold tracking-tight">{garage.name}</h1>
          <div className="mt-2 flex items-center gap-1.5 text-[14px] text-gray-600">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{garage.campus} • {garage.street}</span>
          </div>
        </motion.section>

        {/* Live Occupancy */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-[22px] font-extrabold tracking-tight">Live Occupancy</h2>
            <span className="text-[10px] font-bold tracking-[0.18em] text-gray-500">REAL-TIME</span>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--color-border)] p-5 space-y-5 shadow-[var(--shadow-card)]">
            {liveOccupancy.map((occ, i) => {
              const pct = Math.round(occ * 100);
              const isFull = pct >= 90;
              const isRecommended = i + 1 === bestFloor;
              const barColor = isFull ? "#EF4444" : isRecommended ? "#10B981" : "#6B2FB3";
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold">Floor {i + 1}</span>
                      {isRecommended && (
                        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[15px] font-bold tabular-nums"
                      style={{ color: barColor }}
                    >
                      {pct}% Full
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
          className="rounded-2xl bg-orange-50 border border-orange-100 p-4 flex gap-3"
        >
          <div className="shrink-0 w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-600" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[var(--color-text)] leading-tight">
              {Math.max(3, totalOpen)} {garage.permitZone} Zone spots predicted
            </p>
            <p className="mt-1 text-[13px] text-gray-700 leading-snug">
              Likely available upon your arrival in ~12 mins based on historical patterns.
            </p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="space-y-3"
        >
          <Button variant="primary" size="lg" className="w-full">
            <Navigation className="w-5 h-5" />
            Navigate
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            <Bookmark className="w-5 h-5" />
            Set as Backup
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
