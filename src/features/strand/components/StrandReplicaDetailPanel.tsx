import type { ItineraryStop, TagTone } from "@/entities/itinerary/types";

export type StrandDetailActionLabel =
  | "Check in"
  | "Skip"
  | "Swap"
  | "Navigate"
  | "Keep it";

export interface StrandDetailAction {
  label: StrandDetailActionLabel;
  tone: "primary" | "skip" | "ghost";
}

interface StrandReplicaDetailPanelProps {
  stop: ItineraryStop | null;
  distToNext: string | null;
  actions: StrandDetailAction[];
  onClose: () => void;
  onAction: (action: StrandDetailActionLabel) => void;
}

function toTagClass(tone: TagTone) {
  if (tone === "positive") {
    return "strand-replica__ptag strand-replica__ptag--positive";
  }

  if (tone === "warning") {
    return "strand-replica__ptag strand-replica__ptag--warning";
  }

  return "strand-replica__ptag";
}

export function StrandReplicaDetailPanel({
  stop,
  distToNext,
  actions,
  onClose,
  onAction,
}: StrandReplicaDetailPanelProps) {
  const hidden = !stop;

  if (!stop) {
    return (
      <div className="strand-replica__detail-panel strand-replica__detail-panel--hidden">
        <button className="strand-replica__panel-drag" onClick={onClose} type="button" />
      </div>
    );
  }

  const fullStars = Math.floor(stop.rating);
  const halfStar = stop.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const walkIn = stop.tags.some((tag) => tag.label.toLowerCase().includes("walk-in")) || stop.tier === "LANDMARK";
  const visited = stop.state === "done";
  const isLocal = stop.tier === "LOCAL";

  return (
    <div
      className={`strand-replica__detail-panel${hidden ? " strand-replica__detail-panel--hidden" : ""}`}
    >
      <button className="strand-replica__panel-drag" onClick={onClose} type="button" />
      <div className="strand-replica__panel-time">{stop.timeLabel}</div>

      <div className="strand-replica__panel-name">
        <span
          className={`strand-replica__tier-badge${isLocal ? " strand-replica__tier-badge--local" : ""}`}
        >
          {isLocal ? "◈ Local" : "◇ Landmark"}
        </span>
        <span className="strand-replica__panel-name-text">{stop.name}</span>
      </div>

      <div className="strand-replica__panel-district">
        {stop.district}
        {walkIn ? <span className="strand-replica__panel-walkin">· Walk-in</span> : null}
        {visited ? <span className="strand-replica__panel-visited"> · Already visited</span> : null}
      </div>

      <div className="strand-replica__panel-rating">
        <div className="strand-replica__stars">
          {Array.from({ length: fullStars }).map((_, index) => (
            <div className="strand-replica__star strand-replica__star--filled" key={`full-${index}`} />
          ))}
          {halfStar ? <div className="strand-replica__star strand-replica__star--half" /> : null}
          {Array.from({ length: emptyStars }).map((_, index) => (
            <div className="strand-replica__star" key={`empty-${index}`} />
          ))}
        </div>
        <span className="strand-replica__rating-num">{stop.rating.toFixed(1)}</span>
        <span className="strand-replica__rating-count">
          ({stop.reviewCount.toLocaleString()} reviews)
        </span>
      </div>

      {distToNext ? <div className="strand-replica__panel-dist">↓ Next stop · {distToNext}</div> : null}

      <div className="strand-replica__panel-desc">{stop.description}</div>

      <div className="strand-replica__panel-tags">
        {stop.tags.map((tag) => (
          <span className={toTagClass(tag.tone)} key={tag.label}>
            {tag.label}
          </span>
        ))}
        <div className="strand-replica__panel-source">
          {isLocal ? (
            <>
              <strong>◈ Local pick</strong> — contributed by a verified local with
              expertise in this category. Hours and details may change — always
              check before heading over.
            </>
          ) : (
            <>
              <strong>◇ Landmark stop</strong> — sourced from Google Places.
              Opening hours and walk-in access verified. What Wandr can&apos;t tell
              you: whether it&apos;s the best right now.
            </>
          )}
        </div>
      </div>

      <div className="strand-replica__panel-actions">
        {actions.map((action) => (
          <button
            className={`strand-replica__pact${action.tone === "primary" ? " strand-replica__pact--primary" : ""}${action.tone === "skip" ? " strand-replica__pact--skip" : ""}`}
            key={action.label}
            onClick={() => onAction(action.label)}
            type="button"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
