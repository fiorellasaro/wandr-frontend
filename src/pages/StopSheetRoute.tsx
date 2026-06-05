import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { useDemoApp } from "@/features/demo/DemoAppContext";
import {
  StrandReplicaDetailPanel,
  type StrandDetailActionLabel,
} from "@/features/strand/components/StrandReplicaDetailPanel";
import {
  getStopDetailActions,
  getStopDistToNext,
} from "@/features/strand/lib/stopDetail";
import type { StrandOutletContext } from "@/pages/StrandShellPage";

export function StopSheetRoute() {
  const navigate = useNavigate();
  const { stopId = "" } = useParams();
  const { itinerary } = useOutletContext<StrandOutletContext>();
  const { markStopDone, markStopSkipped } = useDemoApp();
  const stopIndex = itinerary.stops.findIndex((item) => item.id === stopId);
  const stop = stopIndex >= 0 ? itinerary.stops[stopIndex] : null;

  if (!stop) {
    return null;
  }

  const actions = getStopDetailActions(stop, stopIndex, itinerary.stops.length);
  const distToNext = getStopDistToNext(itinerary.stops, stopIndex);
  const closePath = `/strand/${itinerary.id}`;

  const handleAction = (action: StrandDetailActionLabel) => {
    if (action === "Check in") {
      markStopDone(itinerary.id, stop.id);
      navigate(closePath);
      return;
    }

    if (action === "Skip") {
      markStopSkipped(itinerary.id, stop.id);
      navigate(closePath);
    }
  };

  return (
    <StrandReplicaDetailPanel
      actions={actions}
      distToNext={distToNext}
      onAction={handleAction}
      onClose={() => navigate(closePath)}
      stop={stop}
    />
  );
}
