import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import type { Itinerary } from "@/entities/itinerary/types";
import type { ItineraryOverlap } from "@/entities/wandrer/types";

import { useDemoApp } from "@/features/demo/DemoAppContext";
import { mockWandrService } from "@/features/demo/mockWandrService";
import { StrandReplicaView } from "@/features/strand/components/StrandReplicaView";
import { withLiveItineraryTime, withLiveOverlapTime } from "@/shared/lib/liveTime";
import { Toast } from "@/features/strand/components/Toast";
import { useCurrentTime } from "@/shared/lib/useCurrentTime";

export interface StrandOutletContext {
  itinerary: Itinerary;
  overlap: ItineraryOverlap | null;
  now: Date;
}

export function StrandShellPage() {
  const { itineraryId = "" } = useParams();
  const { state, replanStrand, dismissToast, markStopDone } = useDemoApp();
  const [isReplanning, setIsReplanning] = useState(false);
  const [replanSignal, setReplanSignal] = useState(0);
  const [pulseSignal, setPulseSignal] = useState(0);
  const replanTimeoutRef = useRef<number | null>(null);
  const now = useCurrentTime();
  const itinerary = state.itineraries[itineraryId];
  const overlap = mockWandrService.getOverlap(itineraryId);

  useEffect(() => {
    return () => {
      if (replanTimeoutRef.current !== null) {
        window.clearTimeout(replanTimeoutRef.current);
      }
    };
  }, []);

  if (!itinerary) {
    return (
      <div className="page page--empty">
        <p className="hero__eyebrow">Route not found</p>
        <h1 className="hero__title">Generate a strand first.</h1>
        <Link className="button button--primary" to="/onboarding">
          Back to onboarding
        </Link>
      </div>
    );
  }

  const liveItinerary = useMemo(
    () => withLiveItineraryTime(itinerary, now),
    [itinerary, now],
  );
  const liveOverlap = useMemo(
    () => (overlap ? withLiveOverlapTime(overlap, now) : null),
    [overlap, now],
  );

  const handleReplan = () => {
    if (isReplanning) {
      return;
    }

    setIsReplanning(true);
    setReplanSignal((value) => value + 1);

    replanTimeoutRef.current = window.setTimeout(() => {
      replanStrand(itinerary.id);
      setIsReplanning(false);
      setPulseSignal((value) => value + 1);
      replanTimeoutRef.current = null;
    }, 2400);
  };

  return (
    <>
      <StrandReplicaView
        itinerary={liveItinerary}
        isReplanning={isReplanning}
        onCheckIn={(stopId) => markStopDone(itinerary.id, stopId)}
        onReplan={handleReplan}
        overlap={liveOverlap}
        pulseSignal={pulseSignal}
        replanSignal={replanSignal}
        showVisitedBanner={state.preferences.avoidVisited}
      />

      <Outlet
        context={{ itinerary: liveItinerary, overlap: liveOverlap, now } satisfies StrandOutletContext}
      />
      <Toast message={state.toastMessage} onDismiss={dismissToast} />
    </>
  );
}
