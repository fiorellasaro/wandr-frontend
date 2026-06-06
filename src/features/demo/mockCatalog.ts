import type { Itinerary, ItineraryStop } from "@/entities/itinerary/types";
import type {
  FoodPreference,
  Interest,
  OnboardingOption,
  OnboardingPreferences,
} from "@/entities/onboarding/types";
import type { ItineraryOverlap } from "@/entities/wandr/types";

const mapLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const stop = (input: ItineraryStop): ItineraryStop => input;

export const defaultPreferences: OnboardingPreferences = {
  city: "Cartagena de Indias",
  districts: ["Getsemaní", "San Felipe"],
  durationHours: 4,
  interests: ["CULTURAL", "FOODIE"],
  foodPreference: "SNACK",
  socialPreferences: {
    enabled: true,
    groupComposition: "NO_PREFERENCE",
    groupSize: 3,
    meetupStyle: "ANY",
  },
  preferWalking: true,
  avoidVisited: true,
  budget: "MID",
};

export const durationOptions: Array<OnboardingOption<2 | 3 | 4 | 6>> = [
  { value: 2, label: "2h", description: "Quick Getsemaní loop with 2-3 stops." },
  {
    value: 3,
    label: "3h",
    description: "Street art, plaza energy and one anchor stop.",
  },
  {
    value: 4,
    label: "4h",
    description: "Best MVP default for Cartagena's heat and pace.",
  },
  {
    value: 6,
    label: "6h",
    description: "Half-day route with snack, castle and golden-hour close.",
  },
];

export const interestOptions: Array<OnboardingOption<Interest>> = [
  {
    value: "CULTURAL",
    label: "Cultural",
    description: "Heritage, plazas, murals and Afro-Caribbean texture.",
  },
  {
    value: "FOODIE",
    label: "Foodie",
    description: "Coconut lemonade, ceviche, arepas and snack logic.",
  },
  {
    value: "URBANIST",
    label: "Urbanista",
    description: "Walkable city edges, routes, heat and lookout points.",
  },
  {
    value: "BOHEMIAN",
    label: "Bohemio",
    description: "Street art, music, plazas and late-afternoon mood.",
  },
];

export const foodPreferenceOptions: Array<OnboardingOption<FoodPreference>> = [
  {
    value: "MEAL",
    label: "Yes, meal stop",
    description: "Add a sit-down coastal meal with enough time to eat there.",
  },
  {
    value: "SNACK",
    label: "Snack / coffee only",
    description: "Keep it to a quick arepa, ceviche or limonada pause.",
  },
  {
    value: "NONE",
    label: "No food",
    description: "Skip food entirely so it does not get included in the itinerary.",
  },
];

export const budgetOptions: Array<
  OnboardingOption<OnboardingPreferences["budget"]>
> = [
  {
    value: "LOW",
    label: "Low",
    description: "Prioritize free walks, plazas and public-space stops.",
  },
  {
    value: "MID",
    label: "Mid",
    description: "Comfortable mix of culture, snack and paid entry.",
  },
  {
    value: "HIGH",
    label: "High",
    description: "Premium food stops and stronger spend tolerance.",
  },
  {
    value: "FLEX",
    label: "Flexible",
    description: "Let the route optimize first.",
  },
];

export const districtOptions: Array<
  OnboardingOption<"Getsemaní" | "San Felipe">
> = [
  {
    value: "Getsemaní",
    label: "Getsemaní",
    description: "Colorful, social, artistic and ideal for wandering.",
  },
  {
    value: "San Felipe",
    label: "San Felipe",
    description: "Historic fortress zone with views and a stronger climb.",
  },
];

const cartagenaCulturalStops = [
  stop({
    id: "plaza-trinidad",
    googlePlaceId: "mock-plaza-trinidad",
    name: "Plaza de la Trinidad",
    category: "PLAZA",
    district: "Getsemaní",
    address: "Plaza de la Trinidad, Getsemaní",
    rating: 4.7,
    reviewCount: 9800,
    openState: "OPEN",
    timeLabel: "3:00 PM",
    durationMinutes: 30,
    distanceFromPreviousKm: 0,
    walkMinutesFromPrevious: 0,
    description:
      "Open-air social starting point for Getsemaní. It gives the strand immediate local energy, color and a clear place to gather before the walk.",
    state: "active",
    tier: "LANDMARK",
    tags: [
      { label: "Open plaza", tone: "positive" },
      { label: "Free", tone: "positive" },
      { label: "~30 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Plaza de la Trinidad Getsemaní Cartagena"),
  }),
  stop({
    id: "murals-getsemani",
    googlePlaceId: "mock-getsemani-murals",
    name: "Getsemaní Murals Walk",
    category: "STREET_ART",
    district: "Getsemaní",
    address: "Calle de la Sierpe, Getsemaní",
    rating: 4.8,
    reviewCount: 6200,
    openState: "OPEN",
    timeLabel: "Now · 3:40 PM",
    durationMinutes: 50,
    distanceFromPreviousKm: 0.3,
    walkMinutesFromPrevious: 5,
    description:
      "Colorful mural corridor with balconies, street texture and high photo payoff. It shows Cartagena's wandering side without leaving the tourist-safe core.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Street art", tone: "neutral" },
      { label: "5 min walk", tone: "positive" },
      { label: "~50 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Getsemaní murals Cartagena"),
  }),
  stop({
    id: "snack-getsemani",
    googlePlaceId: "mock-getsemani-snack",
    name: "Arepa + Limonada Pause",
    category: "SNACK",
    district: "Getsemaní",
    address: "Calle del Espíritu Santo, Getsemaní",
    rating: 4.5,
    reviewCount: 1450,
    openState: "OPEN",
    timeLabel: "4:40 PM",
    durationMinutes: 35,
    distanceFromPreviousKm: 0.2,
    walkMinutesFromPrevious: 4,
    description:
      "Light Caribbean snack window for heat management: arepas, empanadas or limonada de coco without turning the route into a full restaurant crawl.",
    state: "upcoming",
    tier: "LOCAL",
    tags: [
      { label: "Local snack", tone: "positive" },
      { label: "Heat break", tone: "warning" },
      { label: "~35 min", tone: "neutral" },
    ],
    mapUrl: mapLink("arepas limonada Getsemaní Cartagena"),
  }),
  stop({
    id: "castillo-san-felipe",
    googlePlaceId: "mock-castillo-san-felipe",
    name: "Castillo de San Felipe de Barajas",
    category: "FORTRESS",
    district: "San Felipe",
    address: "Cra. 17, Cartagena de Indias",
    rating: 4.7,
    reviewCount: 62200,
    openState: "LIMITED",
    timeLabel: "5:25 PM",
    durationMinutes: 90,
    distanceFromPreviousKm: 1.4,
    walkMinutesFromPrevious: 25,
    description:
      "Colonial fortress on San Lázaro hill with tunnels, walls and city views. It adds historical weight and a clear paid-entry anchor before closing.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Closes 6 PM", tone: "warning" },
      { label: "Paid entry", tone: "neutral" },
      { label: "~90 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Castillo de San Felipe de Barajas Cartagena"),
  }),
  stop({
    id: "san-felipe-lookout",
    googlePlaceId: "mock-san-felipe-lookout",
    name: "San Felipe Golden View",
    category: "LOOKOUT",
    district: "San Felipe",
    address: "Cerro de San Lázaro, Cartagena",
    rating: 4.6,
    reviewCount: 4300,
    openState: "OPEN",
    timeLabel: "6:55 PM",
    durationMinutes: 25,
    distanceFromPreviousKm: 0.1,
    walkMinutesFromPrevious: 3,
    description:
      "Short closing pause for panoramic photos after the fortress. It gives the route a visual finish without requiring another transfer.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Golden hour", tone: "positive" },
      { label: "Viewpoint", tone: "neutral" },
      { label: "~25 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Castillo San Felipe viewpoint Cartagena"),
  }),
] satisfies ItineraryStop[];

const cartagenaFoodieStops = [
  { ...cartagenaCulturalStops[0], timeLabel: "3:00 PM", durationMinutes: 25 },
  {
    ...cartagenaCulturalStops[1],
    timeLabel: "3:35 PM",
    durationMinutes: 35,
    description:
      "Compact mural walk that leaves room for a stronger snack and coastal food window while preserving the visual story of Getsemaní.",
  },
  stop({
    id: "ceviche-getsemani",
    googlePlaceId: "mock-ceviche-getsemani",
    name: "Ceviche Cartagenero Stop",
    category: "RESTAURANT",
    district: "Getsemaní",
    address: "Calle Larga, Getsemaní",
    rating: 4.5,
    reviewCount: 2860,
    openState: "OPEN",
    timeLabel: "4:25 PM",
    durationMinutes: 65,
    distanceFromPreviousKm: 0.3,
    walkMinutesFromPrevious: 5,
    description:
      "Coastal food anchor with ceviche, patacones or arroz con coco. It keeps the route local and practical before the fortress climb.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Ceviche", tone: "positive" },
      { label: "Meal window", tone: "premium" },
      { label: "~65 min", tone: "neutral" },
    ],
    mapUrl: mapLink("ceviche Getsemaní Cartagena"),
  }),
  { ...cartagenaCulturalStops[3], timeLabel: "5:45 PM", durationMinutes: 75 },
  { ...cartagenaCulturalStops[4], timeLabel: "7:00 PM", durationMinutes: 20 },
] satisfies ItineraryStop[];

const cartagenaUrbanistStops = [
  stop({
    ...cartagenaCulturalStops[0],
    id: "trinidad-city-pulse",
    googlePlaceId: "mock-trinidad-city-pulse",
    name: "Getsemaní Street Pulse",
    durationMinutes: 25,
    description:
      "Starting node for reading how the neighborhood moves: plaza, vendors, music, shade and the tourist-local mix in one compact area.",
  }),
  stop({
    ...cartagenaCulturalStops[1],
    id: "calle-sierpe-route",
    googlePlaceId: "mock-calle-sierpe-route",
    name: "Calle de la Sierpe Route",
    timeLabel: "3:35 PM",
    durationMinutes: 40,
    description:
      "Linear street-art leg that keeps the path readable and proves the city can be explored as a tight walking sequence.",
  }),
  stop({
    id: "getsemani-to-san-felipe",
    googlePlaceId: "mock-getsemani-san-felipe-link",
    name: "Getsemaní → San Felipe Link",
    category: "WALK",
    district: "San Felipe",
    address: "Getsemaní to Cerro de San Lázaro",
    rating: 4.4,
    reviewCount: 780,
    openState: "OPEN",
    timeLabel: "4:30 PM",
    durationMinutes: 30,
    distanceFromPreviousKm: 1.2,
    walkMinutesFromPrevious: 22,
    description:
      "The connection layer between both zones: walkable in the same day, but worth flagging for heat, crowds and the option of a short taxi.",
    state: "upcoming",
    tier: "LOCAL",
    tags: [
      { label: "20-30 min walk", tone: "warning" },
      { label: "Taxi optional", tone: "neutral" },
      { label: "Route link", tone: "premium" },
    ],
    mapUrl: mapLink("Getsemaní to Castillo de San Felipe Cartagena"),
  }),
  { ...cartagenaCulturalStops[3], timeLabel: "5:10 PM", durationMinutes: 95 },
  { ...cartagenaCulturalStops[4], timeLabel: "6:50 PM", durationMinutes: 25 },
] satisfies ItineraryStop[];

const cartagenaBohemianStops = [
  {
    ...cartagenaCulturalStops[1],
    id: "murals-evening",
    timeLabel: "3:30 PM",
    state: "active",
  },
  stop({
    id: "callejon-angosto",
    googlePlaceId: "mock-callejon-angosto",
    name: "Callejón Angosto",
    category: "STREET_ART",
    district: "Getsemaní",
    address: "Callejón Angosto, Getsemaní",
    rating: 4.6,
    reviewCount: 2100,
    openState: "OPEN",
    timeLabel: "4:25 PM",
    durationMinutes: 35,
    distanceFromPreviousKm: 0.2,
    walkMinutesFromPrevious: 4,
    description:
      "Flag-lined, intimate street pocket for photos and slow wandering. It brings the bohemian side of Getsemaní forward without needing nightlife.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Photo pocket", tone: "positive" },
      { label: "4 min walk", tone: "positive" },
      { label: "~35 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Callejón Angosto Getsemaní Cartagena"),
  }),
  { ...cartagenaCulturalStops[2], timeLabel: "5:10 PM", durationMinutes: 35 },
  { ...cartagenaCulturalStops[0], id: "trinidad-evening", timeLabel: "5:55 PM" },
  { ...cartagenaCulturalStops[3], timeLabel: "6:35 PM", durationMinutes: 55 },
] satisfies ItineraryStop[];

export const itineraryTemplates: Record<string, Itinerary> = {
  "cartagena-cultural-getsemani": {
    id: "cartagena-cultural-getsemani",
    slug: "cartagena-cultural-strand",
    city: "Cartagena de Indias",
    districts: ["Getsemaní", "San Felipe"],
    title: "Cartagena Cultural Strand",
    vibe: "from your vibe · Color + History",
    description:
      "A short route through Cartagena's most vibrant demo corridor: street art in Getsemaní, plaza life, a local snack pause and the Castillo de San Felipe for a historic close with city views.",
    themeSource: "Theme detected",
    generatedFor: ["CULTURAL", "FOODIE"],
    summaryTags: ["Street art", "Castle close", "Walkable"],
    startLabel: "Getsemaní, Cartagena",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 2,
      totalDurationHours: 4,
      averageRating: 4.7,
      stopCount: cartagenaCulturalStops.length,
    },
    overlapLabel: "3 wandrs overlap your strand",
    overlapSubhead: "Getsemaní murals · now · same window",
    stops: cartagenaCulturalStops,
  },
  "cartagena-foodie-getsemani": {
    id: "cartagena-foodie-getsemani",
    slug: "getsemani-by-appetite",
    city: "Cartagena de Indias",
    districts: ["Getsemaní", "San Felipe"],
    title: "Getsemaní by Appetite",
    vibe: "from your vibe · Caribbean food + Walking",
    description:
      "A food-aware Cartagena strand with plaza energy, murals, ceviche or coconut-lemonade logic and a San Felipe finish that balances eating with movement.",
    themeSource: "Theme detected",
    generatedFor: ["FOODIE"],
    summaryTags: ["Ceviche", "Snack break", "Castle close"],
    startLabel: "Getsemaní, Cartagena",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 1.9,
      totalDurationHours: 4,
      averageRating: 4.6,
      stopCount: cartagenaFoodieStops.length,
    },
    overlapLabel: "2 wandrs overlap your strand",
    overlapSubhead: "Ceviche stop · snack window · shared appetite",
    stops: cartagenaFoodieStops,
  },
  "cartagena-urbanist-heritage": {
    id: "cartagena-urbanist-heritage",
    slug: "city-heat-and-fortress-lines",
    city: "Cartagena de Indias",
    districts: ["Getsemaní", "San Felipe"],
    title: "City Heat & Fortress Lines",
    vibe: "from your vibe · Urban texture + Heritage",
    description:
      "A two-zone route that reads Cartagena as a compact walking system: plaza pulse, mural corridors, the Getsemaní-to-San-Felipe link and a fortress lookout.",
    themeSource: "Theme detected",
    generatedFor: ["URBANIST"],
    summaryTags: ["Two zones", "Taxi optional", "Lookout"],
    startLabel: "Getsemaní, Cartagena",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 1.8,
      totalDurationHours: 4,
      averageRating: 4.6,
      stopCount: cartagenaUrbanistStops.length,
    },
    overlapLabel: "2 wandrs overlap your strand",
    overlapSubhead: "San Felipe link · later today",
    stops: cartagenaUrbanistStops,
  },
  "cartagena-bohemian-getsemani": {
    id: "cartagena-bohemian-getsemani",
    slug: "getsemani-street-mood",
    city: "Cartagena de Indias",
    districts: ["Getsemaní", "San Felipe"],
    title: "Getsemaní Street Mood",
    vibe: "from your vibe · Art + Plaza life",
    description:
      "An afternoon-to-evening Cartagena route that favors murals, music, social plazas and an optional late push to San Felipe when the heat softens.",
    themeSource: "Theme detected",
    generatedFor: ["BOHEMIAN"],
    summaryTags: ["Street mood", "Golden hour", "Social plazas"],
    startLabel: "Getsemaní, Cartagena",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 1.8,
      totalDurationHours: 4,
      averageRating: 4.6,
      stopCount: cartagenaBohemianStops.length,
    },
    overlapLabel: "1 wandr overlaps your strand",
    overlapSubhead: "Plaza de la Trinidad · evening window · same tempo",
    stops: cartagenaBohemianStops,
  },
};

export const foodPreferenceStopOverrides: Record<
  string,
  Partial<
    Record<
      FoodPreference,
      Array<{
        targetStopId: string;
        replacement: ItineraryStop;
      }>
    >
  >
> = {
  "cartagena-cultural-getsemani": {
    MEAL: [
      {
        targetStopId: "snack-getsemani",
        replacement: stop({
          ...cartagenaFoodieStops[2],
          id: "meal-cultural-getsemani",
          timeLabel: "4:40 PM",
          distanceFromPreviousKm: 0.2,
          walkMinutesFromPrevious: 4,
        }),
      },
    ],
    NONE: [
      {
        targetStopId: "snack-getsemani",
        replacement: stop({
          id: "centenario-park",
          googlePlaceId: "mock-centenario-park",
          name: "Parque Centenario",
          category: "PARK",
          district: "Getsemaní",
          address: "Parque Centenario, Cartagena",
          rating: 4.4,
          reviewCount: 5300,
          openState: "OPEN",
          timeLabel: "4:40 PM",
          durationMinutes: 30,
          distanceFromPreviousKm: 0.2,
          walkMinutesFromPrevious: 4,
          description:
            "Food-free public-space swap that keeps the route shaded, local and walkable before the San Felipe leg.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Shade break", tone: "positive" },
            { label: "Free", tone: "positive" },
            { label: "~30 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Parque Centenario Cartagena"),
        }),
      },
    ],
  },
  "cartagena-foodie-getsemani": {
    SNACK: [
      {
        targetStopId: "ceviche-getsemani",
        replacement: cartagenaCulturalStops[2],
      },
    ],
    NONE: [
      {
        targetStopId: "ceviche-getsemani",
        replacement: stop({
          ...cartagenaCulturalStops[0],
          id: "trinidad-foodless",
          timeLabel: "4:25 PM",
          state: "upcoming",
          description:
            "Food-free plaza swap when the user wants the route to stay fully focused on place, people and walking.",
        }),
      },
    ],
  },
};

export const itineraryVariants: Record<
  string,
  Array<{
    toastMessage: string;
    replacements: Array<{ index: number; stop: ItineraryStop }>;
  }>
> = {
  "cartagena-cultural-getsemani": [
    {
      toastMessage: "Cartagena cultural strand loaded",
      replacements: [],
    },
    {
      toastMessage: "Heat risk detected, added a shaded pause",
      replacements: [
        {
          index: 2,
          stop: stop({
            ...cartagenaCulturalStops[2],
            id: "limonada-shade-break",
            name: "Limonada de Coco Shade Break",
            durationMinutes: 30,
            description:
              "Shorter shaded pause that manages Cartagena heat while keeping the route moving toward San Felipe.",
            tags: [
              { label: "Coconut lemonade", tone: "positive" },
              { label: "Heat break", tone: "warning" },
              { label: "~30 min", tone: "neutral" },
            ],
          }),
        },
      ],
    },
  ],
  "cartagena-foodie-getsemani": [
    {
      toastMessage: "Food route generated",
      replacements: [],
    },
    {
      toastMessage: "Swapped the meal for a lighter Caribbean snack",
      replacements: [
        {
          index: 2,
          stop: cartagenaCulturalStops[2],
        },
      ],
    },
  ],
  "cartagena-urbanist-heritage": [
    {
      toastMessage: "Urban heritage route generated",
      replacements: [],
    },
    {
      toastMessage: "Taxi hop suggested to reduce heat exposure",
      replacements: [
        {
          index: 2,
          stop: stop({
            ...cartagenaUrbanistStops[2],
            id: "taxi-hop-san-felipe",
            name: "Short Taxi Hop to San Felipe",
            durationMinutes: 12,
            distanceFromPreviousKm: 1.2,
            walkMinutesFromPrevious: 8,
            description:
              "A short mobility-app or taxi hop keeps the same route logic while avoiding the hottest walking segment.",
            tags: [
              { label: "5-10 min taxi", tone: "positive" },
              { label: "Heat-smart", tone: "warning" },
              { label: "Route link", tone: "premium" },
            ],
          }),
        },
      ],
    },
  ],
  "cartagena-bohemian-getsemani": [
    {
      toastMessage: "Bohemian route generated",
      replacements: [],
    },
    {
      toastMessage: "Rebalanced the evening around Plaza de la Trinidad",
      replacements: [
        {
          index: 4,
          stop: stop({
            ...cartagenaCulturalStops[0],
            id: "trinidad-music-close",
            name: "Plaza de la Trinidad Music Close",
            timeLabel: "6:35 PM",
            durationMinutes: 45,
            state: "upcoming",
            description:
              "Evening plaza close with street music and social energy when the route should stay inside Getsemaní instead of climbing to the castle.",
            tags: [
              { label: "Street music", tone: "positive" },
              { label: "Social close", tone: "premium" },
              { label: "~45 min", tone: "neutral" },
            ],
          }),
        },
      ],
    },
  ],
};

const culturalOverlap: ItineraryOverlap = {
  id: "overlap-cultural",
  itineraryId: "cartagena-cultural-getsemani",
  stopName: "Getsemaní Murals Walk",
  timeWindow: "Now · 3:40 PM",
  count: 3,
  matchCopy:
    "Wandr detected people with the same visual route and a compatible time window. No chat, no exact GPS, just a lightweight social layer for the demo.",
  wandrs: [
    {
      id: "maya",
      initials: "M",
      avatarTone: "oak",
      name: "Maya R.",
      meta: "Solo · From São Paulo · 2nd day in Cartagena",
      bio:
        "In Cartagena for a long weekend, usually chasing color, design shops, plazas and late dessert stops.",
      profileFacts: [
        { label: "Home base", value: "São Paulo" },
        { label: "Travel mode", value: "Solo · low-key explorer" },
        { label: "Languages", value: "Portuguese, English, Spanish" },
        { label: "Looking for", value: "Street art and low-key evening plans" },
      ],
      vibeTags: ["Art lover", "Night owl"],
      overlapReason: "Same mural window",
      currentStopLabel: "Getsemaní Murals Walk",
      timeWindow: "Now",
      matchScore: 0.91,
      mutualNod: true,
      meetupStop: {
        name: "Castillo de San Felipe de Barajas",
        detail: "San Felipe · 5:25 PM · both on your strand",
      },
      strandPreview: [
        {
          timeLabel: "2:30 PM",
          name: "Café del Mural",
          district: "Getsemaní",
          state: "done",
        },
        {
          timeLabel: "3:40 PM",
          name: "Getsemaní Murals Walk",
          district: "Getsemaní",
          state: "match",
        },
        {
          timeLabel: "4:40 PM",
          name: "Arepa + Limonada Pause",
          district: "Getsemaní",
          state: "match",
        },
        {
          timeLabel: "5:25 PM",
          name: "Castillo de San Felipe",
          district: "San Felipe",
          state: "match",
        },
      ],
    },
    {
      id: "sam",
      initials: "S",
      avatarTone: "ink",
      name: "Sam K.",
      meta: "Solo · From Berlin · 5th day in Cartagena",
      bio:
        "Culture-first traveler with a food-first weakness. Likes comparing notes on neighborhoods, fortresses and where to eat next.",
      profileFacts: [
        { label: "Home base", value: "Berlin" },
        { label: "Travel mode", value: "Solo · structured but flexible" },
        { label: "Languages", value: "German, English" },
        { label: "Looking for", value: "Historic context and a strong snack pick" },
      ],
      vibeTags: ["Culture", "Food first"],
      overlapReason: "Shared snack leg",
      currentStopLabel: "Getsemaní Murals Walk",
      timeWindow: "Now",
      matchScore: 0.84,
      mutualNod: false,
      meetupStop: {
        name: "Getsemaní Murals Walk",
        detail: "Getsemaní · right now · both here",
      },
      strandPreview: [
        {
          timeLabel: "3:00 PM",
          name: "Plaza de la Trinidad",
          district: "Getsemaní",
          state: "done",
        },
        {
          timeLabel: "3:40 PM",
          name: "Getsemaní Murals Walk",
          district: "Getsemaní",
          state: "match",
        },
        {
          timeLabel: "5:25 PM",
          name: "Castillo de San Felipe",
          district: "San Felipe",
          state: "match",
        },
        {
          timeLabel: "7:15 PM",
          name: "Plaza de la Trinidad",
          district: "Getsemaní",
          state: "upcoming",
        },
      ],
    },
    {
      id: "rafa",
      initials: "R",
      avatarTone: "marine",
      name: "Rafa M.",
      meta: "Solo · From Mexico City · 1st day in Cartagena",
      bio:
        "First day in Cartagena and moving by instinct: street views, loud corners, quick snacks and plans that can change fast.",
      profileFacts: [
        { label: "Home base", value: "Mexico City" },
        { label: "Travel mode", value: "Solo · spontaneous" },
        { label: "Languages", value: "Spanish, English" },
        { label: "Looking for", value: "Casual hangs and late-day discoveries" },
      ],
      vibeTags: ["Pure chaos", "Night owl"],
      overlapReason: "Late route alignment",
      currentStopLabel: "Getsemaní Murals Walk",
      timeWindow: "Now",
      matchScore: 0.78,
      mutualNod: false,
      meetupStop: {
        name: "Arepa + Limonada Pause",
        detail: "Getsemaní · 4:40 PM · snack together",
      },
      strandPreview: [
        {
          timeLabel: "3:40 PM",
          name: "Getsemaní Murals Walk",
          district: "Getsemaní",
          state: "match",
        },
        {
          timeLabel: "4:40 PM",
          name: "Arepa + Limonada Pause",
          district: "Getsemaní",
          state: "match",
        },
        {
          timeLabel: "5:25 PM",
          name: "Castillo de San Felipe",
          district: "San Felipe",
          state: "match",
        },
        {
          timeLabel: "7:00 PM",
          name: "Callejón Angosto",
          district: "Getsemaní",
          state: "upcoming",
        },
      ],
    },
  ],
};

const foodieOverlap: ItineraryOverlap = {
  id: "overlap-foodie",
  itineraryId: "cartagena-foodie-getsemani",
  stopName: "Ceviche Cartagenero Stop",
  timeWindow: "4:25 PM · snack wave",
  count: 2,
  matchCopy:
    "Food overlap is lighter-weight for MVP: same food window and same zone. Enough to validate the social premise without real-time geolocation.",
  wandrs: [culturalOverlap.wandrs[1], culturalOverlap.wandrs[2]],
};

const urbanistOverlap: ItineraryOverlap = {
  id: "overlap-urbanist",
  itineraryId: "cartagena-urbanist-heritage",
  stopName: "Getsemaní → San Felipe Link",
  timeWindow: "4:30 PM · route handoff",
  count: 2,
  matchCopy:
    "The strongest overlap in the urban route happens at the zone handoff, where multiple strands naturally compress before the castle.",
  wandrs: [culturalOverlap.wandrs[0], culturalOverlap.wandrs[1]],
};

const bohemianOverlap: ItineraryOverlap = {
  id: "overlap-bohemian",
  itineraryId: "cartagena-bohemian-getsemani",
  stopName: "Plaza de la Trinidad",
  timeWindow: "5:55 PM · same tempo",
  count: 1,
  matchCopy:
    "Bohemian overlap is intentionally sparse. That makes the social signal feel more deliberate and less like a feed mechanic.",
  wandrs: [culturalOverlap.wandrs[0]],
};

export const overlapTemplates: Record<string, ItineraryOverlap> = {
  "cartagena-cultural-getsemani": culturalOverlap,
  "cartagena-foodie-getsemani": foodieOverlap,
  "cartagena-urbanist-heritage": urbanistOverlap,
  "cartagena-bohemian-getsemani": bohemianOverlap,
};
