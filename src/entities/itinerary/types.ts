import type { District, Interest } from "@/entities/onboarding/types";

export type ContentTier = "LANDMARK" | "LOCAL";

export type StopState = "done" | "skipped" | "active" | "upcoming" | "warning";

export type OpenState = "OPEN" | "LIMITED" | "CLOSED_SOON";

export type TagTone = "neutral" | "positive" | "warning" | "premium";

export interface StopTag {
  label: string;
  tone: TagTone;
}

export interface ItineraryStop {
  id: string;
  googlePlaceId: string;
  name: string;
  category: string;
  district: District;
  address: string;
  rating: number;
  reviewCount: number;
  openState: OpenState;
  timeLabel: string;
  durationMinutes: number;
  distanceFromPreviousKm: number;
  walkMinutesFromPrevious: number;
  description: string;
  state: StopState;
  tier: ContentTier;
  tags: StopTag[];
  mapUrl: string;
}

export interface ItineraryStats {
  totalDistanceKm: number;
  totalDurationHours: number;
  averageRating: number;
  stopCount: number;
}

export interface Itinerary {
  id: string;
  slug: string;
  city: string;
  districts: District[];
  title: string;
  vibe: string;
  description: string;
  themeSource: string;
  preferenceHighlights?: string[];
  generatedFor: Interest[];
  summaryTags: string[];
  startLabel: string;
  dateLabel: string;
  stats: ItineraryStats;
  overlapLabel: string;
  overlapSubhead: string;
  stops: ItineraryStop[];
}
