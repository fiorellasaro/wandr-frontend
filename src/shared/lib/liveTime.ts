import type { Itinerary } from "@/entities/itinerary/types";
import type { ItineraryOverlap, WandrProfile } from "@/entities/wandr/types";

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

function stripLiveNowPrefix(label: string) {
  if (!isNowPrefixed(label)) {
    return label;
  }

  return label.replace(/^now\s*·\s*/i, "");
}

export function withLiveItineraryTime(itinerary: Itinerary, date = new Date()) {
  const currentTime = formatCurrentTime(date);

  return {
    ...itinerary,
    overlapSubhead: replaceLiveNowText(itinerary.overlapSubhead, currentTime),
    stops: itinerary.stops.map((stop) => ({
      ...stop,
      timeLabel: stripLiveNowPrefix(stop.timeLabel),
    })),
  } satisfies Itinerary;
}

function withLiveWandrTime(wandr: WandrProfile, currentTime: string) {
  return {
    ...wandr,
    timeWindow: replaceLiveNowText(wandr.timeWindow, currentTime),
    strandPreview: wandr.strandPreview.map((stop) => ({
      ...stop,
      timeLabel:
        stop.state === "match" && isNowPrefixed(stop.timeLabel)
          ? `Now · ${currentTime}`
          : stop.timeLabel,
    })),
  } satisfies WandrProfile;
}

export function withLiveOverlapTime(overlap: ItineraryOverlap, date = new Date()) {
  const currentTime = formatCurrentTime(date);

  return {
    ...overlap,
    timeWindow: replaceLiveNowText(overlap.timeWindow, currentTime),
    wandrs: overlap.wandrs.map((wandr) =>
      withLiveWandrTime(wandr, currentTime),
    ),
  } satisfies ItineraryOverlap;
}

export function withLiveWandrProfileTime(
  wandr: WandrProfile,
  date = new Date(),
) {
  return withLiveWandrTime(wandr, formatCurrentTime(date));
}
