"use client";

import dynamic from "next/dynamic";

interface LiveMapProps {
  highlight?: string;
  height?: number | string;
  zoom?: number;
  interactive?: boolean;
}

/**
 * Leaflet must load on the client only — Next.js static export friendly via dynamic import.
 */
export const LiveMap = dynamic(() => import("./LiveMapInner").then((m) => m.LiveMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 animate-pulse" />
  ),
}) as React.ComponentType<LiveMapProps>;
