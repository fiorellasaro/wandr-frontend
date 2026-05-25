import type { Itinerary } from "@/entities/itinerary/types";
import type { FoodPreference, OnboardingPreferences } from "@/entities/onboarding/types";
import type { ItineraryOverlap, WandrerProfile } from "@/entities/wandrer/types";

import {
  defaultPreferences,
  foodPreferenceStopOverrides,
  overlapTemplates,
  itineraryTemplates,
  itineraryVariants,
} from "@/features/demo/mockCatalog";

const interestToItineraryId: Record<string, string> = {
  CULTURAL: "lima-cultural-barranco",
  FOODIE: "lima-foodie-barranco",
  URBANIST: "lima-urbanist-dual",
  BOHEMIAN: "lima-bohemian-barranco",
};

const interestToLabel: Record<string, string> = {
  CULTURAL: "Culture",
  FOODIE: "Food",
  URBANIST: "Urbanism",
  BOHEMIAN: "Bohemia",
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

const foodPreferenceSummaryTag: Record<FoodPreference, string> = {
  MEAL: "Meal stop",
  SNACK: "Snack / coffee only",
  NONE: "No food",
};

const foodPreferenceNote: Record<FoodPreference, string> = {
  MEAL:
    "Includes a proper sit-down meal stop with a longer window in the route.",
  SNACK:
    "Keeps food to a short coffee, snack or pickup pause instead of a full meal.",
  NONE:
    "Built without a dedicated food stop so the route stays focused on places and pacing.",
};

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function isFoodSummaryTag(tag: string) {
  const normalized = tag.toLowerCase();

  return [
    "lunch",
    "food",
    "coffee",
    "meal",
    "snack",
    "dessert",
  ].some((token) => normalized.includes(token));
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags));
}

function applyFoodPreference(itinerary: Itinerary, foodPreference: FoodPreference) {
  const overrides = foodPreferenceStopOverrides[itinerary.id]?.[foodPreference] ?? [];

  if (overrides.length > 0) {
    const replacementById = new Map(
      overrides.map((entry) => [entry.targetStopId, entry.replacement]),
    );

    itinerary.stops = itinerary.stops.map(
      (stop) => replacementById.get(stop.id) ?? stop,
    );
  }

  itinerary.summaryTags = uniqueTags([
    ...itinerary.summaryTags.filter((tag) => !isFoodSummaryTag(tag)),
    foodPreferenceSummaryTag[foodPreference],
  ]);
  itinerary.description = `${itinerary.description} ${foodPreferenceNote[foodPreference]}`;
  itinerary.stats.stopCount = itinerary.stops.length;
  itinerary.stats.totalDistanceKm = roundToOneDecimal(
    itinerary.stops.reduce(
      (distance, stop) => distance + stop.distanceFromPreviousKm,
      0,
    ),
  );
  itinerary.stats.averageRating = roundToOneDecimal(
    itinerary.stops.reduce((rating, stop) => rating + stop.rating, 0) /
      itinerary.stops.length,
  );
}

function resolveItineraryId(preferences: OnboardingPreferences) {
  const [primaryInterest] = preferences.interests;
  return (
    interestToItineraryId[primaryInterest] ?? interestToItineraryId.CULTURAL
  );
}

function applyVariant(template: Itinerary, variantIndex: number) {
  const variants = itineraryVariants[template.id] ?? [];
  const variant = variants[variantIndex % variants.length] ?? variants[0];
  const next = clone(template);

  if (!variant) {
    return {
      itinerary: next,
      toastMessage: "Route ready",
    };
  }

  variant.replacements.forEach(({ index, stop }) => {
    next.stops[index] = stop;
  });

  return {
    itinerary: next,
    toastMessage: variant.toastMessage,
  };
}

export const mockWandrService = {
  getDefaultPreferences() {
    return clone(defaultPreferences);
  },

  generateItinerary(preferences: OnboardingPreferences) {
    const itineraryId = resolveItineraryId(preferences);
    const template = itineraryTemplates[itineraryId];
    const next = clone(template);

    next.generatedFor = preferences.interests;
    next.vibe = `from your vibe · ${preferences.interests
      .map((interest) => interestToLabel[interest] ?? interest)
      .join(" + ")}`;
    applyFoodPreference(next, preferences.foodPreference);

    if (preferences.districts.length > 0) {
      next.districts = preferences.districts;
      next.startLabel = `${preferences.districts.join(" + ")}, Lima`;
    }

    next.stats.totalDurationHours = preferences.durationHours;

    return next;
  },

  replanItinerary(
    itineraryId: string,
    variantIndex: number,
    preferences: OnboardingPreferences,
  ) {
    const template = itineraryTemplates[itineraryId];
    const result = applyVariant(template, variantIndex);

    applyFoodPreference(result.itinerary, preferences.foodPreference);

    return result;
  },

  getItinerary(itineraryId: string) {
    const template = itineraryTemplates[itineraryId];
    return template ? clone(template) : null;
  },

  getOverlap(itineraryId: string): ItineraryOverlap | null {
    const overlap = overlapTemplates[itineraryId];
    return overlap ? clone(overlap) : null;
  },

  getWandrer(itineraryId: string, wandrerId: string): WandrerProfile | null {
    const overlap = overlapTemplates[itineraryId];
    if (!overlap) {
      return null;
    }

    const wandrer = overlap.wandrers.find((item) => item.id === wandrerId);
    return wandrer ? clone(wandrer) : null;
  },
};
