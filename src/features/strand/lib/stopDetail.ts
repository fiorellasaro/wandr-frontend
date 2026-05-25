import type { ItineraryStop } from "@/entities/itinerary/types";

import type { StrandDetailAction } from "@/features/strand/components/StrandReplicaDetailPanel";

export function getStopDistToNext(stops: ItineraryStop[], index: number) {
  if (index < 0 || index >= stops.length - 1) {
    return null;
  }

  const nextStop = stops[index + 1];

  return `${nextStop.distanceFromPreviousKm.toFixed(1)} km · ${nextStop.walkMinutesFromPrevious} min walk`;
}

export function getStopDetailActions(
  stop: ItineraryStop,
  index: number,
  total: number,
) {
  if (stop.state === "done") {
    return [] as StrandDetailAction[];
  }

  if (index === total - 1) {
    return [
      { label: "Keep it", tone: "ghost" },
      { label: "Swap", tone: "skip" },
    ] satisfies StrandDetailAction[];
  }

  if (stop.category === "LOOKOUT" || stop.category === "LANDMARK") {
    return [
      { label: "Navigate", tone: "ghost" },
      { label: "Skip", tone: "skip" },
    ] satisfies StrandDetailAction[];
  }

  return [
    { label: "Check in", tone: "primary" },
    { label: "Skip", tone: "skip" },
  ] satisfies StrandDetailAction[];
}
