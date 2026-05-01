"use client";

import Link from "next/link";
import { Bell, ArrowLeft, Search } from "lucide-react";
import { motion } from "motion/react";

interface AppHeaderProps {
  showBack?: boolean;
  showSearch?: boolean;
  hasNotifBadge?: boolean;
}

export function AppHeader({ showBack = false, showSearch = false, hasNotifBadge = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--color-border)]">
      <div className="safe-top" />
      <div className="flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link href="/home" aria-label="Back" className="-ml-2 p-2 rounded-full hover:bg-purple-50">
              <ArrowLeft className="w-5 h-5 text-[var(--color-text)]" />
            </Link>
          )}
          <Link href="/home" className="flex items-center" aria-label="ParQ home">
            <span className="text-2xl font-extrabold tracking-tight text-purple-600 italic">Par<span className="text-purple-700">Q</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-1">
          {showSearch && (
            <button aria-label="Search" className="p-2 rounded-full hover:bg-purple-50">
              <Search className="w-5 h-5 text-purple-600" />
            </button>
          )}
          <Link href="/alerts" aria-label="Notifications" className="relative p-2 rounded-full hover:bg-purple-50">
            <Bell className="w-5 h-5 text-purple-600" />
            {hasNotifBadge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
