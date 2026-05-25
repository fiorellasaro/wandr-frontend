import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { useDemoApp } from "@/features/demo/DemoAppContext";
import { mockWandrService } from "@/features/demo/mockWandrService";
import type { StrandOutletContext } from "@/pages/StrandShellPage";
import { withLiveWandrerProfileTime } from "@/shared/lib/liveTime";

export function WandrerSheetRoute() {
  const navigate = useNavigate();
  const { itinerary, now } = useOutletContext<StrandOutletContext>();
  const { wandrerId = "" } = useParams();
  const { sendNod } = useDemoApp();
  const [matchUnlocked, setMatchUnlocked] = useState(false);
  const wandrerData = mockWandrService.getWandrer(itinerary.id, wandrerId);
  const wandrer = wandrerData ? withLiveWandrerProfileTime(wandrerData, now) : null;

  if (!wandrer) {
    return null;
  }

  return (
    <BottomSheet
      eyebrow="Compatible strand"
      onClose={() => navigate("..", { relative: "path" })}
      title={wandrer.name}
      footer={
        <>
          <button
            className="button button--ghost"
            onClick={() => navigate("..", { relative: "path" })}
            type="button"
          >
            Back
          </button>
          <button
            className="button button--primary"
            onClick={() => {
              const result = sendNod(itinerary.id, wandrer.id);
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
          <div className={`avatar avatar--${wandrer.avatarTone}`}>{wandrer.initials}</div>
          <div>
            <p className="detail-stack__meta">{wandrer.meta}</p>
            <div className="tag-row tag-row--compact">
              {wandrer.vibeTags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="info-banner info-banner--soft">
          <span>
            {wandrer.overlapReason} · {wandrer.currentStopLabel} · {wandrer.timeWindow}
          </span>
        </div>

        <div className="mini-strand">
          {wandrer.strandPreview.map((stop) => (
            <div className="mini-strand__row" key={`${wandrer.id}-${stop.timeLabel}-${stop.name}`}>
              <span className={`mini-strand__dot mini-strand__dot--${stop.state}`} />
              <div>
                <p className="mini-strand__time">{stop.timeLabel}</p>
                <p className="mini-strand__name">{stop.name}</p>
                <p className="mini-strand__district">{stop.district}</p>
              </div>
            </div>
          ))}
        </div>

        {matchUnlocked ? (
          <div className="info-banner">
            <span>
              Mutual nod unlocked · Suggested meetup at{" "}
              <strong>{wandrer.meetupStop.name}</strong> · {wandrer.meetupStop.detail}
            </span>
          </div>
        ) : null}
      </div>
    </BottomSheet>
  );
}
