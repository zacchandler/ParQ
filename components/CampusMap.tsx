"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { garages, openSpotsForGarage, statusForGarage, type Garage } from "@/lib/mockData";

interface CampusMapProps {
  highlight?: string;
  variant?: "full" | "compact" | "thumb";
  showLegend?: boolean;
  showLabel?: string;
}

const statusFill: Record<string, string> = {
  plenty: "#10B981",
  limited: "#F59E0B",
  full: "#EF4444",
};

export function CampusMap({ highlight, variant = "full", showLegend = true, showLabel }: CampusMapProps) {
  const router = useRouter();
  const onSelect = (id: string) => router.push(`/garage/${id}`);
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#1a0d2e] border border-purple-200">
      <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4EEF8" />
            <stop offset="100%" stopColor="#E8DEF0" />
          </linearGradient>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4E9C5" />
            <stop offset="100%" stopColor="#B8D9A4" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A8D5E5" />
            <stop offset="100%" stopColor="#8BC4DC" />
          </linearGradient>
          <pattern id="dots" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.18" fill="#0006" />
          </pattern>
          <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
            <feOffset dy="0.4" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base */}
        <rect width="100" height="100" fill="url(#mapBg)" />

        {/* Grass parks */}
        <path d="M 0 0 L 22 0 L 28 12 L 18 22 L 6 18 Z" fill="url(#grass)" opacity="0.9" />
        <path d="M 78 4 L 100 6 L 100 22 L 84 24 L 76 14 Z" fill="url(#grass)" opacity="0.9" />
        <ellipse cx="50" cy="48" rx="8" ry="5" fill="url(#grass)" opacity="0.7" />
        <path d="M 0 78 L 14 74 L 24 86 L 16 100 L 0 100 Z" fill="url(#grass)" opacity="0.85" />

        {/* Water (Lake Osceola style) */}
        <path d="M 38 70 Q 48 64 60 70 Q 70 76 64 86 Q 54 92 42 86 Q 34 80 38 70 Z" fill="url(#water)" />
        <path d="M 38 70 Q 48 64 60 70 Q 70 76 64 86 Q 54 92 42 86 Q 34 80 38 70 Z" fill="none" stroke="#7AB5CC" strokeWidth="0.3" opacity="0.6" />

        {/* Roads */}
        <g stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="58" x2="100" y2="58" />
          <line x1="20" y1="0" x2="20" y2="100" />
          <line x1="58" y1="0" x2="58" y2="100" />
          <line x1="84" y1="0" x2="84" y2="100" />
        </g>
        <g stroke="#E8DEF0" strokeWidth="0.4" strokeDasharray="1.2 1.2" fill="none">
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="58" x2="100" y2="58" />
          <line x1="20" y1="0" x2="20" y2="100" />
          <line x1="58" y1="0" x2="58" y2="100" />
          <line x1="84" y1="0" x2="84" y2="100" />
        </g>

        {/* Buildings (UM-style blocks) */}
        <g fill="#C9B6D9" opacity="0.85">
          <rect x="24" y="44" width="10" height="10" rx="0.6" />
          <rect x="36" y="44" width="6" height="10" rx="0.6" />
          <rect x="44" y="44" width="11" height="10" rx="0.6" />
          <rect x="62" y="44" width="8" height="10" rx="0.6" />
          <rect x="72" y="44" width="10" height="10" rx="0.6" />
          <rect x="24" y="60" width="14" height="6" rx="0.6" />
          <rect x="62" y="60" width="10" height="6" rx="0.6" />
          <rect x="74" y="60" width="8" height="6" rx="0.6" />
        </g>

        {/* Highlighted building (Wolfson) */}
        <rect x="44" y="44" width="11" height="10" rx="0.6" fill="#A66DD2" />

        {/* "You are here" pulse */}
        <g transform="translate(50 50)">
          <circle r="2.6" fill="#3B82F6" />
          <circle r="2.6" fill="#3B82F6" opacity="0.4" className="pulse-ring origin-center" />
        </g>

        {/* Garage Pins */}
        {garages.map((g) => (
          <GaragePin key={g.id} garage={g} highlighted={highlight === g.id} variant={variant} onSelect={onSelect} />
        ))}

        {/* Subtle vignette */}
        <rect width="100" height="100" fill="url(#dots)" opacity="0.05" />
      </svg>

      {/* Top-right "Live" tag */}
      {variant !== "thumb" && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-status-green pulse-soft" style={{ background: "#10B981" }} />
          <span className="text-[10px] font-bold text-gray-700 tracking-wide">LIVE</span>
        </div>
      )}

      {/* Top-left View All */}
      {variant === "full" && (
        <Link
          href="/schedule"
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 shadow-sm text-[11px] font-bold text-purple-600 hover:bg-white"
        >
          View All
        </Link>
      )}

      {/* Bottom label */}
      {showLabel && (
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md">
          {showLabel}
        </div>
      )}

      {/* Legend */}
      {showLegend && variant === "full" && (
        <div className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/95 shadow-sm">
          <LegendDot color="#10B981" label="Plenty" />
          <LegendDot color="#F59E0B" label="Limited" />
          <LegendDot color="#EF4444" label="Full" />
        </div>
      )}
    </div>
  );
}

function GaragePin({ garage, highlighted, variant, onSelect }: { garage: Garage; highlighted: boolean; variant: string; onSelect: (id: string) => void }) {
  const status = statusForGarage(garage);
  const open = openSpotsForGarage(garage);
  const fill = statusFill[status];
  const isFull = status === "full";
  const labelText = isFull ? "Full" : `${open} spots`;

  return (
    <g transform={`translate(${garage.pinX} ${garage.pinY})`}>
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 + Math.random() * 0.25 }}
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(garage.id)}
      >
        {/* Floating label (above pin) */}
        {variant !== "thumb" && (
          <g transform="translate(0 -10)">
            <rect x="-13" y="-5" width="26" height="6.4" rx="3.2" fill={highlighted ? "#C9184A" : "white"} stroke="#0001" strokeWidth="0.15" />
            <text
              x="0"
              y="-0.5"
              textAnchor="middle"
              fontSize="3.2"
              fontWeight="700"
              fill={highlighted ? "white" : "#1A1A1A"}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {garage.shortName}
            </text>
          </g>
        )}
        {/* Pin shape */}
        <g filter="url(#pinShadow)">
          <path d="M 0 -7 C -3.6 -7 -6 -4.5 -6 -1.5 C -6 2 0 8 0 8 C 0 8 6 2 6 -1.5 C 6 -4.5 3.6 -7 0 -7 Z" fill={fill} />
          <circle cx="0" cy="-1.8" r="2" fill="white" />
        </g>
        {/* Spot count below */}
        {variant === "full" && (
          <g transform="translate(0 12)">
            <rect x="-9" y="-2.6" width="18" height="4.8" rx="2.4" fill="white" stroke="#0001" strokeWidth="0.15" />
            <text
              x="0"
              y="0.8"
              textAnchor="middle"
              fontSize="2.8"
              fontWeight="700"
              fill={fill}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {labelText}
            </text>
          </g>
        )}
      </motion.g>
    </g>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[9px] font-semibold text-gray-700">{label}</span>
    </span>
  );
}
