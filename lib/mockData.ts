export type GarageStatus = "plenty" | "limited" | "full";

export interface Garage {
  id: string;
  name: string;
  shortName: string;
  campus: string;
  street: string;
  permitZone: "Pink" | "Orange" | "Yellow" | "Silver" | "Visitor";
  floors: number;
  /** 0..1 occupancy per floor (index 0 = floor 1) */
  floorOccupancy: number[];
  displaySpots: number;
  totalSpots: number;
  /** Real lat/lng for the Leaflet map */
  lat: number;
  lng: number;
}

export interface ScheduleClass {
  id: string;
  code: string;
  name: string;
  category: "SCIENCE" | "COMM" | "ARTS" | "SOCIAL" | "LOGIC";
  days: string;
  startTime: string;
  endTime: string;
  location: string;
  recommendedGarageId: string;
}

export interface ParqAlert {
  id: string;
  kind: "warning" | "success" | "info" | "system";
  title: string;
  body: string;
  minutesAgo: number;
  isNew?: boolean;
}

export const currentUser = {
  name: "Alex Cane",
  email: "alex@miami.edu",
  permit: "Pink Zone",
  classOf: 2027,
  spotsSaved: 47,
  hoursSaved: 9.4,
  ticketsAvoided: 3,
  permitExpiry: "May 2026",
};

/**
 * Real University of Miami Coral Gables campus parking garages.
 * Coordinates are approximate (within campus footprint).
 * Spot counts are mock data for the demo.
 */
export const garages: Garage[] = [
  {
    id: "pavia",
    name: "Pavia Garage",
    shortName: "Pavia",
    campus: "Coral Gables Campus",
    street: "1230 Stanford Drive",
    permitZone: "Pink",
    floors: 6,
    floorOccupancy: [0.95, 0.87, 0.72, 0.41, 0.65, 0.58],
    displaySpots: 7,
    totalSpots: 320,
    lat: 25.7197,
    lng: -80.2782,
  },
  {
    id: "mahoney",
    name: "Mahoney/Pearson Garage",
    shortName: "Mahoney",
    campus: "Coral Gables Campus",
    street: "1101 Stanford Drive",
    permitZone: "Orange",
    floors: 5,
    floorOccupancy: [0.62, 0.58, 0.71, 0.49, 0.55],
    displaySpots: 32,
    totalSpots: 220,
    lat: 25.7223,
    lng: -80.2818,
  },
  {
    id: "merrick",
    name: "Merrick Garage",
    shortName: "Merrick",
    campus: "Coral Gables Campus",
    street: "1551 Brescia Avenue",
    permitZone: "Pink",
    floors: 5,
    floorOccupancy: [0.88, 0.74, 0.55, 0.62, 0.81],
    displaySpots: 5,
    totalSpots: 240,
    lat: 25.7180,
    lng: -80.2811,
  },
  {
    id: "ponce",
    name: "Ponce de Leon Garage",
    shortName: "Ponce",
    campus: "Coral Gables Campus",
    street: "1535 Levante Avenue",
    permitZone: "Yellow",
    floors: 4,
    floorOccupancy: [1.0, 0.99, 0.97, 0.96],
    displaySpots: 0,
    totalSpots: 180,
    lat: 25.7160,
    lng: -80.2785,
  },
  {
    id: "stanford",
    name: "Stanford Residential Garage",
    shortName: "Stanford",
    campus: "Coral Gables Campus",
    street: "1200 Stanford Drive",
    permitZone: "Silver",
    floors: 4,
    floorOccupancy: [0.55, 0.48, 0.62, 0.40],
    displaySpots: 38,
    totalSpots: 180,
    lat: 25.7211,
    lng: -80.2780,
  },
];

export function statusForGarage(g: Garage): GarageStatus {
  if (g.displaySpots <= 1) return "full";
  if (g.displaySpots <= 12) return "limited";
  return "plenty";
}

export function openSpotsForGarage(g: Garage): number {
  return g.displaySpots;
}

export function bestFloorForGarage(g: Garage): number {
  let best = 0;
  let lowest = 1;
  g.floorOccupancy.forEach((o, i) => {
    if (o < lowest) {
      lowest = o;
      best = i;
    }
  });
  return best + 1;
}

export const schedule: ScheduleClass[] = [
  {
    id: "bil150",
    code: "BIL 150",
    name: "General Biology",
    category: "SCIENCE",
    days: "MWF",
    startTime: "09:00 AM",
    endTime: "10:15 AM",
    location: "Cox Science Center",
    recommendedGarageId: "mahoney",
  },
  {
    id: "cim101",
    code: "CIM 101",
    name: "Intro to Communication",
    category: "COMM",
    days: "TR",
    startTime: "11:00 AM",
    endTime: "12:15 PM",
    location: "Wolfson Building",
    recommendedGarageId: "pavia",
  },
  {
    id: "eng215",
    code: "ENG 215",
    name: "American Literature",
    category: "ARTS",
    days: "MWF",
    startTime: "01:30 PM",
    endTime: "02:45 PM",
    location: "Ashe Building",
    recommendedGarageId: "pavia",
  },
  {
    id: "psy101",
    code: "PSY 101",
    name: "Intro to Psychology",
    category: "SOCIAL",
    days: "TR",
    startTime: "03:30 PM",
    endTime: "04:45 PM",
    location: "Flipse Building",
    recommendedGarageId: "merrick",
  },
  {
    id: "mth162",
    code: "MTH 162",
    name: "Calculus II",
    category: "LOGIC",
    days: "MWF",
    startTime: "05:00 PM",
    endTime: "06:15 PM",
    location: "Ungar Building",
    recommendedGarageId: "mahoney",
  },
];

export const initialAlerts: ParqAlert[] = [
  {
    id: "a1",
    kind: "warning",
    title: "Pavia Garage Level 3 Full",
    body: "Access to Level 3 is currently restricted. Divert to Level 4 or 5.",
    minutesAgo: 2,
    isNew: true,
  },
  {
    id: "a2",
    kind: "success",
    title: "Parked Confirmed",
    body: "Your vehicle is secured in Stanford Garage, Spot #42.",
    minutesAgo: 15,
    isNew: true,
  },
  {
    id: "a3",
    kind: "info",
    title: "Sunset Orange Zone Access",
    body: "Your temporary permit expires in 2 hours. Tap to renew.",
    minutesAgo: 60,
    isNew: true,
  },
  {
    id: "a4",
    kind: "system",
    title: "Lakeside Village Opening",
    body: "Construction complete. 200 new spaces now available for Silver permits.",
    minutesAgo: 180,
  },
];

export const morningInsight = {
  title: "Morning Insight",
  body: "Pink Zone permits 12% more available today than usual. Consider adjusting your commute.",
};

export const upcomingParkings = [
  {
    label: "TOMORROW · 8:30 AM",
    location: "Merrick Garage — Level 2",
    garageId: "merrick",
  },
];

/** UM Coral Gables campus center for the map */
export const CAMPUS_CENTER: [number, number] = [25.7195, -80.2796];

/** Returns a small wobble for live-updating occupancy */
export function wobble(seed: number): number {
  const t = Date.now() / 1000;
  return Math.sin(t * 0.7 + seed) * 0.03 + Math.sin(t * 0.21 + seed * 2) * 0.012;
}

/** Build a Google Maps directions deeplink to a garage */
export function directionsUrl(g: Garage): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${g.lat},${g.lng}&travelmode=driving`;
}
