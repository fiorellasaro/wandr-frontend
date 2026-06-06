import type { Itinerary } from "@/entities/itinerary/types";
import type {
  Budget,
  FoodPreference,
  OnboardingPreferences,
} from "@/entities/onboarding/types";
import type { ItineraryOverlap, WandrProfile } from "@/entities/wandr/types";

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
    "A proper meal window is built into the route, so the food stop has enough time to feel intentional.",
  SNACK:
    "Food stays light: a coffee, snack or pickup pause instead of a full meal.",
  NONE:
    "There is no dedicated food stop, keeping the strand focused on places and walking.",
};

const budgetDescriptions: Record<Budget, string> = {
  LOW: "low spend",
  MID: "mid budget",
  HIGH: "higher spend ok",
  FLEX: "flexible budget",
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

function buildPreferenceHighlights(preferences: OnboardingPreferences) {
  const districts =
    preferences.districts.length > 0
      ? preferences.districts.join(" + ")
      : preferences.city;

  return [
    districts,
    preferences.interests
      .map((interest) => interestToLabel[interest] ?? interest)
      .join(" + "),
    foodPreferenceSummaryTag[preferences.foodPreference].toLowerCase(),
    budgetDescriptions[preferences.budget],
  ];
}

function buildItineraryDescription(preferences: OnboardingPreferences) {
  const districtText =
    preferences.districts.length === 1
      ? preferences.districts[0]
      : preferences.districts.join(" + ");
  const interestText = preferences.interests
    .map((interest) => interestToLabel[interest] ?? interest)
    .join(" + ")
    .toLowerCase();
  const walkText = preferences.preferWalking
    ? "keeps the stops close enough to walk"
    : "allows short transfers where they make the route stronger";
  const visitedText = preferences.avoidVisited
    ? "Previously visited places are avoided."
    : "Familiar favorites can still appear when they fit.";

  return `A ${preferences.durationHours}h ${districtText} strand shaped around ${interestText} and ${budgetDescriptions[preferences.budget]}. It ${walkText}. ${foodPreferenceNote[preferences.foodPreference]} ${visitedText}`;
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
    next.preferenceHighlights = buildPreferenceHighlights(preferences);
    next.description = buildItineraryDescription(preferences);

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
    result.itinerary.generatedFor = preferences.interests;
    result.itinerary.vibe = `from your vibe · ${preferences.interests
      .map((interest) => interestToLabel[interest] ?? interest)
      .join(" + ")}`;
    result.itinerary.preferenceHighlights = buildPreferenceHighlights(preferences);
    result.itinerary.description = buildItineraryDescription(preferences);
    result.itinerary.stats.totalDurationHours = preferences.durationHours;

    if (preferences.districts.length > 0) {
      result.itinerary.districts = preferences.districts;
      result.itinerary.startLabel = `${preferences.districts.join(" + ")}, Lima`;
    }

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

  getWandr(itineraryId: string, wandrId: string): WandrProfile | null {
    const overlap = overlapTemplates[itineraryId];
    if (!overlap) {
      return null;
    }

    const wandr = overlap.wandrs.find((item) => item.id === wandrId);
    return wandr ? clone(wandr) : null;
  },
};
