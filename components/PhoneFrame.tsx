"use client";

import { motion } from "motion/react";

/**
 * Wraps app content in a realistic iPhone bezel on desktop (>= 768px),
 * renders edge-to-edge on mobile. The dark stage outside the device adds
 * pitch-deck polish for VC demos viewed on a laptop.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* MOBILE: render flush */}
      <div className="md:hidden min-h-dvh bg-[var(--color-bg)]">{children}</div>

      {/* DESKTOP: render inside an iPhone bezel against a deep stage */}
      <div className="hidden md:flex relative min-h-dvh items-center justify-center overflow-hidden">
        <Stage />
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <Bezel>{children}</Bezel>
        </motion.div>
        <Pill />
      </div>
    </>
  );
}

function Stage() {
  return (
    <>
      {/* Deep gradient sky */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#3B0F77_0%,#1B0438_45%,#0B021F_100%)]" />
      {/* Aurora glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-40 blur-[140px] bg-[conic-gradient(from_140deg_at_50%_50%,#5E1FA8,#DD1D5C,#FF7849,#5E1FA8)]" />
      {/* Soft rings */}
      <div className="absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_50%,black,transparent)]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-white/5" />
      </div>
      {/* Grain */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />
    </>
  );
}

function Bezel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ width: 420, height: 860 }}>
      {/* Outer bezel */}
      <div
        className="absolute inset-0 rounded-[58px] p-[10px]"
        style={{
          background: "linear-gradient(180deg,#0e0517 0%,#241039 50%,#0e0517 100%)",
          boxShadow:
            "0 60px 120px -30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 2px rgba(255,255,255,0.02)",
        }}
      >
        {/* Inner screen */}
        <div className="relative w-full h-full rounded-[48px] overflow-hidden bg-[var(--color-bg)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.4)]">
          {/* Dynamic Island (notch-like) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 h-[26px] w-[100px] rounded-full bg-black pointer-events-none" />
          {/* App canvas — small top inset to clear the notch */}
          <div className="relative w-full h-full overflow-y-auto no-scrollbar pt-[40px]">
            {children}
          </div>
        </div>
      </div>
      {/* Side buttons */}
      <span className="absolute left-[-3px] top-[110px] w-[3px] h-[36px] rounded-l bg-[#0e0517]" />
      <span className="absolute left-[-3px] top-[180px] w-[3px] h-[64px] rounded-l bg-[#0e0517]" />
      <span className="absolute left-[-3px] top-[260px] w-[3px] h-[64px] rounded-l bg-[#0e0517]" />
      <span className="absolute right-[-3px] top-[180px] w-[3px] h-[100px] rounded-r bg-[#0e0517]" />
    </div>
  );
}

function Pill() {
  return (
    <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-center gap-2 px-4 py-2 rounded-full glass-dark text-white text-[12px] font-medium tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />
      <span>Tap or scroll inside the device — live preview</span>
    </div>
  );
}
