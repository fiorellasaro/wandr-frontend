import { Link, useNavigate, useOutletContext } from "react-router-dom";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { useDemoApp } from "@/features/demo/DemoAppContext";
import type { StrandOutletContext } from "@/pages/StrandShellPage";

export function OverlapsSheetRoute() {
  const navigate = useNavigate();
  const { overlap } = useOutletContext<StrandOutletContext>();
  const { state, toggleMeetups } = useDemoApp();

  if (!overlap) {
    return null;
  }

  return (
    <BottomSheet
      eyebrow="Strand overlap detected"
      onClose={() => navigate("..", { relative: "path" })}
      title="Wandrers nearby"
      footer={
        <>
          <div className="toggle-row toggle-row--sheet">
            <span>
              <strong>Open to meeting wandrers</strong>
              <small>Mock toggle for MVP social consent.</small>
            </span>
            <input
              checked={state.meetupsEnabled}
              onChange={() => toggleMeetups()}
              type="checkbox"
            />
          </div>
        </>
      }
    >
      <div className="detail-stack">
        <p className="detail-stack__body">{overlap.matchCopy}</p>
        <div className="info-banner info-banner--soft">
          <span>
            Overlap at <strong>{overlap.stopName}</strong> · {overlap.timeWindow}
          </span>
        </div>
        <div className="card-list">
          {overlap.wandrers.map((wandrer) => (
            <article className="profile-card" key={wandrer.id}>
              <div className={`avatar avatar--${wandrer.avatarTone}`}>
                {wandrer.initials}
              </div>
              <div className="profile-card__body">
                <div className="profile-card__header">
                  <h3>{wandrer.name}</h3>
                  <span>{Math.round(wandrer.matchScore * 100)}%</span>
                </div>
                <p className="profile-card__meta">{wandrer.meta}</p>
                <div className="tag-row tag-row--compact">
                  {wandrer.vibeTags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                className="button button--ghost button--small"
                to={`../wandrer/${wandrer.id}`}
              >
                View
              </Link>
            </article>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
