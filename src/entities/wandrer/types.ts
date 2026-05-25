export type PreviewStopState = "done" | "match" | "upcoming";

export interface WandrerPreviewStop {
  timeLabel: string;
  name: string;
  district: string;
  state: PreviewStopState;
}

export interface WandrerProfile {
  id: string;
  initials: string;
  avatarTone: "ink" | "oak" | "marine";
  name: string;
  meta: string;
  vibeTags: string[];
  overlapReason: string;
  currentStopLabel: string;
  timeWindow: string;
  matchScore: number;
  mutualNod: boolean;
  meetupStop: {
    name: string;
    detail: string;
  };
  strandPreview: WandrerPreviewStop[];
}

export interface ItineraryOverlap {
  id: string;
  itineraryId: string;
  stopName: string;
  timeWindow: string;
  count: number;
  matchCopy: string;
  wandrers: WandrerProfile[];
}
