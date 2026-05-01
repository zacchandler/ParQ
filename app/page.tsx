"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { asset } from "@/lib/utils";

type Phase = "idle" | "loading";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [provider, setProvider] = useState<"email" | "google" | "microsoft" | null>(null);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => router.push("/home"), 1100);
    return () => clearTimeout(t);
  }, [phase, router]);

  function submit(p: "email" | "google" | "microsoft") {
    setProvider(p);
    setPhase("loading");
  }

  return (
    <div className="relative min-h-dvh flex flex-col bg-[var(--color-bg)] overflow-hidden">
      {/* Decorative atmosphere */}
      <div className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-purple-200 opacity-60 blur-[100px]" />
      <div className="absolute top-[44%] -left-32 w-[360px] h-[360px] rounded-full bg-coral-400 opacity-25 blur-[110px]" />
      <div className="absolute -bottom-40 right-1/3 w-[420px] h-[420px] rounded-full bg-purple-300 opacity-40 blur-[120px]" />

      <div className="safe-top h-14" />

      {/* Logo slot — drop your file at /public/logo.svg or /public/logo.png */}
      <div className="relative z-10 px-7 pt-6 flex items-center gap-3">
        <LogoSlot />
        <div className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full glass text-[11px] font-semibold text-[var(--color-purple-700)] tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-soft" />
          BETA
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-7 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[44px] leading-[0.98] font-display font-extrabold tracking-[-0.035em] text-[var(--color-ink)]">
            Welcome<br />
            <span className="font-serif italic font-normal text-[var(--color-purple-600)]">back.</span>
          </h1>
          <p className="mt-3 text-[15px] text-[var(--color-mute)] max-w-[320px]">
            Sign in to find your spot before you park. New here?{" "}
            <button className="font-semibold text-[var(--color-purple-600)] underline-offset-4 hover:underline">
              Create account
            </button>
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-10 space-y-3"
          onSubmit={(e) => { e.preventDefault(); submit("email"); }}
        >
          {/* Email */}
          <Field label="Email or Cane ID">
            <input
              type="email"
              autoComplete="username"
              placeholder="alex@miami.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-white/80 border border-[var(--color-line)] text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-mute)] focus:bg-white focus:border-[var(--color-purple-400)] focus:ring-4 focus:ring-purple-100 outline-none transition"
            />
          </Field>

          {/* Password */}
          <Field label="Password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-5 pr-14 rounded-2xl bg-white/80 border border-[var(--color-line)] text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-mute)] focus:bg-white focus:border-[var(--color-purple-400)] focus:ring-4 focus:ring-purple-100 outline-none transition tracking-[0.15em]"
                style={!showPw ? { fontFamily: "system-ui" } : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-purple-600)] hover:bg-purple-50 transition"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </Field>

          {/* Row: remember me + forgot */}
          <div className="flex items-center justify-between pt-1 pl-1">
            <button
              type="button"
              onClick={() => setRemember((v) => !v)}
              className="flex items-center gap-2 group"
            >
              <span className={`relative w-5 h-5 rounded-md flex items-center justify-center transition ${
                remember ? "bg-[var(--color-purple-600)] border-[var(--color-purple-600)]" : "bg-white border-2 border-[var(--color-line)] group-hover:border-[var(--color-purple-300)]"
              }`}>
                <AnimatePresence>
                  {remember && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="text-[13px] font-medium text-[var(--color-ink-soft)]">Remember me</span>
            </button>
            <button type="button" className="text-[13px] font-semibold text-[var(--color-purple-600)] hover:underline underline-offset-4">
              Forgot?
            </button>
          </div>

          {/* Primary CTA */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={phase === "loading"}
            className="w-full h-14 mt-4 rounded-2xl bg-[var(--color-purple-600)] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-[0_18px_40px_-12px_rgb(94_31_168_/_0.6)] disabled:opacity-80 transition"
          >
            <AnimatePresence mode="wait">
              {phase === "loading" && provider === "email" ? (
                <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in…
                </motion.span>
              ) : (
                <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Sign in
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="relative py-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-[var(--color-line)]" /></div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[var(--color-bg)] text-[12px] font-semibold tracking-wider text-[var(--color-mute)] uppercase">
                or continue with
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <OAuthButton
              label="Google"
              loading={phase === "loading" && provider === "google"}
              onClick={() => submit("google")}
            >
              <GoogleIcon />
            </OAuthButton>
            <OAuthButton
              label="Microsoft"
              loading={phase === "loading" && provider === "microsoft"}
              onClick={() => submit("microsoft")}
            >
              <MicrosoftIcon />
            </OAuthButton>
          </div>
        </motion.form>

        <p className="mt-10 text-center text-[11px] text-[var(--color-mute)] leading-relaxed">
          By continuing you agree to ParQ&apos;s <button className="underline underline-offset-2">Terms</button> and <button className="underline underline-offset-2">Privacy Policy</button>.
        </p>
        <div className="safe-bottom" />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block px-1.5 mb-1.5 text-[12px] font-semibold tracking-wide text-[var(--color-ink-soft)] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function OAuthButton({
  label,
  children,
  loading,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className="h-14 rounded-2xl bg-white border border-[var(--color-line)] hover:border-[var(--color-purple-300)] text-[var(--color-ink)] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-[var(--shadow-soft)] transition disabled:opacity-70"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      {!loading && <span>{label}</span>}
    </motion.button>
  );
}

function LogoSlot() {
  // Falls back to a brand mark if /public/logo.svg isn't present.
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-700)] shadow-[var(--shadow-soft)] flex items-center justify-center">
        <Image
          src={asset("/logo.svg")}
          alt="ParQ"
          width={36}
          height={36}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          unoptimized
        />
        <span className="absolute text-white font-display font-extrabold text-[18px] tracking-tighter">P</span>
      </div>
      <span className="wordmark text-[22px]">ParQ</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8c1.8-4.4 6-7.5 11.1-7.5 3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.4 4 9.8 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.5 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2c-.4.3 6.7-4.9 6.7-14.8 0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F35325" />
      <rect x="12" y="1" width="10" height="10" fill="#81BC06" />
      <rect x="1" y="12" width="10" height="10" fill="#05A6F0" />
      <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
    </svg>
  );
}
