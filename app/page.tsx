"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => router.push("/home"), 1500);
    return () => clearTimeout(t);
  }, [phase, router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between px-8 py-16 bg-gradient-to-b from-[#FAF6FC] via-[#F4EAF8] to-[#E8D9F0]">
      {/* Top spacer */}
      <div className="safe-top" />

      {/* Logo + tagline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col items-center justify-center text-center gap-4"
      >
        <motion.div
          initial={{ rotate: -6, scale: 0.85 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className="absolute inset-0 blur-3xl bg-purple-400/40 rounded-full" />
          <div className="relative">
            <h1 className="text-[80px] font-extrabold tracking-tight text-purple-600 italic leading-none">
              Par<span className="text-purple-700">Q</span>
            </h1>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[20px] font-semibold text-gray-700 max-w-xs"
        >
          Never circle Pavia again.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-gray-500"
        >
          AI parking intelligence • University of Miami
        </motion.p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-sm safe-bottom"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          disabled={phase === "loading"}
          onClick={() => setPhase("loading")}
          className="w-full h-14 rounded-2xl bg-magenta-500 text-white font-bold text-[16px] shadow-[0_8px_30px_-6px_rgb(233_30_99_/_0.5)] disabled:opacity-80 flex items-center justify-center gap-2"
        >
          <AnimatePresence mode="wait">
            {phase === "loading" ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating with CaneID...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign in with CaneID
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to ParQ&apos;s Terms &amp; Privacy.
        </p>
      </motion.div>
    </div>
  );
}
