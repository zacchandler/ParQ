"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Calendar, Search, Compass, Settings, ChevronRight, Building2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CampusMap } from "@/components/CampusMap";
import { Button } from "@/components/ui/Button";
import { upcomingParkings } from "@/lib/mockData";

export default function HomePage() {
  return (
    <div className="min-h-dvh pb-24 bg-[var(--color-bg)]">
      <AppHeader />

      <main className="px-5 pt-5 space-y-6">
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-[34px] leading-[1.1] font-extrabold tracking-tight text-[var(--color-text)]">
            Good morning, Alex!
          </h1>
          <p className="mt-1 text-[15px] text-gray-600">
            Your next class starts at <span className="font-bold text-orange-500">11:00 AM</span>
          </p>
        </motion.section>

        {/* Leave-in alert */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="rounded-2xl bg-purple-50 border border-purple-100 p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-purple-200/70 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-700" strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[20px] font-bold text-[var(--color-text)] leading-tight">
                  Leave in 14 minutes
                </h2>
                <p className="mt-1 text-[14px] text-gray-700 leading-snug">
                  Floor 4 of Pavia will have <span className="font-bold text-orange-500">9 open spots</span>
                </p>
              </div>
            </div>
            <Link href="/garage/pavia" className="block mt-4">
              <Button variant="primary" size="lg" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Live Parking Map */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-[22px] font-extrabold text-[var(--color-text)] tracking-tight">Live Parking Map</h2>
            <span className="text-[13px] font-semibold text-purple-600">Coral Gables Campus</span>
          </div>
          <div className="aspect-square">
            <CampusMap variant="full" />
          </div>
        </motion.section>

        {/* Quick action grid */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="grid grid-cols-2 gap-3"
        >
          <QuickAction icon={Calendar} label="My Schedule" href="/schedule" />
          <QuickAction icon={Search} label="Find Parking" href="/garage/pavia" />
          <QuickAction icon={Compass} label="Directions" href="/garage/pavia" />
          <QuickAction icon={Settings} label="Settings" href="/profile" />
        </motion.section>

        {/* Upcoming Parkings */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[22px] font-extrabold text-[var(--color-text)] tracking-tight">Upcoming Parkings</h2>
            <button className="text-gray-400 px-2" aria-label="More options">···</button>
          </div>
          {upcomingParkings.map((p) => (
            <Link key={p.label} href={`/garage/${p.garageId}`}>
              <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4 flex items-center gap-4 shadow-[var(--shadow-card)] hover:shadow-md transition-shadow">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-magenta-500" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-wider text-orange-500">{p.label}</p>
                  <p className="text-[15px] font-semibold text-[var(--color-text)] mt-0.5">{p.location}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </Link>
          ))}
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl bg-purple-50 border border-purple-100 p-5 flex flex-col items-center justify-center gap-2 hover:bg-purple-100/70 transition-colors aspect-[1.6]"
      >
        <Icon className="w-7 h-7 text-purple-600" strokeWidth={2} />
        <span className="text-[15px] font-bold text-[var(--color-text)]">{label}</span>
      </motion.div>
    </Link>
  );
}
