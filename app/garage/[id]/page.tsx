import { notFound } from "next/navigation";
import { garages } from "@/lib/mockData";
import { GarageDetailClient } from "./client";

export function generateStaticParams() {
  return garages.map((g) => ({ id: g.id }));
}

export const dynamicParams = false;

export default async function GaragePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const garage = garages.find((g) => g.id === id);
  if (!garage) notFound();
  return <GarageDetailClient garage={garage} />;
}
