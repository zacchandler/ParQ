"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { User as UserIcon, Wallet, ClipboardList, HelpCircle, ChevronRight, BadgeCheck, Folder, Timer, Gavel } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { LiveMap } from "@/components/LiveMap";
import { currentUser } from "@/lib/mockData";

export default function ProfilePage() {
  return (
    <div className="min-h-dvh pb-28 bg-[var(--color-bg)]">
      <AppHeader />

      <main className="px-5 pt-6 space-y-5">
        {/* Avatar + identity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-700)] flex items-center justify-center text-white font-display font-extrabold text-[40px] shadow-[var(--shadow-deep)] ring-4 ring-white">
              A
            </div>
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[var(--color-coral-500)] ring-2 ring-white flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-white" strokeWidth={2.6} />
            </div>
          </div>
          <h1 className="mt-3 font-display text-[28px] font-extrabold tracking-tight">{currentUser.name}</h1>
          <p className="text-[13px] text-[var(--color-mute)]">UM Junior · Class of <span className="num-mono">{currentUser.classOf}</span></p>
          <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-[12px] font-bold" style={{ background: "rgba(255,120,73,0.10)", borderColor: "rgba(255,120,73,0.3)", color: "var(--color-coral-600)" }}>
            <ClipboardList className="w-3.5 h-3.5" />
            {currentUser.permit}
          </span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <StatCard icon={Folder} value={String(currentUser.spotsSaved)} label="SPOTS" tint="purple" />
          <StatCard icon={Timer} value={currentUser.hoursSaved.toFixed(1)} label="HOURS" tint="purple" />
          <StatCard icon={Gavel} value={String(currentUser.ticketsAvoided)} label="AVOIDED" tint="coral" />
        </motion.div>

        {/* Settings list */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="rounded-2xl bg-white border border-[var(--color-line)] divide-y divide-[var(--color-line)] overflow-hidden shadow-[var(--shadow-soft)]"
        >
          <SettingsRow icon={UserIcon} label="Account" />
          <SettingsRow icon={Wallet} label="Payment" />
          <SettingsRow icon={ClipboardList} label="Permit Info" />
          <SettingsRow icon={HelpCircle} label="Help & Support" />
        </motion.section>

        {/* Refer a friend */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="relative rounded-2xl overflow-hidden aspect-[16/10]"
        >
          <LiveMap interactive={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-[10px] font-bold tracking-[0.18em] opacity-80">REFER A FRIEND</p>
            <p className="mt-1 font-display text-[22px] font-extrabold leading-tight tracking-tight">
              Get <span className="num-mono">$5</span> credit<br />for every new student.
            </p>
          </div>
        </motion.div>

        <Link href="/" className="block text-center text-[14px] font-semibold text-[var(--color-mute)] hover:text-[var(--color-purple-600)] py-3">
          Sign Out
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}

function StatCard({
  icon: Icon, value, label, tint,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  value: string; label: string; tint: "purple" | "coral";
}) {
  const color = tint === "purple" ? "text-[var(--color-purple-600)]" : "text-[var(--color-coral-500)]";
  return (
    <div className="rounded-2xl bg-white border border-[var(--color-line)] p-4 flex flex-col items-center text-center shadow-[var(--shadow-soft)]">
      <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.2} />
      <div className="num-display text-[28px] leading-none mt-2">{value}</div>
      <div className="mt-1 text-[10px] font-bold tracking-widest text-[var(--color-mute)]">{label}</div>
    </div>
  );
}

function SettingsRow({
  icon: Icon, label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-purple-50/30 transition-colors text-left">
      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[var(--color-purple-600)]" strokeWidth={2.2} />
      </div>
      <span className="flex-1 text-[15px] font-semibold tracking-tight">{label}</span>
      <ChevronRight className="w-5 h-5 text-[var(--color-mute)]" />
    </button>
  );
}
