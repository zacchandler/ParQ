"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Bell, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", label: "HOME", icon: Home },
  { href: "/schedule", label: "MAP", icon: Map }, // "MAP" tab routes to schedule per design
  { href: "/alerts", label: "ALERTS", icon: Bell },
  { href: "/profile", label: "PROFILE", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[1100] glass border-t border-white/40">
      <div className="grid grid-cols-4 h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href === "/home" && pathname === "/home") ||
            (tab.href === "/schedule" && (pathname.startsWith("/schedule") || pathname.startsWith("/garage"))) ||
            (tab.href === "/alerts" && pathname.startsWith("/alerts")) ||
            (tab.href === "/profile" && pathname.startsWith("/profile"));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center gap-1 group"
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-purple-100" : "bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-purple-600" : "text-gray-400"
                  )}
                  strokeWidth={isActive ? 2.4 : 2}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold tracking-wider transition-colors",
                  isActive ? "text-purple-600" : "text-gray-400"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-purple-600"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
      <div className="safe-bottom" />
    </nav>
  );
}
