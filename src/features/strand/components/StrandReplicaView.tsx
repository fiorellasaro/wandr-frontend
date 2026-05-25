import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Itinerary, ItineraryStop } from "@/entities/itinerary/types";
import type { ItineraryOverlap } from "@/entities/wandrer/types";

import { StrandReplicaCanvas, type StrandReplicaStop } from "@/features/strand/components/StrandReplicaCanvas";
import {
  StrandReplicaDetailPanel,
  type StrandDetailActionLabel,
} from "@/features/strand/components/StrandReplicaDetailPanel";
import {
  getStopDetailActions,
  getStopDistToNext,
} from "@/features/strand/lib/stopDetail";

import "@/features/strand/strandReplica.css";

interface StrandReplicaViewProps {
  itinerary: Itinerary;
  overlap: ItineraryOverlap | null;
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

function toCanvasStops(stops: ItineraryStop[]) {
  return stops.map((stop, index): StrandReplicaStop => {
    const next = stops[index + 1];
    const state =
      stop.state === "done"
        ? "done"
        : stop.state === "active"
          ? "active"
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

  const canvasStops = toCanvasStops(itinerary.stops);
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

  const initials = overlap?.wandrers.slice(0, 3).map((wandrer) => wandrer.initials) ?? ["M", "S", "R"];

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
            <div className="strand-replica__loc">
              <div className="strand-replica__loc-dot" />
              {itinerary.startLabel}
            </div>
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
            <Link className="strand-replica__wandrer-nudge" to="overlaps">
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
