"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { User as UserIcon, Wallet, ClipboardList, HelpCircle, ChevronRight, BadgeCheck, Folder, Timer, Gavel } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CampusMap } from "@/components/CampusMap";
import { currentUser } from "@/lib/mockData";

export default function ProfilePage() {
  return (
    <div className="min-h-dvh pb-24 bg-[var(--color-bg)]">
      <AppHeader />

      <main className="px-5 pt-6 space-y-5">
        {/* Avatar + identity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg ring-4 ring-purple-100">
              A
            </div>
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-orange-500 ring-2 ring-white flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-white" strokeWidth={2.6} />
            </div>
          </div>
          <h1 className="mt-3 text-[26px] font-extrabold tracking-tight">{currentUser.name}</h1>
          <p className="text-[14px] text-gray-600">UM Junior, Class of {currentUser.classOf}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[12px] font-bold">
            <ClipboardList className="w-3.5 h-3.5" />
            {currentUser.permit}
          </span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <StatCard icon={Folder} value={String(currentUser.spotsSaved)} label="SPOTS SAVED" tint="purple" />
          <StatCard icon={Timer} value={currentUser.hoursSaved.toFixed(1)} label="HOURS SAVED" tint="purple" />
          <StatCard icon={Gavel} value={String(currentUser.ticketsAvoided)} label="AVOIDED" tint="orange" />
        </motion.div>

        {/* Settings list */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="rounded-2xl bg-white border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)]"
        >
          <SettingsRow icon={UserIcon} label="Account" />
          <SettingsRow icon={Wallet} label="Payment" />
          <SettingsRow icon={ClipboardList} label="Permit Info" />
          <SettingsRow icon={HelpCircle} label="Help & Support" />
        </motion.section>

        {/* Refer a friend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="relative rounded-2xl overflow-hidden aspect-[16/9]"
        >
          <CampusMap variant="compact" showLegend={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/85 via-purple-900/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-[10px] font-bold tracking-[0.18em] opacity-80">REFER A FRIEND</p>
            <p className="mt-1 text-[20px] font-extrabold leading-tight">
              Get $5 credit for every<br />new Cane you refer.
            </p>
          </div>
        </motion.div>

        <Link href="/" className="block text-center text-[14px] font-semibold text-gray-500 hover:text-purple-600 py-2">
          Sign Out
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  value: string;
  label: string;
  tint: "purple" | "orange";
}) {
  const color = tint === "purple" ? "text-purple-600" : "text-orange-500";
  return (
    <div className="rounded-2xl bg-purple-50/70 border border-purple-100 p-4 flex flex-col items-center text-center gap-1">
      <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.2} />
      <div className="text-[24px] font-extrabold text-[var(--color-text)] leading-none mt-1">{value}</div>
      <div className="text-[10px] font-bold tracking-wider text-gray-500">{label}</div>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left">
      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-purple-600" strokeWidth={2.2} />
      </div>
      <span className="flex-1 text-[15px] font-semibold text-[var(--color-text)]">{label}</span>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </button>
  );
}
