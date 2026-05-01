"use client";

import dynamic from "next/dynamic";
import type { Coord } from "@/lib/geolocation";
import type { Garage } from "@/lib/mockData";

interface RouteMapProps {
  user: Coord;
  garage: Garage;
}

export const RouteMap = dynamic(
  () => import("./RouteMapInner").then((m) => m.RouteMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 animate-pulse" />
    ),
  }
) as React.ComponentType<RouteMapProps>;
