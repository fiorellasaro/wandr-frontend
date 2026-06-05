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
  _stop: ItineraryStop,
  index: number,
  total: number,
) {
  void index;
  void total;
  return [
    { label: "Check in", tone: "primary" },
    { label: "Skip", tone: "skip" },
  ] satisfies StrandDetailAction[];
}
