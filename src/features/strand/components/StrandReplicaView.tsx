import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Itinerary, ItineraryStop } from "@/entities/itinerary/types";
import type { ItineraryOverlap } from "@/entities/wandr/types";

import { StrandReplicaCanvas, type StrandReplicaStop } from "@/features/strand/components/StrandReplicaCanvas";
import {
  StrandReplicaDetailPanel,
  type StrandDetailActionLabel,
} from "@/features/strand/components/StrandReplicaDetailPanel";
import {
  getStopDetailActions,
  getStopDistToNext,
} from "@/features/strand/lib/stopDetail";

import "@/features/strand/strandReplica.scss";

interface StrandReplicaViewProps {
  itinerary: Itinerary;
  overlap: ItineraryOverlap | null;
  currentDate: Date;
  showVisitedBanner: boolean;
  onReplan: () => void;
  onCheckIn: (stopId: string) => void;
  isReplanning: boolean;
  replanSignal: number;
  pulseSignal: number;
}

function mapSummaryTag(tag: string) {
  const normalized = tag.toLowerCase();

  if (normalized.includes("museum")) {
    return "🎨 Museums";
  }

  if (normalized.includes("no food")) {
    return "⟂ No food";
  }

  if (normalized.includes("snack") || normalized.includes("coffee")) {
    return "☕ Snack / coffee only";
  }

  if (
    normalized.includes("meal") ||
    normalized.includes("lunch") ||
    normalized.includes("food")
  ) {
    return "🍽 Meal stop";
  }

  if (normalized.includes("walk")) {
    return "🚶 Walkable";
  }

  return tag;
}

function parseTimeLabelMinutes(label: string) {
  const matches = Array.from(label.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi));
  const match = matches.at(-1);

  if (!match) {
    return null;
  }

  const [, hourValue, minuteValue = "0", periodValue] = match;
  const period = periodValue.toUpperCase();
  let hour = Number.parseInt(hourValue, 10);
  const minute = Number.parseInt(minuteValue, 10);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  } else if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  return hour * 60 + minute;
}

function normalizeStopMinutes(stops: ItineraryStop[]) {
  let dayOffset = 0;
  let previous = -Infinity;

  return stops.map((stop) => {
    const minutes = parseTimeLabelMinutes(stop.timeLabel);

    if (minutes === null) {
      return null;
    }

    let normalized = minutes + dayOffset;

    while (normalized < previous) {
      dayOffset += 24 * 60;
      normalized = minutes + dayOffset;
    }

    previous = normalized;

    return normalized;
  });
}

function getClosestStopIndex(stops: ItineraryStop[], currentDate: Date) {
  const stopMinutes = normalizeStopMinutes(stops);
  const validMinutes = stopMinutes.filter((minutes) => minutes !== null);

  if (validMinutes.length === 0) {
    return stops.findIndex((stop) => stop.state === "active");
  }

  const firstStopMinutes = validMinutes[0];
  const lastStopMinutes = validMinutes[validMinutes.length - 1];
  let currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  while (currentMinutes < firstStopMinutes - 12 * 60) {
    currentMinutes += 24 * 60;
  }

  while (currentMinutes > lastStopMinutes + 12 * 60) {
    currentMinutes -= 24 * 60;
  }

  return stopMinutes.reduce(
    (closest, minutes, index) => {
      if (minutes === null) {
        return closest;
      }

      const distance = Math.abs(minutes - currentMinutes);

      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: -1, distance: Number.POSITIVE_INFINITY },
  ).index;
}

function toCanvasStops(stops: ItineraryStop[], currentDate: Date) {
  const closestStopIndex = getClosestStopIndex(stops, currentDate);

  return stops.map((stop, index): StrandReplicaStop => {
    const next = stops[index + 1];
    const state =
      index === closestStopIndex
        ? "active"
        : stop.state === "done"
        ? "done"
        : stop.openState === "LIMITED"
          ? "warn"
          : "upcoming";
    const walkIn =
      stop.tags.some((tag) => tag.label.toLowerCase().includes("walk-in")) ||
      stop.tier === "LANDMARK";

    return {
      id: stop.id,
      name: stop.name,
      district: stop.district,
      time: stop.timeLabel,
      rating: stop.rating,
      reviewCount: stop.reviewCount,
      walkIn,
      duration: stop.durationMinutes,
      desc: stop.description,
      distToNext: next
        ? `${next.distanceFromPreviousKm.toFixed(1)} km · ${next.walkMinutesFromPrevious} min walk`
        : null,
      state,
    };
  });
}

export function StrandReplicaView({
  itinerary,
  overlap,
  currentDate,
  showVisitedBanner,
  onReplan,
  onCheckIn,
  isReplanning,
  replanSignal,
  pulseSignal,
}: StrandReplicaViewProps) {
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedStopIndex((current) => {
      if (current === null) {
        return current;
      }

      return Math.min(current, itinerary.stops.length - 1);
    });
  }, [itinerary]);

  const canvasStops = toCanvasStops(itinerary.stops, currentDate);
  const matchStopIndex = overlap
    ? Math.max(
        0,
        itinerary.stops.findIndex((stop) => stop.name === overlap.stopName),
      )
    : 1;
  const selectedStop = selectedStopIndex !== null ? itinerary.stops[selectedStopIndex] : null;
  const selectedStopDistToNext =
    selectedStopIndex !== null
      ? getStopDistToNext(itinerary.stops, selectedStopIndex)
      : null;
  const selectedActions =
    selectedStopIndex !== null && selectedStop
      ? getStopDetailActions(selectedStop, selectedStopIndex, itinerary.stops.length)
      : [];

  const initials = overlap?.wandrs.slice(0, 3).map((wandr) => wandr.initials) ?? ["M", "S", "R"];

  const handleDetailAction = (action: StrandDetailActionLabel) => {
    if (!selectedStop) {
      return;
    }

    if (action === "Check in") {
      onCheckIn(selectedStop.id);
      setSelectedStopIndex(null);
      return;
    }

    if (action === "Navigate") {
      window.open(selectedStop.mapUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (action === "Keep it") {
      setSelectedStopIndex(null);
      return;
    }

    if (action === "Skip" || action === "Swap") {
      setSelectedStopIndex(null);
      onReplan();
    }
  };

  return (
    <>
      <div className="strand-replica">
        <div className="strand-replica__app">
          <header className="strand-replica__header">
            <h1 className="strand-replica__wordmark">WANDR</h1>
            <Link className="strand-replica__loc" to="/profile" aria-label="Open profile">
              <div className="strand-replica__loc-dot" />
              Profile
            </Link>
          </header>

          <div className="strand-replica__status-row">
            <div className="strand-replica__day-label">{itinerary.dateLabel}</div>
            <button
              className="strand-replica__replan-btn"
              disabled={isReplanning}
              onClick={onReplan}
              type="button"
            >
              ⟳ Replan
            </button>
          </div>

          <div className="strand-replica__itin-desc">
            {showVisitedBanner ? (
              <div className="strand-replica__visited-banner">
                <span className="strand-replica__visited-banner-text">
                  ◎ 1 stop already visited — excluded from strand
                </span>
                <button
                  className="strand-replica__visited-banner-btn"
                  disabled={isReplanning}
                  onClick={onReplan}
                  type="button"
                >
                  Refresh options →
                </button>
              </div>
            ) : null}

            <div className="strand-replica__theme-eyebrow">
              <span className="strand-replica__theme-detected">◈ Theme detected</span>
              <span className="strand-replica__theme-vibe">{itinerary.vibe}</span>
            </div>

            <h2 className="strand-replica__itin-title">{itinerary.title}</h2>
            <p className="strand-replica__itin-body">{itinerary.description}</p>

            <div className="strand-replica__itin-meta">
              <div className="strand-replica__itin-stat">
                <strong>{itinerary.stats.stopCount}</strong> stops
              </div>
              <div className="strand-replica__itin-stat">
                <strong>{itinerary.stats.totalDistanceKm.toFixed(1)} km</strong> total
              </div>
              <div className="strand-replica__itin-stat">
                <strong>~{itinerary.stats.totalDurationHours} hrs</strong>
              </div>
              <div className="strand-replica__itin-stat">
                <strong>{itinerary.stats.averageRating.toFixed(1)} ★</strong> avg
              </div>
            </div>

            <div className="strand-replica__theme-tags">
              {itinerary.summaryTags.map((tag) => (
                <span className="strand-replica__theme-tag" key={tag}>
                  {mapSummaryTag(tag)}
                </span>
              ))}
            </div>

            <div className="strand-replica__source-note">
              <strong>◇ Landmark stops</strong> are sourced from Google Places and
              verified for opening hours and walk-in access. Wandr knows what
              exists — not what&apos;s best right now.
            </div>
          </div>

          <button className="strand-replica__upsell-strip" type="button">
            <div className="strand-replica__upsell-left">
              <div className="strand-replica__upsell-label">◈ Wandr Local</div>
              <div className="strand-replica__upsell-text">
                Unlock underground picks from verified locals
              </div>
            </div>
            <div className="strand-replica__upsell-cta">Upgrade →</div>
          </button>

          {overlap ? (
            <Link className="strand-replica__wandr-nudge" to="overlaps">
              <div className="strand-replica__nudge-avatars">
                {initials.map((initial, index) => (
                  <div
                    className={`strand-replica__nudge-avatar${index === 1 ? " strand-replica__nudge-avatar--alt1" : ""}${index === 2 ? " strand-replica__nudge-avatar--alt2" : ""}`}
                    key={`${initial}-${index}`}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div className="strand-replica__nudge-body">
                <div className="strand-replica__nudge-title">{itinerary.overlapLabel}</div>
                <div className="strand-replica__nudge-sub">{itinerary.overlapSubhead}</div>
              </div>
              <div className="strand-replica__nudge-cta">View →</div>
            </Link>
          ) : null}

          <div className="strand-replica__legend">
            <div className="strand-replica__leg">
              <div className="strand-replica__leg-line strand-replica__leg-line--faded" />
              Done
            </div>
            <div className="strand-replica__leg">
              <div className="strand-replica__leg-line" />
              Now
            </div>
            <div className="strand-replica__leg">
              <div className="strand-replica__leg-line strand-replica__leg-line--dashed" />
              Upcoming
            </div>
          </div>

          <div className="strand-replica__dna-wrap">
            <StrandReplicaCanvas
              currentDate={currentDate}
              matchStopIndex={matchStopIndex}
              onSelectStop={setSelectedStopIndex}
              pulseSignal={pulseSignal}
              replanSignal={replanSignal}
              selectedStopIndex={selectedStopIndex}
              stops={canvasStops}
            />
          </div>
        </div>
      </div>

      <StrandReplicaDetailPanel
        actions={selectedActions}
        distToNext={selectedStopDistToNext}
        onAction={handleDetailAction}
        onClose={() => setSelectedStopIndex(null)}
        stop={selectedStop}
      />

      <div
        className={`strand-replica__morph-overlay${isReplanning ? " strand-replica__morph-overlay--open" : ""}`}
      >
        <div className="strand-replica__morph-label">REWEAVING</div>
        <div className="strand-replica__morph-sub">adapting your strand</div>
      </div>
    </>
  );
}
