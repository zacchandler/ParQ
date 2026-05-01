"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Plus, X, ParkingCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { LiveMap } from "@/components/LiveMap";
import { Button } from "@/components/ui/Button";
import { schedule as initialSchedule, type ScheduleClass } from "@/lib/mockData";

const categoryStyles: Record<ScheduleClass["category"], { color: string; bg: string }> = {
  SCIENCE: { color: "#E85829", bg: "#FFE6D8" },
  COMM: { color: "#DD1D5C", bg: "#FCE0EA" },
  ARTS: { color: "#5E1FA8", bg: "#EADBF6" },
  SOCIAL: { color: "#1AAF6E", bg: "#D7F3E5" },
  LOGIC: { color: "#1F5BB5", bg: "#DAE7F8" },
};

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleClass[]>(initialSchedule);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-dvh pb-28 bg-[var(--color-bg)]">
      <AppHeader />

      <main className="px-5 pt-4 space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[12px] font-semibold tracking-widest text-[var(--color-mute)] uppercase">Today · Tuesday</p>
          <h1 className="mt-1 font-display text-[40px] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Daily<br />
            <span className="font-serif italic font-normal text-[var(--color-purple-600)]">schedule</span>
          </h1>
          <p className="mt-3 text-[14px] text-[var(--color-mute)] max-w-[300px]">
            Manage your classes and secure parking before each one.
          </p>
        </motion.section>

        <ul className="space-y-3">
          {items.slice(0, 2).map((c, i) => (
            <ClassCard key={c.id} cls={c} index={i} />
          ))}
        </ul>

        {/* Mid-section live map */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="aspect-[16/9] relative rounded-2xl overflow-hidden ring-1 ring-[var(--color-line)] shadow-[var(--shadow-soft)]"
        >
          <LiveMap interactive={false} />
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full glass-dark text-white text-[11px] font-bold tracking-wide">
            Next Class · CIM 101 · in 45m
          </div>
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
          className="w-full rounded-2xl border-2 border-dashed border-[var(--color-purple-300)] bg-purple-50/40 p-6 flex flex-col items-center gap-2 text-[var(--color-purple-700)] hover:bg-purple-100/40 transition-colors"
        >
          <Plus className="w-6 h-6" strokeWidth={2.4} />
          <span className="font-display font-extrabold text-[15px]">+ Add Custom Event</span>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
      className="rounded-2xl bg-white border border-[var(--color-line)] p-5 shadow-[var(--shadow-soft)]"
    >
      <span
        className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest"
        style={{ background: styles.bg, color: styles.color }}
      >
        {cls.category}
      </span>
      <h3 className="mt-3 font-display text-[26px] font-extrabold leading-tight tracking-tight">{cls.code}</h3>
      <p className="text-[13px] text-[var(--color-mute)]">{cls.name}</p>
      <div className="mt-3 space-y-1.5 text-[13px] text-[var(--color-ink-soft)]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--color-mute)]" />
          <span className="num-mono">{cls.startTime} – {cls.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--color-mute)]" />
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white rounded-t-[28px] p-6 pb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl font-extrabold tracking-tight">Add Event</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <Field label="Event name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Study group" className="w-full h-12 px-4 rounded-xl border border-[var(--color-line)] focus:border-[var(--color-purple-500)] focus:ring-4 focus:ring-purple-100 outline-none transition" />
          </Field>
          <Field label="Location on campus">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Otto G. Richter Library" className="w-full h-12 px-4 rounded-xl border border-[var(--color-line)] focus:border-[var(--color-purple-500)] focus:ring-4 focus:ring-purple-100 outline-none transition" />
          </Field>
          <Field label="Time">
            <input value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[var(--color-line)] focus:border-[var(--color-purple-500)] focus:ring-4 focus:ring-purple-100 outline-none transition" />
          </Field>
        </div>
        <Button
          variant="purple" size="lg" className="w-full mt-6"
          onClick={() => {
            if (!name) return;
            onAdd({
              id: `c-${Date.now()}`, code: name.toUpperCase(), name, category: "ARTS",
              days: "Today", startTime: time, endTime: time,
              location: location || "Campus", recommendedGarageId: "pavia",
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
      <span className="block px-1 text-[11px] font-bold tracking-widest text-[var(--color-ink-soft)] uppercase mb-1.5">{label}</span>
      {children}
    </label>
  );
}
