import { Link, useOutletContext } from "react-router-dom";

import { useDemoApp } from "@/features/demo/DemoAppContext";
import type { StrandOutletContext } from "@/pages/StrandShellPage";

export function OverlapsSheetRoute() {
  const { overlap } = useOutletContext<StrandOutletContext>();
  const { state, toggleMeetups } = useDemoApp();

  if (!overlap) {
    return null;
  }

  return (
    <section className="page page--nearby">
      <header className="hero nearby-view__hero">
        <p className="hero__eyebrow">Strand overlap detected</p>
        <h1 className="hero__title">Wandrs nearby</h1>
      </header>

      <div className="detail-stack nearby-view__content">
        <p className="detail-stack__body">{overlap.matchCopy}</p>
        <div className="info-banner info-banner--soft">
          <span>
            Overlap at <strong>{overlap.stopName}</strong> · {overlap.timeWindow}
          </span>
        </div>
        <div className="card-list">
          {overlap.wandrs.map((wandr) => (
            <article className="profile-card" key={wandr.id}>
              <div className={`avatar avatar--${wandr.avatarTone}`}>
                {wandr.initials}
              </div>
              <div className="profile-card__body">
                <div className="profile-card__header">
                  <h3>{wandr.name}</h3>
                  <span>{Math.round(wandr.matchScore * 100)}%</span>
                </div>
                <p className="profile-card__meta">{wandr.meta}</p>
                <div className="tag-row tag-row--compact">
                  {wandr.vibeTags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                className="button button--ghost button--small"
                to={`../wandr/${wandr.id}`}
              >
                View
              </Link>
            </article>
          ))}
        </div>

        <div className="nearby-view__consent">
          <div className="toggle-row">
            <span>
              <strong>Open to meeting wandrs</strong>
              <small>Mock toggle for MVP social consent.</small>
            </span>
            <input
              checked={state.meetupsEnabled}
              onChange={() => toggleMeetups()}
              type="checkbox"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
