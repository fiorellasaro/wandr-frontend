import type { Itinerary } from "@/entities/itinerary/types";

import { formatDistance, formatRating } from "@/shared/lib/format";

interface StrandSummaryProps {
  itinerary: Itinerary;
  showVisitedBanner: boolean;
}

export function StrandSummary({
  itinerary,
  showVisitedBanner,
}: StrandSummaryProps) {
  return (
    <section className="strand-summary">
      {showVisitedBanner ? (
        <div className="info-banner">
          <span>1 stop already visited and deprioritized in future replans.</span>
        </div>
      ) : null}
      <div className="strand-summary__eyebrow">
        <span>{itinerary.themeSource}</span>
        <span>{itinerary.vibe}</span>
      </div>
      <h1 className="strand-summary__title">{itinerary.title}</h1>
      <p className="strand-summary__body">{itinerary.description}</p>
      <div className="stats-row">
        <div className="stats-row__item">
          <strong>{itinerary.stats.stopCount}</strong>
          <span>stops</span>
        </div>
        <div className="stats-row__item">
          <strong>{formatDistance(itinerary.stats.totalDistanceKm)}</strong>
          <span>total</span>
        </div>
        <div className="stats-row__item">
          <strong>~{itinerary.stats.totalDurationHours}h</strong>
          <span>window</span>
        </div>
        <div className="stats-row__item">
          <strong>{formatRating(itinerary.stats.averageRating)} ★</strong>
          <span>avg</span>
        </div>
      </div>
      <div className="tag-row">
        {itinerary.summaryTags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <p className="source-note">
        <strong>Landmark stops</strong> are modeled as Google Places-verified
        anchors with hours, ratings and walking logic. That keeps the MVP
        deterministic while the social layer stays mock-driven.
      </p>
    </section>
  );
}
