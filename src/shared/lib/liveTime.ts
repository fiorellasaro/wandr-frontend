import type { Itinerary, ItineraryStop } from "@/entities/itinerary/types";
import type { ItineraryOverlap, WandrerProfile } from "@/entities/wandrer/types";

export function formatCurrentTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function isNowPrefixed(label: string) {
  return /^now\b/i.test(label.trim());
}

function replaceLiveNowText(value: string, currentTime: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  if (isNowPrefixed(trimmed)) {
    return `Now · ${currentTime}`;
  }

  if (/·\s*now\s*·/i.test(trimmed)) {
    return trimmed.replace(/·\s*now\s*·/i, `· ${currentTime} ·`);
  }

  if (/\bright now\b/i.test(trimmed)) {
    return trimmed.replace(/\bright now\b/i, currentTime);
  }

  return value;
}

function withLiveStopTime(stop: ItineraryStop, currentTime: string): ItineraryStop {
  if (stop.state !== "active" && !isNowPrefixed(stop.timeLabel)) {
    return stop;
  }

  return {
    ...stop,
    timeLabel: `Now · ${currentTime}`,
  };
}

export function withLiveItineraryTime(itinerary: Itinerary, date = new Date()) {
  const currentTime = formatCurrentTime(date);

  return {
    ...itinerary,
    overlapSubhead: replaceLiveNowText(itinerary.overlapSubhead, currentTime),
    stops: itinerary.stops.map((stop) => withLiveStopTime(stop, currentTime)),
  } satisfies Itinerary;
}

function withLiveWandrerTime(wandrer: WandrerProfile, currentTime: string) {
  return {
    ...wandrer,
    timeWindow: replaceLiveNowText(wandrer.timeWindow, currentTime),
    strandPreview: wandrer.strandPreview.map((stop) => ({
      ...stop,
      timeLabel:
        stop.state === "match" && isNowPrefixed(stop.timeLabel)
          ? `Now · ${currentTime}`
          : stop.timeLabel,
    })),
  } satisfies WandrerProfile;
}

export function withLiveOverlapTime(overlap: ItineraryOverlap, date = new Date()) {
  const currentTime = formatCurrentTime(date);

  return {
    ...overlap,
    timeWindow: replaceLiveNowText(overlap.timeWindow, currentTime),
    wandrers: overlap.wandrers.map((wandrer) =>
      withLiveWandrerTime(wandrer, currentTime),
    ),
  } satisfies ItineraryOverlap;
}

export function withLiveWandrerProfileTime(
  wandrer: WandrerProfile,
  date = new Date(),
) {
  return withLiveWandrerTime(wandrer, formatCurrentTime(date));
}
