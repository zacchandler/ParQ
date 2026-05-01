"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, X, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

const SAMPLE_TRANSCRIPT = "Where should I park for my 11 AM?";
const SAMPLE_RESPONSE =
  "Pavia Garage, Floor 4 East. 9 Pink Zone spots when you arrive. Walking time 6 minutes to Wolfson Building.";

export default function VoicePage() {
  const [phase, setPhase] = useState<"idle" | "listening" | "thinking" | "answered">("idle");

  function startInteraction() {
    setPhase("listening");
    setTimeout(() => setPhase("thinking"), 1800);
    setTimeout(() => {
      setPhase("answered");
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const u = new SpeechSynthesisUtterance(SAMPLE_RESPONSE);
          u.rate = 1.05;
          u.pitch = 1.0;
          window.speechSynthesis.speak(u);
        }
      } catch {}
    }, 3300);
  }

  function reset() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPhase("idle");
  }

  return (
    <div className="min-h-dvh pb-24 bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <AppHeader showBack />

      <main className="px-5 pt-6 flex flex-col items-center gap-6 min-h-[calc(100dvh-7rem)]">
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[12px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            ParQ Voice
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold tracking-tight">Hey ParQ, ask me anything.</h1>
          <p className="mt-1 text-[14px] text-gray-600 max-w-xs mx-auto">
            Find a spot, plan your route, check garage status — all hands-free.
          </p>
        </div>

        {/* Pulse mic */}
        <div className="flex-1 flex items-center justify-center w-full">
          <button
            onClick={phase === "idle" ? startInteraction : reset}
            className="relative w-44 h-44 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-[0_20px_50px_-10px_rgb(107_47_179_/_0.6)] active:scale-95 transition-transform"
            aria-label={phase === "idle" ? "Start voice" : "Stop voice"}
          >
            {(phase === "listening" || phase === "thinking") && (
              <>
                <span className="absolute inset-0 rounded-full bg-purple-400 pulse-ring" />
                <span className="absolute inset-0 rounded-full bg-purple-300 pulse-ring" style={{ animationDelay: "0.8s" }} />
              </>
            )}
            {phase === "answered" ? (
              <X className="w-14 h-14" strokeWidth={2.2} />
            ) : (
              <Mic className="w-14 h-14" strokeWidth={2.2} />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {phase === "listening" && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-purple-700 text-[16px] font-semibold"
            >
              Listening…
            </motion.div>
          )}
          {phase === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-bold tracking-wider text-gray-500">YOU SAID</p>
                <p className="mt-1 text-[17px] font-semibold">&ldquo;{SAMPLE_TRANSCRIPT}&rdquo;</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </motion.div>
          )}
          {phase === "answered" && (
            <motion.div
              key="answered"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm space-y-3"
            >
              <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-bold tracking-wider text-gray-500">YOU SAID</p>
                <p className="mt-1 text-[15px] font-semibold">&ldquo;{SAMPLE_TRANSCRIPT}&rdquo;</p>
              </div>
              <div className="rounded-2xl bg-purple-600 text-white p-4 shadow-md">
                <p className="text-[11px] font-bold tracking-wider opacity-80">PARQ</p>
                <p className="mt-1 text-[16px] font-semibold leading-snug">{SAMPLE_RESPONSE}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
