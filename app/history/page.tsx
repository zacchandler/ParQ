"use client";

import { motion } from "motion/react";
import { Clock, ChevronRight, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { currentUser, garages } from "@/lib/mockData";

interface HistoryEntry {
  id: string;
  garageId: string;
  date: string;
  duration: string;
  spotNumber: string;
  cost?: string;
}

const entries: HistoryEntry[] = [
  { id: "h1", garageId: "pavia", date: "Today · 09:14", duration: "2h 45m", spotNumber: "#412" },
  { id: "h2", garageId: "mahoney", date: "Yesterday · 14:02", duration: "1h 30m", spotNumber: "#218" },
  { id: "h3", garageId: "pavia", date: "Yesterday · 09:08", duration: "3h 10m", spotNumber: "#388" },
  { id: "h4", garageId: "levante", date: "Apr 28 · 10:55", duration: "2h 02m", spotNumber: "#150" },
  { id: "h5", garageId: "pavia", date: "Apr 28 · 08:30", duration: "1h 20m", spotNumber: "#404" },
  { id: "h6", garageId: "mahoney", date: "Apr 27 · 13:40", duration: "4h 05m", spotNumber: "#221" },
];

export default function HistoryPage() {
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
            This Semester
          </p>
          <h1 className="mt-1 font-display text-[36px] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Parking<br />
            <span className="font-serif italic font-normal text-[var(--color-purple-600)]">history</span>
          </h1>
        </motion.section>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl p-5 text-white relative overflow-hidden shadow-[var(--shadow-deep)]"
          style={{
            background: "radial-gradient(120% 120% at 0% 0%, #7E3DC6 0%, #461382 55%, #1B0438 100%)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-coral-400/30 blur-3xl" />
          <div className="relative grid grid-cols-3 gap-3">
            <SummaryStat label="SPOTS" value={String(currentUser.spotsSaved)} />
            <SummaryStat label="HOURS" value={currentUser.hoursSaved.toFixed(1)} />
            <SummaryStat label="AVG ETA" value="6.4m" />
          </div>
          <div className="relative mt-4 flex items-center gap-2 text-[12px] opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>You park <span className="font-bold">22% faster</span> than other students.</span>
          </div>
        </motion.div>

        {/* Recent entries */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <h2 className="font-display text-[20px] font-extrabold tracking-tight mb-3">
            Recent
          </h2>
          <ul className="space-y-3">
            {entries.map((e, i) => {
              const garage = garages.find((g) => g.id === e.garageId);
              if (!garage) return null;
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
                >
                  <Link href={`/garage/${garage.id}`}>
                    <div className="rounded-2xl bg-white border border-[var(--color-line)] p-4 shadow-[var(--shadow-soft)] flex items-center gap-3 hover:shadow-[var(--shadow-glass)] transition-shadow">
                      <div className="shrink-0 w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[var(--color-purple-600)]" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-[15px] font-extrabold tracking-tight leading-tight truncate">
                          {garage.shortName} <span className="font-normal opacity-50 text-[12px]">·  Spot {e.spotNumber}</span>
                        </h3>
                        <p className="mt-0.5 text-[12px] text-[var(--color-mute)] flex items-center gap-2">
                          <span className="num-mono">{e.date}</span>
                          <span className="opacity-40">·</span>
                          <Clock className="w-3 h-3" />
                          <span className="num-mono">{e.duration}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--color-mute)]" />
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="num-display text-[28px] leading-none">{value}</div>
      <div className="mt-1 text-[10px] font-bold tracking-widest opacity-80">{label}</div>
    </div>
  );
}
