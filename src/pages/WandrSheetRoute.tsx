import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { useDemoApp } from "@/features/demo/DemoAppContext";
import { mockWandrService } from "@/features/demo/mockWandrService";
import type { StrandOutletContext } from "@/pages/StrandShellPage";
import { withLiveWandrProfileTime } from "@/shared/lib/liveTime";

export function WandrSheetRoute() {
  const navigate = useNavigate();
  const { itinerary, now } = useOutletContext<StrandOutletContext>();
  const { wandrId = "" } = useParams();
  const { sendNod } = useDemoApp();
  const [matchUnlocked, setMatchUnlocked] = useState(false);
  const wandrData = mockWandrService.getWandr(itinerary.id, wandrId);
  const wandr = wandrData ? withLiveWandrProfileTime(wandrData, now) : null;
  const closeToOverlaps = () => navigate(`/strand/${itinerary.id}/overlaps`);

  if (!wandr) {
    return null;
  }

  return (
    <BottomSheet
      eyebrow="Compatible strand"
      onClose={closeToOverlaps}
      title={wandr.name}
      footer={
        <>
          <button
            className="button button--ghost"
            onClick={closeToOverlaps}
            type="button"
          >
            Back
          </button>
          <button
            className="button button--primary"
            onClick={() => {
              const result = sendNod(itinerary.id, wandr.id);
              setMatchUnlocked(result.matched);
            }}
            type="button"
          >
            Send nod
          </button>
        </>
      }
    >
      <div className="detail-stack">
        <div className="profile-lead">
          <div className={`avatar avatar--${wandr.avatarTone}`}>{wandr.initials}</div>
          <div>
            <p className="detail-stack__meta">{wandr.meta}</p>
            <div className="tag-row tag-row--compact">
              {wandr.vibeTags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="info-banner info-banner--soft">
          <span>
            {wandr.overlapReason} · {wandr.currentStopLabel} · {wandr.timeWindow}
          </span>
        </div>

        <p className="detail-stack__body">{wandr.bio}</p>

        <div className="profile-facts">
          {wandr.profileFacts.map((fact) => (
            <div className="profile-facts__row" key={fact.label}>
              <p className="profile-facts__label">{fact.label}</p>
              <p className="profile-facts__value">{fact.value}</p>
            </div>
          ))}
        </div>

        {matchUnlocked ? (
          <div className="info-banner">
            <span>
              Mutual nod unlocked · Suggested meetup at{" "}
              <strong>{wandr.meetupStop.name}</strong> · {wandr.meetupStop.detail}
            </span>
          </div>
        ) : null}
      </div>
    </BottomSheet>
  );
}
