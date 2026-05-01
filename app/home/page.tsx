"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Calendar, Search, ChevronRight, Building2, MapPin, Mic, ArrowUpRight, Clock4,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { LiveMap } from "@/components/LiveMap";
import { upcomingParkings, garages, currentUser } from "@/lib/mockData";

export default function HomePage() {
  const next = garages.find((g) => g.id === "pavia")!;

  return (
    <div className="min-h-dvh pb-28 bg-[var(--color-bg)] relative">
      <AppHeader />

      <main className="px-5 pt-4 space-y-7">
        {/* === Greeting === */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[12px] font-semibold tracking-widest text-[var(--color-mute)] uppercase">Tuesday · Apr 30</p>
          <h1 className="mt-1 font-display text-[40px] leading-[0.95] font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
            Good morning,
            <br />
            <span className="font-serif italic font-normal text-[var(--color-purple-600)]">Alex.</span>
          </h1>
        </motion.section>

        {/* === Hero "Leave at" card === */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="relative overflow-hidden rounded-[var(--radius-tile)] p-6 text-white shadow-[var(--shadow-deep)]"
          style={{
            background:
              "radial-gradient(120% 120% at 0% 0%, #7E3DC6 0%, #461382 55%, #1B0438 100%)",
          }}
        >
          {/* Aurora */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-coral-500/40 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-purple-300/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full glass-dark text-[10px] font-bold tracking-widest">
                AI · DEPART IN
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="num-display text-[72px] leading-none">14</span>
              <span className="text-[20px] font-semibold opacity-80">min</span>
            </div>
            <p className="mt-1 text-[14px] opacity-85 leading-snug max-w-[260px]">
              Floor 4 of <span className="font-semibold opacity-100">Pavia Garage</span> will have{" "}
              <span className="font-bold text-[var(--color-coral-400)]">9 open Pink Zone spots</span> when you arrive.
            </p>
            <Link
              href={`/navigate/${next.id}`}
              className="mt-5 w-full h-12 rounded-2xl bg-white text-[var(--color-purple-700)] font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-md hover:bg-cream-50 transition"
            >
              Get Directions
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* === Real Live Map === */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em]">
              Live <span className="font-serif italic font-normal text-[var(--color-purple-600)]">map</span>
            </h2>
            <Link href="/schedule" className="text-[12px] font-semibold text-[var(--color-purple-600)] tracking-wide">
              VIEW ALL →
            </Link>
          </div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-[var(--color-line)] shadow-[var(--shadow-soft)]">
            <LiveMap />
          </div>
        </motion.section>

        {/* === Quick actions, editorial spacing === */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em] mb-3">
            Quick <span className="font-serif italic font-normal text-[var(--color-purple-600)]">actions</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <ActionTile icon={Calendar} label="Schedule" sub="5 classes" href="/schedule" />
            <ActionTile icon={Search} label="Find a spot" sub="Pink Zone access" href="/spots" />
            <ActionTile icon={Mic} label="Voice" sub="ParQ AI" href="/voice" />
            <ActionTile icon={Clock4} label="History" sub={`${currentUser.spotsSaved} parkings`} href="/history" />
          </div>
        </motion.section>

        {/* === Upcoming === */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em]">
              Upcoming <span className="font-serif italic font-normal text-[var(--color-purple-600)]">parkings</span>
            </h2>
            <button className="text-[var(--color-mute)]" aria-label="More">···</button>
          </div>
          {upcomingParkings.map((p) => {
            const garage = garages.find((g) => g.id === p.garageId)!;
            return (
              <Link key={p.label} href={`/garage/${garage.id}`}>
                <div className="rounded-2xl bg-white border border-[var(--color-line)] p-4 flex items-center gap-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glass)] transition-shadow">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[var(--color-purple-600)]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-widest text-[var(--color-coral-500)]">{p.label}</p>
                    <p className="mt-0.5 text-[15px] font-semibold tracking-tight">{p.location}</p>
                    <p className="mt-0.5 text-[12px] text-[var(--color-mute)] flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {garage.street}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--color-mute)]" />
                </div>
              </Link>
            );
          })}
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}

function ActionTile({
  icon: Icon,
  label,
  sub,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  sub: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden rounded-2xl bg-white border border-[var(--color-line)] p-4 hover:border-[var(--color-purple-200)] transition-colors shadow-[var(--shadow-soft)]"
      >
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-purple-50" />
        <Icon className="relative w-6 h-6 text-[var(--color-purple-600)]" strokeWidth={2} />
        <div className="relative mt-6">
          <div className="font-display font-extrabold text-[18px] tracking-tight leading-none">{label}</div>
          <div className="mt-1 text-[11px] font-semibold text-[var(--color-mute)] tracking-wide">{sub}</div>
        </div>
      </motion.div>
    </Link>
  );
}
