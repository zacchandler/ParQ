"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, ParkingCircle, Bot } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { LiveMap } from "@/components/LiveMap";
import { initialAlerts, morningInsight, type ParqAlert } from "@/lib/mockData";
import { formatTimeAgo } from "@/lib/utils";

const kindStyles: Record<ParqAlert["kind"], { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; iconClass: string; bgClass: string }> = {
  warning: { Icon: AlertTriangle, iconClass: "text-red-500", bgClass: "bg-red-50" },
  success: { Icon: CheckCircle2, iconClass: "text-emerald-500", bgClass: "bg-emerald-50" },
  info: { Icon: Info, iconClass: "text-orange-500", bgClass: "bg-orange-50" },
  system: { Icon: ParkingCircle, iconClass: "text-purple-600", bgClass: "bg-purple-50" },
};

export default function AlertsPage() {
  const newCount = initialAlerts.filter((a) => a.isNew).length;

  return (
    <div className="min-h-dvh pb-28 bg-[var(--color-bg)]">
      <AppHeader />

      <main className="px-5 pt-4 space-y-5">
        {/* Morning insight */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-4 flex gap-3 text-white relative overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 120% at 100% 0%, #7E3DC6 0%, #461382 60%, #1B0438 100%)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-coral-400/30 blur-3xl" />
          <div className="relative shrink-0 w-11 h-11 rounded-xl glass-dark flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div className="relative min-w-0">
            <p className="font-display text-[18px] font-extrabold tracking-tight">{morningInsight.title}</p>
            <p className="mt-1 text-[13px] opacity-90 leading-snug">
              Pink Zone permits <span className="font-bold text-coral-400">12% more available</span> today than usual. Consider adjusting your commute.
            </p>
          </div>
        </motion.div>

        <div className="flex items-end justify-between">
          <h1 className="font-display text-[40px] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Alerts
          </h1>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-[var(--color-purple-700)] text-[12px] font-bold">
            <span className="num-mono">{newCount}</span> NEW
          </span>
        </div>

        <ul className="space-y-3">
          {initialAlerts.map((a, i) => {
            const { Icon, iconClass, bgClass } = kindStyles[a.kind];
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
                className="rounded-2xl bg-white border border-[var(--color-line)] p-4 flex gap-3 shadow-[var(--shadow-soft)]"
              >
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}>
                  <Icon className={`w-5 h-5 ${iconClass}`} strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-bold tracking-tight leading-tight">{a.title}</p>
                    <span className="num-mono text-[11px] text-[var(--color-mute)] shrink-0 mt-0.5">{formatTimeAgo(a.minutesAgo)}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--color-ink-soft)] leading-snug">{a.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>

        {/* Promo: System update card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden aspect-[16/10]"
        >
          <LiveMap interactive={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-[10px] font-bold tracking-[0.18em] opacity-80">SYSTEM UPDATE</p>
            <p className="mt-1 font-display text-[22px] font-extrabold leading-tight tracking-tight">Next-Gen Sensors Active</p>
            <p className="mt-1 text-[12px] opacity-90 leading-snug">
              Real-time tracking accuracy increased by <span className="num-mono font-bold">40%</span> across all garages.
            </p>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
