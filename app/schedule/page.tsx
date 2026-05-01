"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Plus, X, ParkingCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CampusMap } from "@/components/CampusMap";
import { Button } from "@/components/ui/Button";
import { schedule as initialSchedule, type ScheduleClass } from "@/lib/mockData";

const categoryStyles: Record<ScheduleClass["category"], { color: string; bg: string }> = {
  SCIENCE: { color: "#FF6B35", bg: "#FFEEDB" },
  COMM: { color: "#E91E63", bg: "#FCE4EC" },
  ARTS: { color: "#6B2FB3", bg: "#F0E6F8" },
  SOCIAL: { color: "#10B981", bg: "#D1FAE5" },
  LOGIC: { color: "#3B82F6", bg: "#DBEAFE" },
};

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleClass[]>(initialSchedule);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-dvh pb-24 bg-[var(--color-bg)]">
      <AppHeader />

      <main className="px-5 pt-5 space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-[34px] leading-[1.1] font-extrabold tracking-tight">Daily Schedule</h1>
          <p className="mt-1 text-[15px] text-gray-600 max-w-xs">
            Manage your classes and secure your parking spots for today.
          </p>
        </motion.section>

        <ul className="space-y-3">
          {items.slice(0, 2).map((c, i) => (
            <ClassCard key={c.id} cls={c} index={i} />
          ))}
        </ul>

        {/* Mid-section map */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="aspect-[16/9] relative rounded-2xl overflow-hidden"
        >
          <CampusMap variant="compact" showLegend={false} showLabel="Next Class starts in 45m" />
        </motion.div>

        <ul className="space-y-3">
          {items.slice(2).map((c, i) => (
            <ClassCard key={c.id} cls={c} index={i + 2} />
          ))}
        </ul>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdd(true)}
          className="w-full rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-6 flex flex-col items-center gap-2 text-purple-600 hover:bg-purple-100/50 transition-colors"
        >
          <Plus className="w-6 h-6" strokeWidth={2.4} />
          <span className="text-[15px] font-bold">+ Add Custom Event</span>
        </motion.button>
      </main>

      <BottomNav />

      <AnimatePresence>
        {showAdd && <AddEventSheet onClose={() => setShowAdd(false)} onAdd={(c) => { setItems([...items, c]); setShowAdd(false); }} />}
      </AnimatePresence>
    </div>
  );
}

function ClassCard({ cls, index }: { cls: ScheduleClass; index: number }) {
  const styles = categoryStyles[cls.category];
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
      className="rounded-2xl bg-white border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]"
    >
      <span
        className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
        style={{ background: styles.bg, color: styles.color }}
      >
        {cls.category}
      </span>
      <h3 className="mt-2 text-[22px] font-extrabold leading-tight">{cls.code}</h3>
      <div className="mt-2 space-y-1.5 text-[14px] text-gray-700">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{cls.startTime} – {cls.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{cls.location}</span>
        </div>
      </div>
      <Link href={`/garage/${cls.recommendedGarageId}`} className="block mt-4">
        <Button variant="purple" size="lg" className="w-full">
          <ParkingCircle className="w-5 h-5" />
          Park for this class
        </Button>
      </Link>
    </motion.li>
  );
}

function AddEventSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (c: ScheduleClass) => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("12:00 PM");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white rounded-t-3xl p-6 pb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">Add Custom Event</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <Field label="Event name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Study group"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </Field>
          <Field label="Location on campus">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Otto G. Richter Library"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </Field>
          <Field label="Time">
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </Field>
        </div>
        <Button
          variant="purple"
          size="lg"
          className="w-full mt-6"
          onClick={() => {
            if (!name) return;
            onAdd({
              id: `c-${Date.now()}`,
              code: name.toUpperCase(),
              name,
              category: "ARTS",
              days: "Today",
              startTime: time,
              endTime: time,
              location: location || "Campus",
              recommendedGarageId: "pavia",
            });
          }}
        >
          Add to Schedule
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-gray-700">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
