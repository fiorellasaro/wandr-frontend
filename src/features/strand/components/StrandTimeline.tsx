import { Link } from "react-router-dom";

import type { Itinerary } from "@/entities/itinerary/types";

import { formatDuration, formatRating } from "@/shared/lib/format";

interface StrandTimelineProps {
  itinerary: Itinerary;
}

interface Point {
  x: number;
  y: number;
}

function buildPath(points: Point[]) {
  if (points.length === 0) {
    return "";
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const controlY = (previous.y + current.y) / 2;

    path += ` C ${previous.x} ${controlY}, ${current.x} ${controlY}, ${current.x} ${current.y}`;
  }

  return path;
}

export function StrandTimeline({ itinerary }: StrandTimelineProps) {
  const rowHeight = 168;
  const viewBoxWidth = 360;
  const centerX = 180;
  const amplitude = 70;
  const topPadding = 60;
  const viewBoxHeight = topPadding * 2 + rowHeight * (itinerary.stops.length - 1);

  const leftPoints = itinerary.stops.map((_, index) => {
    const ratio =
      itinerary.stops.length === 1 ? 0 : index / (itinerary.stops.length - 1);
    const wave = Math.sin(ratio * Math.PI * 1.6 + 0.3);
    return {
      x: centerX - amplitude * wave,
      y: topPadding + index * rowHeight,
    };
  });

  const rightPoints = itinerary.stops.map((_, index) => {
    const ratio =
      itinerary.stops.length === 1 ? 0 : index / (itinerary.stops.length - 1);
    const wave = Math.sin(ratio * Math.PI * 1.6 + 0.3);
    return {
      x: centerX + amplitude * wave,
      y: topPadding + index * rowHeight,
    };
  });

  return (
    <section className="strand-timeline">
      <div className="strand-legend">
        <span>Done</span>
        <span>Now</span>
        <span>Upcoming</span>
      </div>

      <div className="strand-timeline__canvas">
        <svg
          aria-hidden="true"
          className="strand-timeline__svg"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        >
          <path
            className="strand-timeline__rail strand-timeline__rail--solid"
            d={buildPath(leftPoints)}
          />
          <path
            className="strand-timeline__rail strand-timeline__rail--dashed"
            d={buildPath(rightPoints)}
          />

          {leftPoints.slice(0, -1).map((point, index) => {
            const nextLeft = leftPoints[index + 1];
            const nextRight = rightPoints[index + 1];
            const right = rightPoints[index];
            const rungOffsets = [0.25, 0.5, 0.75];

            return rungOffsets.map((offset) => {
              const y = point.y + (nextLeft.y - point.y) * offset;
              const xLeft = point.x + (nextLeft.x - point.x) * offset;
              const xRight = right.x + (nextRight.x - right.x) * offset;

              return (
                <line
                  className="strand-timeline__rung"
                  key={`${index}-${offset}`}
                  x1={xLeft}
                  x2={xRight}
                  y1={y}
                  y2={y}
                />
              );
            });
          })}
        </svg>

        <ol className="strand-list">
          {itinerary.stops.map((stop, index) => {
            const isLeft = index % 2 === 0;

            return (
              <li
                className={`strand-stop strand-stop--${isLeft ? "left" : "right"}`}
                key={stop.id}
              >
                <Link className="strand-stop__card" to={`stop/${stop.id}`}>
                  <span className="strand-stop__time">{stop.timeLabel}</span>
                  <h2 className="strand-stop__title">{stop.name}</h2>
                  <p className="strand-stop__meta">
                    {stop.district} · {stop.category.replaceAll("_", " ")}
                  </p>
                  <div className="strand-stop__stats">
                    <span>{formatRating(stop.rating)} ★</span>
                    <span>{formatDuration(stop.durationMinutes)}</span>
                    <span>{stop.openState.replaceAll("_", " ")}</span>
                  </div>
                  <div className="tag-row tag-row--compact">
                    {stop.tags.map((tag) => (
                      <span className={`tag tag--${tag.tone}`} key={tag.label}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </Link>

                <Link
                  aria-label={`Open ${stop.name}`}
                  className={`strand-stop__node strand-stop__node--${stop.state}`}
                  to={`stop/${stop.id}`}
                />

                {index < itinerary.stops.length - 1 ? (
                  <p className="strand-stop__distance">
                    {stop.distanceFromPreviousKm === 0
                      ? "start node"
                      : `${stop.distanceFromPreviousKm.toFixed(1)} km · ${stop.walkMinutesFromPrevious} min walk`}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
