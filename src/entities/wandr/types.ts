export type PreviewStopState = "done" | "match" | "upcoming";

export interface WandrPreviewStop {
  timeLabel: string;
  name: string;
  district: string;
  state: PreviewStopState;
}

export interface WandrProfile {
  id: string;
  initials: string;
  avatarTone: "ink" | "oak" | "marine";
  name: string;
  meta: string;
  bio: string;
  profileFacts: Array<{
    label: string;
    value: string;
  }>;
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
  strandPreview: WandrPreviewStop[];
}

export interface ItineraryOverlap {
  id: string;
  itineraryId: string;
  stopName: string;
  timeWindow: string;
  count: number;
  matchCopy: string;
  wandrs: WandrProfile[];
}
