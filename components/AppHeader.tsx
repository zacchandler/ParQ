"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, ArrowLeft, Search } from "lucide-react";
import { motion } from "motion/react";
import { asset } from "@/lib/utils";

interface AppHeaderProps {
  showBack?: boolean;
  showSearch?: boolean;
  hasNotifBadge?: boolean;
}

export function AppHeader({ showBack = false, showSearch = false, hasNotifBadge = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-[1090] glass border-b border-white/40">
      <div className="safe-top" />
      <div className="flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-2.5">
          {showBack && (
            <Link href="/home" aria-label="Back" className="-ml-2 p-2 rounded-full hover:bg-purple-50">
              <ArrowLeft className="w-5 h-5 text-[var(--color-ink)]" />
            </Link>
          )}
          <Link href="/home" className="flex items-center gap-2" aria-label="ParQ home">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-[#621EA4] shadow-sm">
              <Image
                src={asset("/logo.jpeg")}
                alt=""
                width={56}
                height={56}
                className="absolute inset-0 w-full h-full object-cover"
                unoptimized
              />
            </div>
            <span className="wordmark text-[20px] -tracking-[0.04em]">ParQ</span>
          </Link>
        </div>
        <div className="flex items-center gap-1">
          {showSearch && (
            <button aria-label="Search" className="p-2 rounded-full hover:bg-purple-50">
              <Search className="w-5 h-5 text-[var(--color-purple-600)]" />
            </button>
          )}
          <Link href="/alerts" aria-label="Notifications" className="relative p-2 rounded-full hover:bg-purple-50">
            <Bell className="w-5 h-5 text-[var(--color-purple-600)]" />
            {hasNotifBadge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral-500 ring-2 ring-white"
                style={{ background: "var(--color-coral-500)" }}
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
