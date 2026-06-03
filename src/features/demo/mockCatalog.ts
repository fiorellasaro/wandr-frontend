import type { Itinerary, ItineraryStop } from "@/entities/itinerary/types";
import type {
  OnboardingOption,
  OnboardingPreferences,
  SocialGroupComposition,
  SocialGroupSize,
  SocialMeetupStyle,
} from "@/entities/onboarding/types";
import type { FoodPreference, Interest, Pace } from "@/entities/onboarding/types";
import type { ItineraryOverlap } from "@/entities/wandr/types";

const mapLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const stop = (input: ItineraryStop): ItineraryStop => input;

export const defaultPreferences: OnboardingPreferences = {
  city: "Lima",
  districts: ["Barranco"],
  durationHours: 4,
  interests: ["CULTURAL", "FOODIE"],
  pace: "MEDIUM",
  foodPreference: "MEAL",
  socialPreferences: {
    enabled: true,
    groupComposition: "NO_PREFERENCE",
    groupSize: "SMALL_GROUP",
    meetupStyle: "ANY",
  },
  preferWalking: true,
  avoidVisited: true,
  budget: "MID",
};

export const durationOptions: Array<OnboardingOption<2 | 3 | 4 | 6>> = [
  { value: 2, label: "2h", description: "Quick hit with 2-3 stops." },
  {
    value: 3,
    label: "3h",
    description: "Short urban arc with one anchor stop.",
  },
  {
    value: 4,
    label: "4h",
    description: "Best MVP default for a strong strand.",
  },
  {
    value: 6,
    label: "6h",
    description: "Full half-day with lunch and landmarks.",
  },
];

export const interestOptions: Array<OnboardingOption<Interest>> = [
  {
    value: "CULTURAL",
    label: "Cultural",
    description: "Museums, galleries and heritage anchors.",
  },
  {
    value: "FOODIE",
    label: "Foodie",
    description: "Casual hits, lunch windows and snack logic.",
  },
  {
    value: "URBANIST",
    label: "Urbanista",
    description: "Street rhythm, lookouts and city texture.",
  },
  {
    value: "BOHEMIAN",
    label: "Bohemio",
    description: "Slow corners, bars and neighborhood mood.",
  },
];

export const paceOptions: Array<OnboardingOption<Pace>> = [
  {
    value: "TRANQUI",
    label: "Slow & scenic",
    description: "More breathing room, longer pauses and gentler transitions.",
  },
  {
    value: "MEDIUM",
    label: "Balanced",
    description: "A steady mix of anchors, walking and downtime.",
  },
  {
    value: "INTENSE",
    label: "Fast highlights",
    description: "A tighter route focused on the strongest moments.",
  },
];

export const foodPreferenceOptions: Array<OnboardingOption<FoodPreference>> = [
  {
    value: "MEAL",
    label: "Yes, meal stop",
    description: "Add a proper sit-down meal stop with enough time to eat there.",
  },
  {
    value: "SNACK",
    label: "Snack / coffee only",
    description: "Keep it to a quick coffee, snack or pickup pause in the route.",
  },
  {
    value: "NONE",
    label: "No food",
    description: "Skip food entirely so it does not get included in the itinerary.",
  },
];

export const socialModeOptions: Array<
  OnboardingOption<"NOT_TODAY" | "OPEN" | "EASY_MOMENTS">
> = [
  {
    value: "NOT_TODAY",
    label: "Not today",
    description: "Build my route only.",
  },
  {
    value: "OPEN",
    label: "Open to wandrs",
    description: "Show people with overlapping strands.",
  },
  {
    value: "EASY_MOMENTS",
    label: "Only easy moments",
    description: "Suggest matches around coffee, food or relaxed stops.",
  },
];

export const groupCompositionOptions: Array<
  OnboardingOption<SocialGroupComposition>
> = [
  {
    value: "NO_PREFERENCE",
    label: "No preference",
    description: "Open to any safe match.",
  },
  {
    value: "WOMEN_ONLY",
    label: "Women only",
    description: "Prioritize women travelers.",
  },
  {
    value: "MIXED",
    label: "Mixed group",
    description: "Open to mixed groups.",
  },
];

export const groupSizeOptions: Array<OnboardingOption<SocialGroupSize>> = [
  {
    value: "ONE_ON_ONE",
    label: "1:1",
    description: "One person.",
  },
  {
    value: "SMALL_GROUP",
    label: "Small group",
    description: "2-4 people.",
  },
  {
    value: "ANY",
    label: "Any",
    description: "Let Wandr decide.",
  },
];

export const meetupStyleOptions: Array<OnboardingOption<SocialMeetupStyle>> = [
  {
    value: "COFFEE",
    label: "Coffee",
    description: "Low-pressure cafe overlap.",
  },
  {
    value: "MEAL",
    label: "Meal",
    description: "Meet around lunch or dinner.",
  },
  {
    value: "WALK",
    label: "Walk",
    description: "Share a scenic leg.",
  },
  {
    value: "NIGHT",
    label: "Night",
    description: "Evening-friendly matches.",
  },
  {
    value: "ANY",
    label: "Any",
    description: "Use the strongest overlap.",
  },
];

export const budgetOptions: Array<
  OnboardingOption<OnboardingPreferences["budget"]>
> = [
  {
    value: "LOW",
    label: "Low",
    description: "Prioritize free or casual stops.",
  },
  {
    value: "MID",
    label: "Mid",
    description: "Comfortable mix of culture and food.",
  },
  {
    value: "HIGH",
    label: "High",
    description: "Premium lunch and stronger spend tolerance.",
  },
  {
    value: "FLEX",
    label: "Flexible",
    description: "Let the route optimize first.",
  },
];

export const districtOptions: Array<
  OnboardingOption<"Barranco" | "Miraflores">
> = [
  {
    value: "Barranco",
    label: "Barranco",
    description: "Bohemian, artistic, and full of history.",
  },
  {
    value: "Miraflores",
    label: "Miraflores",
    description: "Coastal, modern, and perfect to explore.",
  },
];

const culturalStops = [
  stop({
    id: "dedalo",
    googlePlaceId: "mock-dedalo-arte",
    name: "Dédalo Arte y Artesanía",
    category: "ART_GALLERY",
    district: "Barranco",
    address: "Av. Sáenz Peña 295, Barranco",
    rating: 4.6,
    reviewCount: 1240,
    openState: "OPEN",
    timeLabel: "10:00 AM",
    durationMinutes: 45,
    distanceFromPreviousKm: 0,
    walkMinutesFromPrevious: 0,
    description:
      "Gallery-shop hybrid in a restored house with Peruvian craft, design objects and a garden courtyard that works as a gentle opening stop.",
    state: "done",
    tier: "LANDMARK",
    tags: [
      { label: "Craft gallery", tone: "neutral" },
      { label: "Walk-in", tone: "positive" },
      { label: "~45 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Dédalo Arte y Artesanía Barranco Lima"),
  }),
  stop({
    id: "mate",
    googlePlaceId: "mock-mate-museum",
    name: "MATE – Museo Mario Testino",
    category: "MUSEUM",
    district: "Barranco",
    address: "Av. Pedro de Osma 409, Barranco",
    rating: 4.6,
    reviewCount: 3240,
    openState: "OPEN",
    timeLabel: "Now · 11:00 AM",
    durationMinutes: 120,
    distanceFromPreviousKm: 0.5,
    walkMinutesFromPrevious: 2,
    description:
      "Photography anchor inside a restored mansion. Strong visual payoff, high review density and a generous indoor dwell time for the route.",
    state: "active",
    tier: "LANDMARK",
    tags: [
      { label: "Photography", tone: "neutral" },
      { label: "2 min walk", tone: "positive" },
      { label: "~2 hrs", tone: "neutral" },
    ],
    mapUrl: mapLink("MATE Museo Mario Testino Barranco Lima"),
  }),
  stop({
    id: "canta-rana",
    googlePlaceId: "mock-la-canta-rana",
    name: "La Canta Rana",
    category: "RESTAURANT",
    district: "Barranco",
    address: "Genova 101, Barranco",
    rating: 4.5,
    reviewCount: 2870,
    openState: "OPEN",
    timeLabel: "1:15 PM",
    durationMinutes: 75,
    distanceFromPreviousKm: 0.3,
    walkMinutesFromPrevious: 1,
    description:
      "Reliable ceviche lunch window with dense social energy. Good fit when the user wants food included without blowing up the walkability score.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Lunch", tone: "positive" },
      { label: "1 min walk", tone: "positive" },
      { label: "~75 min", tone: "neutral" },
    ],
    mapUrl: mapLink("La Canta Rana Barranco Lima"),
  }),
  stop({
    id: "bajada-banos",
    googlePlaceId: "mock-bajada-banos",
    name: "Bajada de Baños",
    category: "LOOKOUT",
    district: "Barranco",
    address: "Bajada de Baños, Barranco",
    rating: 4.7,
    reviewCount: 5100,
    openState: "OPEN",
    timeLabel: "3:00 PM",
    durationMinutes: 30,
    distanceFromPreviousKm: 0.4,
    walkMinutesFromPrevious: 2,
    description:
      "Fast outdoor leg with high visual reward. Keeps the strand from becoming museum-heavy and resets pace before the closing anchor.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Free", tone: "positive" },
      { label: "Open-air", tone: "neutral" },
      { label: "~30 min", tone: "positive" },
    ],
    mapUrl: mapLink("Bajada de Baños Barranco Lima"),
  }),
  stop({
    id: "pedro-osma",
    googlePlaceId: "mock-pedro-osma",
    name: "Museo Pedro de Osma",
    category: "MUSEUM",
    district: "Barranco",
    address: "Av. Pedro de Osma 423, Barranco",
    rating: 4.7,
    reviewCount: 924,
    openState: "LIMITED",
    timeLabel: "4:00 PM",
    durationMinutes: 60,
    distanceFromPreviousKm: 0.5,
    walkMinutesFromPrevious: 2,
    description:
      "Colonial art mansion with a clean closing window before 6 PM. Strong end-cap for users who want a real final destination instead of a drift finish.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Closes 6 PM", tone: "warning" },
      { label: "Walk-in", tone: "positive" },
      { label: "~1 hr", tone: "neutral" },
    ],
    mapUrl: mapLink("Museo Pedro de Osma Barranco Lima"),
  }),
] satisfies ItineraryStop[];

const foodieStops = [
  stop({
    id: "demo",
    googlePlaceId: "mock-demo-cafe",
    name: "Demo",
    category: "COFFEE",
    district: "Barranco",
    address: "Jr. Domeyer 282, Barranco",
    rating: 4.5,
    reviewCount: 842,
    openState: "OPEN",
    timeLabel: "10:00 AM",
    durationMinutes: 40,
    distanceFromPreviousKm: 0,
    walkMinutesFromPrevious: 0,
    description:
      "Modern Barranco coffee start with enough seating and service speed for a controlled opening leg.",
    state: "active",
    tier: "LANDMARK",
    tags: [
      { label: "Coffee", tone: "neutral" },
      { label: "Quick start", tone: "positive" },
      { label: "~40 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Demo Barranco Lima"),
  }),
  stop({
    id: "mercado-barranco",
    googlePlaceId: "mock-mercado-barranco",
    name: "Mercado de Barranco",
    category: "MARKET",
    district: "Barranco",
    address: "Jr. Colina 101, Barranco",
    rating: 4.4,
    reviewCount: 1510,
    openState: "OPEN",
    timeLabel: "11:00 AM",
    durationMinutes: 45,
    distanceFromPreviousKm: 0.4,
    walkMinutesFromPrevious: 3,
    description:
      "Loose middle stop for tasting, produce browsing and snack optionality without forcing a sit-down too early.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Market", tone: "neutral" },
      { label: "3 min walk", tone: "positive" },
      { label: "~45 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Mercado de Barranco Lima"),
  }),
  stop({
    id: "isolina",
    googlePlaceId: "mock-isolina",
    name: "Isolina Taberna Peruana",
    category: "RESTAURANT",
    district: "Barranco",
    address: "Av. San Martín 101, Barranco",
    rating: 4.6,
    reviewCount: 6940,
    openState: "LIMITED",
    timeLabel: "12:30 PM",
    durationMinutes: 90,
    distanceFromPreviousKm: 0.6,
    walkMinutesFromPrevious: 5,
    description:
      "Big lunch anchor with high confidence for demo storytelling. Portions, reputation and category clarity all work in its favor.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Lunch anchor", tone: "positive" },
      { label: "Queue risk", tone: "warning" },
      { label: "~90 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Isolina Taberna Peruana Barranco Lima"),
  }),
  stop({
    id: "gelateria-speciale",
    googlePlaceId: "mock-gelateria-speciale",
    name: "Gelateria Speciale",
    category: "DESSERT",
    district: "Barranco",
    address: "Av. Pedro de Osma 201, Barranco",
    rating: 4.5,
    reviewCount: 731,
    openState: "OPEN",
    timeLabel: "2:30 PM",
    durationMinutes: 25,
    distanceFromPreviousKm: 0.3,
    walkMinutesFromPrevious: 2,
    description:
      "Short palate-reset stop that keeps the strand playful and lets the food route breathe after a long lunch dwell.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Dessert", tone: "premium" },
      { label: "2 min walk", tone: "positive" },
      { label: "~25 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Gelateria Speciale Barranco Lima"),
  }),
  stop({
    id: "malecon-paul-harris",
    googlePlaceId: "mock-malecon-paul-harris",
    name: "Malecón Paul Harris",
    category: "LOOKOUT",
    district: "Barranco",
    address: "Malecón Paul Harris, Barranco",
    rating: 4.7,
    reviewCount: 2180,
    openState: "OPEN",
    timeLabel: "3:15 PM",
    durationMinutes: 35,
    distanceFromPreviousKm: 0.8,
    walkMinutesFromPrevious: 8,
    description:
      "Light outdoor finish so the food route ends with a view, not another queue. Useful to balance indoor time and digestion.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Ocean view", tone: "positive" },
      { label: "Free", tone: "positive" },
      { label: "~35 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Malecón Paul Harris Barranco Lima"),
  }),
] satisfies ItineraryStop[];

const urbanistStops = [
  stop({
    id: "kennedy",
    googlePlaceId: "mock-parque-kennedy",
    name: "Parque Kennedy",
    category: "PLAZA",
    district: "Miraflores",
    address: "Parque Kennedy, Miraflores",
    rating: 4.5,
    reviewCount: 14800,
    openState: "OPEN",
    timeLabel: "10:00 AM",
    durationMinutes: 30,
    distanceFromPreviousKm: 0,
    walkMinutesFromPrevious: 0,
    description:
      "Transit-rich starting node with strong city texture. Good for users who want to read how the district actually moves.",
    state: "active",
    tier: "LANDMARK",
    tags: [
      { label: "City pulse", tone: "neutral" },
      { label: "Free", tone: "positive" },
      { label: "~30 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Parque Kennedy Miraflores Lima"),
  }),
  stop({
    id: "malecon",
    googlePlaceId: "mock-malecon-miraflores",
    name: "Malecón de Miraflores",
    category: "LOOKOUT",
    district: "Miraflores",
    address: "Malecón Cisneros, Miraflores",
    rating: 4.8,
    reviewCount: 10300,
    openState: "OPEN",
    timeLabel: "10:45 AM",
    durationMinutes: 45,
    distanceFromPreviousKm: 1,
    walkMinutesFromPrevious: 10,
    description:
      "Clifftop leg that gives the route scale and context. A necessary outdoor stretch before dropping south into Barranco.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "10 min walk", tone: "positive" },
      { label: "Open-air", tone: "neutral" },
      { label: "~45 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Malecón de Miraflores Lima"),
  }),
  stop({
    id: "maria-reiche",
    googlePlaceId: "mock-maria-reiche",
    name: "Parque María Reiche",
    category: "PARK",
    district: "Miraflores",
    address: "Malecón de la Reserva, Miraflores",
    rating: 4.6,
    reviewCount: 2140,
    openState: "OPEN",
    timeLabel: "11:45 AM",
    durationMinutes: 30,
    distanceFromPreviousKm: 0.7,
    walkMinutesFromPrevious: 7,
    description:
      "Keeps the route linear and readable while showing how the waterfront changes block by block.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Linear route", tone: "positive" },
      { label: "Public space", tone: "neutral" },
      { label: "~30 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Parque María Reiche Miraflores Lima"),
  }),
  stop({
    id: "puente-suspiros",
    googlePlaceId: "mock-puente-suspiros",
    name: "Puente de los Suspiros",
    category: "LANDMARK",
    district: "Barranco",
    address: "Puente de los Suspiros, Barranco",
    rating: 4.7,
    reviewCount: 12800,
    openState: "OPEN",
    timeLabel: "1:15 PM",
    durationMinutes: 40,
    distanceFromPreviousKm: 1.6,
    walkMinutesFromPrevious: 17,
    description:
      "District handoff point. Useful for proving the two-neighborhood logic without making the user zig-zag.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "District crossover", tone: "premium" },
      { label: "17 min walk", tone: "warning" },
      { label: "~40 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Puente de los Suspiros Barranco Lima"),
  }),
  stop({
    id: "electricidad",
    googlePlaceId: "mock-museo-electricidad",
    name: "Museo de la Electricidad",
    category: "MUSEUM",
    district: "Barranco",
    address: "Av. Pedro de Osma 105, Barranco",
    rating: 4.5,
    reviewCount: 422,
    openState: "OPEN",
    timeLabel: "2:15 PM",
    durationMinutes: 50,
    distanceFromPreviousKm: 0.4,
    walkMinutesFromPrevious: 3,
    description:
      "Small civic museum that gives the urbanist route a closing interior stop with actual systems history.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Civic history", tone: "neutral" },
      { label: "3 min walk", tone: "positive" },
      { label: "~50 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Museo de la Electricidad Barranco Lima"),
  }),
] satisfies ItineraryStop[];

const bohemianStops = [
  stop({
    id: "ayahuasca",
    googlePlaceId: "mock-ayahuasca",
    name: "Ayahuasca",
    category: "BAR",
    district: "Barranco",
    address: "Av. San Martín 130, Barranco",
    rating: 4.4,
    reviewCount: 4090,
    openState: "LIMITED",
    timeLabel: "4:00 PM",
    durationMinutes: 45,
    distanceFromPreviousKm: 0,
    walkMinutesFromPrevious: 0,
    description:
      "Atmosphere-first opener that immediately establishes Barranco's nightlife vocabulary without needing a late-hour demo.",
    state: "active",
    tier: "LANDMARK",
    tags: [
      { label: "Cocktail bar", tone: "premium" },
      { label: "Mood-first", tone: "neutral" },
      { label: "~45 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Ayahuasca Barranco Lima"),
  }),
  stop({
    id: "gato-tulipan",
    googlePlaceId: "mock-gato-tulipan",
    name: "El Gato Tulipán",
    category: "CAFE",
    district: "Barranco",
    address: "Bajada de Baños 350, Barranco",
    rating: 4.4,
    reviewCount: 1640,
    openState: "OPEN",
    timeLabel: "5:00 PM",
    durationMinutes: 35,
    distanceFromPreviousKm: 0.5,
    walkMinutesFromPrevious: 4,
    description:
      "Softens the route with a quieter pause and a stronger literary vibe before returning to the main promenade.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Quiet pocket", tone: "neutral" },
      { label: "4 min walk", tone: "positive" },
      { label: "~35 min", tone: "neutral" },
    ],
    mapUrl: mapLink("El Gato Tulipán Barranco Lima"),
  }),
  stop({
    id: "suspiros-evening",
    googlePlaceId: "mock-suspiros-evening",
    name: "Puente de los Suspiros",
    category: "LANDMARK",
    district: "Barranco",
    address: "Puente de los Suspiros, Barranco",
    rating: 4.7,
    reviewCount: 12800,
    openState: "OPEN",
    timeLabel: "5:45 PM",
    durationMinutes: 25,
    distanceFromPreviousKm: 0.2,
    walkMinutesFromPrevious: 2,
    description:
      "Short public-space hinge with enough romance for the theme without becoming a tourist-only dead end.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Golden hour", tone: "positive" },
      { label: "2 min walk", tone: "positive" },
      { label: "~25 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Puente de los Suspiros Barranco Lima"),
  }),
  stop({
    id: "juanito",
    googlePlaceId: "mock-juanito",
    name: "Juanito de Barranco",
    category: "BAR",
    district: "Barranco",
    address: "Jr. Sánchez Carrión 188, Barranco",
    rating: 4.5,
    reviewCount: 1880,
    openState: "OPEN",
    timeLabel: "6:20 PM",
    durationMinutes: 50,
    distanceFromPreviousKm: 0.4,
    walkMinutesFromPrevious: 4,
    description:
      "Classic neighborhood bar stop that gives the demo a less polished, more local-feeling endpoint.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Local icon", tone: "premium" },
      { label: "4 min walk", tone: "positive" },
      { label: "~50 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Juanito de Barranco Lima"),
  }),
  stop({
    id: "malecon-sunset",
    googlePlaceId: "mock-malecon-sunset",
    name: "Mirador de Barranco",
    category: "LOOKOUT",
    district: "Barranco",
    address: "Malecón Souza, Barranco",
    rating: 4.7,
    reviewCount: 1320,
    openState: "OPEN",
    timeLabel: "7:20 PM",
    durationMinutes: 30,
    distanceFromPreviousKm: 0.6,
    walkMinutesFromPrevious: 5,
    description:
      "Open-air close with enough distance from the bar leg to feel like a deliberate final scene rather than spillover.",
    state: "upcoming",
    tier: "LANDMARK",
    tags: [
      { label: "Sunset close", tone: "positive" },
      { label: "Viewpoint", tone: "neutral" },
      { label: "~30 min", tone: "neutral" },
    ],
    mapUrl: mapLink("Mirador de Barranco Lima"),
  }),
] satisfies ItineraryStop[];

export const itineraryTemplates: Record<string, Itinerary> = {
  "lima-cultural-barranco": {
    id: "lima-cultural-barranco",
    slug: "art-and-culture-barranco",
    city: "Lima",
    districts: ["Barranco"],
    title: "Art & Culture",
    vibe: "from your vibe · Culture + Food",
    description:
      "A full day in Barranco — Lima's most walkable neighbourhood. Craft gallery, world-class photography, a proper ceviche lunch, the city's most iconic street, and a colonial art mansion to close. All under 2km. All walk-in.",
    themeSource: "Theme detected",
    generatedFor: ["CULTURAL", "FOODIE"],
    summaryTags: ["Museums", "Lunch included", "Walkable"],
    startLabel: "Miraflores, Lima",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 1.7,
      totalDurationHours: 6,
      averageRating: 4.6,
      stopCount: culturalStops.length,
    },
    overlapLabel: "3 wandrs overlap your strand",
    overlapSubhead: "MATE Museum · now · same window",
    stops: culturalStops,
  },
  "lima-foodie-barranco": {
    id: "lima-foodie-barranco",
    slug: "barranco-by-appetite",
    city: "Lima",
    districts: ["Barranco"],
    title: "Barranco by Appetite",
    vibe: "from your vibe · Food + Walkability",
    description:
      "Coffee, market energy, a serious lunch and a relaxed scenic close. Built to feel edible without turning into a restaurant crawl.",
    themeSource: "Theme detected",
    generatedFor: ["FOODIE"],
    summaryTags: ["Coffee start", "Lunch anchor", "Easy walking"],
    startLabel: "Barranco, Lima",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 2.1,
      totalDurationHours: 4,
      averageRating: 4.5,
      stopCount: foodieStops.length,
    },
    overlapLabel: "2 wandrs overlap your strand",
    overlapSubhead: "Isolina · lunch window · shared appetite",
    stops: foodieStops,
  },
  "lima-urbanist-dual": {
    id: "lima-urbanist-dual",
    slug: "city-lines-and-lookouts",
    city: "Lima",
    districts: ["Miraflores", "Barranco"],
    title: "City Lines & Lookouts",
    vibe: "from your vibe · Urban systems + coast",
    description:
      "A two-district walk that reads the clifftop, public space and urban handoff into Barranco without breaking the route into detached fragments.",
    themeSource: "Theme detected",
    generatedFor: ["URBANIST"],
    summaryTags: ["Two districts", "Waterfront", "Civic layer"],
    startLabel: "Miraflores, Lima",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 3.7,
      totalDurationHours: 4,
      averageRating: 4.6,
      stopCount: urbanistStops.length,
    },
    overlapLabel: "2 wandrs overlap your strand",
    overlapSubhead: "Puente de los Suspiros · later today",
    stops: urbanistStops,
  },
  "lima-bohemian-barranco": {
    id: "lima-bohemian-barranco",
    slug: "slow-bohemia",
    city: "Lima",
    districts: ["Barranco"],
    title: "Slow Bohemia",
    vibe: "from your vibe · Night edges + neighborhood mood",
    description:
      "An afternoon-to-evening Barranco loop that favors atmosphere, pacing and places that feel lived in rather than efficient.",
    themeSource: "Theme detected",
    generatedFor: ["BOHEMIAN"],
    summaryTags: ["Atmosphere-first", "Cocktail stop", "Golden hour"],
    startLabel: "Barranco, Lima",
    dateLabel: "Friday · Demo mode",
    stats: {
      totalDistanceKm: 1.7,
      totalDurationHours: 4,
      averageRating: 4.5,
      stopCount: bohemianStops.length,
    },
    overlapLabel: "1 wandr overlaps your strand",
    overlapSubhead: "Juanito · evening window · same tempo",
    stops: bohemianStops,
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
  "lima-cultural-barranco": {
    SNACK: [
      {
        targetStopId: "canta-rana",
        replacement: stop({
          id: "pan-sal-aire-cultural",
          googlePlaceId: "mock-pan-sal-aire-cultural",
          name: "Pan Sal Aire",
          category: "CAFE",
          district: "Barranco",
          address: "Jr. Colina 112, Barranco",
          rating: 4.5,
          reviewCount: 1120,
          openState: "OPEN",
          timeLabel: "1:15 PM",
          durationMinutes: 45,
          distanceFromPreviousKm: 0.3,
          walkMinutesFromPrevious: 1,
          description:
            "Quick coffee-and-pastry pause that keeps the cultural route light without breaking the strand's rhythm.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Coffee pause", tone: "positive" },
            { label: "1 min walk", tone: "positive" },
            { label: "~45 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Pan Sal Aire Barranco Lima"),
        }),
      },
    ],
    NONE: [
      {
        targetStopId: "canta-rana",
        replacement: stop({
          id: "galeria-del-paseo-cultural",
          googlePlaceId: "mock-galeria-del-paseo-cultural",
          name: "Galería del Paseo",
          category: "ART_GALLERY",
          district: "Barranco",
          address: "Gral. Borgoño 770, Barranco",
          rating: 4.6,
          reviewCount: 284,
          openState: "OPEN",
          timeLabel: "1:15 PM",
          durationMinutes: 50,
          distanceFromPreviousKm: 0.3,
          walkMinutesFromPrevious: 1,
          description:
            "Mid-route gallery swap that preserves the cultural arc when the day is meant to stay food-free.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Contemporary art", tone: "neutral" },
            { label: "1 min walk", tone: "positive" },
            { label: "~50 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Galería del Paseo Barranco Lima"),
        }),
      },
    ],
  },
  "lima-foodie-barranco": {
    SNACK: [
      {
        targetStopId: "isolina",
        replacement: stop({
          id: "milimetrica-snack",
          googlePlaceId: "mock-milimetrica-snack",
          name: "Milimétrica Coffee",
          category: "CAFE",
          district: "Barranco",
          address: "Jr. Domeyer 199, Barranco",
          rating: 4.5,
          reviewCount: 920,
          openState: "OPEN",
          timeLabel: "12:30 PM",
          durationMinutes: 45,
          distanceFromPreviousKm: 0.6,
          walkMinutesFromPrevious: 5,
          description:
            "A tighter coffee-and-bake stop for users who want the appetite route without committing to a full meal anchor.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Coffee bar", tone: "neutral" },
            { label: "5 min walk", tone: "positive" },
            { label: "~45 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Milimétrica Coffee Barranco Lima"),
        }),
      },
    ],
    NONE: [
      {
        targetStopId: "demo",
        replacement: stop({
          id: "dedalo-foodless",
          googlePlaceId: "mock-dedalo-foodless",
          name: "Dédalo Arte y Artesanía",
          category: "ART_GALLERY",
          district: "Barranco",
          address: "Av. Sáenz Peña 295, Barranco",
          rating: 4.6,
          reviewCount: 1240,
          openState: "OPEN",
          timeLabel: "10:00 AM",
          durationMinutes: 45,
          distanceFromPreviousKm: 0,
          walkMinutesFromPrevious: 0,
          description:
            "Art-led opener used when the user wants Barranco texture but no dedicated food stop.",
          state: "active",
          tier: "LANDMARK",
          tags: [
            { label: "Craft gallery", tone: "neutral" },
            { label: "Walk-in", tone: "positive" },
            { label: "~45 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Dédalo Arte y Artesanía Barranco Lima"),
        }),
      },
      {
        targetStopId: "mercado-barranco",
        replacement: stop({
          id: "mate-foodless",
          googlePlaceId: "mock-mate-foodless",
          name: "MATE – Museo Mario Testino",
          category: "MUSEUM",
          district: "Barranco",
          address: "Av. Pedro de Osma 409, Barranco",
          rating: 4.6,
          reviewCount: 3240,
          openState: "OPEN",
          timeLabel: "11:00 AM",
          durationMinutes: 90,
          distanceFromPreviousKm: 0.4,
          walkMinutesFromPrevious: 3,
          description:
            "Museum anchor replacing the market stop when the route needs to stay fully non-food.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Photography", tone: "neutral" },
            { label: "3 min walk", tone: "positive" },
            { label: "~90 min", tone: "neutral" },
          ],
          mapUrl: mapLink("MATE Museo Mario Testino Barranco Lima"),
        }),
      },
      {
        targetStopId: "isolina",
        replacement: stop({
          id: "bajada-foodless",
          googlePlaceId: "mock-bajada-foodless",
          name: "Bajada de Baños",
          category: "LOOKOUT",
          district: "Barranco",
          address: "Bajada de Baños, Barranco",
          rating: 4.7,
          reviewCount: 5100,
          openState: "OPEN",
          timeLabel: "12:30 PM",
          durationMinutes: 30,
          distanceFromPreviousKm: 0.6,
          walkMinutesFromPrevious: 5,
          description:
            "Outdoor landmark substitute for the lunch window when the itinerary should stay entirely place-led.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Open-air", tone: "neutral" },
            { label: "5 min walk", tone: "positive" },
            { label: "~30 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Bajada de Baños Barranco Lima"),
        }),
      },
      {
        targetStopId: "gelateria-speciale",
        replacement: stop({
          id: "pedro-osma-foodless",
          googlePlaceId: "mock-pedro-osma-foodless",
          name: "Museo Pedro de Osma",
          category: "MUSEUM",
          district: "Barranco",
          address: "Av. Pedro de Osma 423, Barranco",
          rating: 4.7,
          reviewCount: 924,
          openState: "LIMITED",
          timeLabel: "2:30 PM",
          durationMinutes: 60,
          distanceFromPreviousKm: 0.3,
          walkMinutesFromPrevious: 2,
          description:
            "A stronger closing anchor than dessert when the route is meant to avoid food altogether.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Closes 6 PM", tone: "warning" },
            { label: "2 min walk", tone: "positive" },
            { label: "~1 hr", tone: "neutral" },
          ],
          mapUrl: mapLink("Museo Pedro de Osma Barranco Lima"),
        }),
      },
    ],
  },
  "lima-urbanist-dual": {
    MEAL: [
      {
        targetStopId: "maria-reiche",
        replacement: stop({
          id: "tanta-meal-urbanist",
          googlePlaceId: "mock-tanta-meal-urbanist",
          name: "Tanta Larcomar",
          category: "RESTAURANT",
          district: "Miraflores",
          address: "Malecón de la Reserva 610, Miraflores",
          rating: 4.4,
          reviewCount: 4180,
          openState: "OPEN",
          timeLabel: "11:45 AM",
          durationMinutes: 65,
          distanceFromPreviousKm: 0.7,
          walkMinutesFromPrevious: 7,
          description:
            "Mid-route lunch anchor inserted for users who want the urbanist strand to include a proper meal window.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Lunch anchor", tone: "positive" },
            { label: "7 min walk", tone: "positive" },
            { label: "~65 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Tanta Larcomar Miraflores Lima"),
        }),
      },
    ],
    SNACK: [
      {
        targetStopId: "maria-reiche",
        replacement: stop({
          id: "amarena-snack-urbanist",
          googlePlaceId: "mock-amarena-snack-urbanist",
          name: "Amarena Café Urbano",
          category: "CAFE",
          district: "Miraflores",
          address: "Malecón de la Reserva 615, Miraflores",
          rating: 4.4,
          reviewCount: 860,
          openState: "OPEN",
          timeLabel: "11:45 AM",
          durationMinutes: 35,
          distanceFromPreviousKm: 0.7,
          walkMinutesFromPrevious: 7,
          description:
            "Short coffee pause that fits the clifftop progression without turning the route into a meal-led itinerary.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Coffee pause", tone: "positive" },
            { label: "7 min walk", tone: "positive" },
            { label: "~35 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Amarena Café Urbano Miraflores Lima"),
        }),
      },
    ],
  },
  "lima-bohemian-barranco": {
    MEAL: [
      {
        targetStopId: "gato-tulipan",
        replacement: stop({
          id: "awicha-meal-bohemian",
          googlePlaceId: "mock-awicha-meal-bohemian",
          name: "Awicha",
          category: "RESTAURANT",
          district: "Barranco",
          address: "Av. San Martín 199, Barranco",
          rating: 4.4,
          reviewCount: 1460,
          openState: "OPEN",
          timeLabel: "5:00 PM",
          durationMinutes: 70,
          distanceFromPreviousKm: 0.5,
          walkMinutesFromPrevious: 4,
          description:
            "Sit-down meal anchor for users who want the bohemian route to hold a proper dinner window without losing Barranco mood.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Sit-down meal", tone: "positive" },
            { label: "4 min walk", tone: "positive" },
            { label: "~70 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Awicha Barranco Lima"),
        }),
      },
    ],
    SNACK: [
      {
        targetStopId: "ayahuasca",
        replacement: stop({
          id: "plaza-barranco-snack-bohemian",
          googlePlaceId: "mock-plaza-barranco-snack-bohemian",
          name: "Parque Municipal de Barranco",
          category: "PLAZA",
          district: "Barranco",
          address: "Parque Municipal de Barranco, Barranco",
          rating: 4.6,
          reviewCount: 2960,
          openState: "OPEN",
          timeLabel: "4:00 PM",
          durationMinutes: 30,
          distanceFromPreviousKm: 0,
          walkMinutesFromPrevious: 0,
          description:
            "Outdoor opener that preserves the neighborhood's social texture while keeping the route free of a long drink stop.",
          state: "active",
          tier: "LANDMARK",
          tags: [
            { label: "Street life", tone: "neutral" },
            { label: "Open-air", tone: "positive" },
            { label: "~30 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Parque Municipal de Barranco Lima"),
        }),
      },
      {
        targetStopId: "gato-tulipan",
        replacement: stop({
          id: "gato-tulipan-snack-bohemian",
          googlePlaceId: "mock-gato-tulipan-snack-bohemian",
          name: "El Gato Tulipán",
          category: "CAFE",
          district: "Barranco",
          address: "Bajada de Baños 350, Barranco",
          rating: 4.4,
          reviewCount: 1640,
          openState: "OPEN",
          timeLabel: "5:00 PM",
          durationMinutes: 25,
          distanceFromPreviousKm: 0.5,
          walkMinutesFromPrevious: 4,
          description:
            "Short coffee-and-snack pause for users who want a quick pickup-style stop instead of a longer food or cocktail window.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Quick coffee", tone: "positive" },
            { label: "4 min walk", tone: "positive" },
            { label: "~25 min", tone: "neutral" },
          ],
          mapUrl: mapLink("El Gato Tulipán Barranco Lima"),
        }),
      },
      {
        targetStopId: "juanito",
        replacement: stop({
          id: "domeyer-stroll-snack-bohemian",
          googlePlaceId: "mock-domeyer-stroll-snack-bohemian",
          name: "Jirón Domeyer Walk",
          category: "STREET",
          district: "Barranco",
          address: "Jr. Domeyer, Barranco",
          rating: 4.5,
          reviewCount: 780,
          openState: "OPEN",
          timeLabel: "6:20 PM",
          durationMinutes: 35,
          distanceFromPreviousKm: 0.4,
          walkMinutesFromPrevious: 4,
          description:
            "Street-texture leg that keeps the evening bohemian without adding a second food or drink stop.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Neighborhood texture", tone: "neutral" },
            { label: "4 min walk", tone: "positive" },
            { label: "~35 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Jirón Domeyer Barranco Lima"),
        }),
      },
    ],
    NONE: [
      {
        targetStopId: "ayahuasca",
        replacement: stop({
          id: "plaza-barranco-none-bohemian",
          googlePlaceId: "mock-plaza-barranco-none-bohemian",
          name: "Parque Municipal de Barranco",
          category: "PLAZA",
          district: "Barranco",
          address: "Parque Municipal de Barranco, Barranco",
          rating: 4.6,
          reviewCount: 2960,
          openState: "OPEN",
          timeLabel: "4:00 PM",
          durationMinutes: 30,
          distanceFromPreviousKm: 0,
          walkMinutesFromPrevious: 0,
          description:
            "Open-air neighborhood opener used when the route should stay entirely focused on place and pacing.",
          state: "active",
          tier: "LANDMARK",
          tags: [
            { label: "Open-air", tone: "positive" },
            { label: "Street life", tone: "neutral" },
            { label: "~30 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Parque Municipal de Barranco Lima"),
        }),
      },
      {
        targetStopId: "gato-tulipan",
        replacement: stop({
          id: "bajada-walk-none-bohemian",
          googlePlaceId: "mock-bajada-walk-none-bohemian",
          name: "Bajada de Baños Walk",
          category: "LANDMARK",
          district: "Barranco",
          address: "Bajada de Baños, Barranco",
          rating: 4.7,
          reviewCount: 5100,
          openState: "OPEN",
          timeLabel: "5:00 PM",
          durationMinutes: 25,
          distanceFromPreviousKm: 0.5,
          walkMinutesFromPrevious: 4,
          description:
            "Scenic pedestrian leg that keeps the route expressive without turning the stop into a cafe pause.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Scenic walk", tone: "positive" },
            { label: "4 min walk", tone: "positive" },
            { label: "~25 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Bajada de Baños Barranco Lima"),
        }),
      },
      {
        targetStopId: "juanito",
        replacement: stop({
          id: "jade-rivera-none-bohemian",
          googlePlaceId: "mock-jade-rivera-none-bohemian",
          name: "Jade Rivera Murals",
          category: "ART_GALLERY",
          district: "Barranco",
          address: "Calle Cajamarca, Barranco",
          rating: 4.6,
          reviewCount: 640,
          openState: "OPEN",
          timeLabel: "6:20 PM",
          durationMinutes: 35,
          distanceFromPreviousKm: 0.4,
          walkMinutesFromPrevious: 4,
          description:
            "Visual neighborhood anchor that replaces the bar stop when the user wants no food or drink windows at all.",
          state: "upcoming",
          tier: "LANDMARK",
          tags: [
            { label: "Street art", tone: "neutral" },
            { label: "4 min walk", tone: "positive" },
            { label: "~35 min", tone: "neutral" },
          ],
          mapUrl: mapLink("Jade Rivera Murals Barranco Lima"),
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
  "lima-cultural-barranco": [
    {
      toastMessage: "Fresh cultural strand loaded",
      replacements: [],
    },
    {
      toastMessage: "Swapped a visited stop for a fresher cultural option",
      replacements: [
        {
          index: 0,
          stop: stop({
            id: "lucia-puente",
            googlePlaceId: "mock-lucia-puente",
            name: "Galería Lucía de la Puente",
            category: "ART_GALLERY",
            district: "Barranco",
            address: "Sáenz Peña 206, Barranco",
            rating: 4.6,
            reviewCount: 318,
            openState: "OPEN",
            timeLabel: "10:00 AM",
            durationMinutes: 45,
            distanceFromPreviousKm: 0,
            walkMinutesFromPrevious: 0,
            description:
              "Contemporary gallery alternative that keeps the route artistic while reducing repetition for returning users.",
            state: "done",
            tier: "LANDMARK",
            tags: [
              { label: "Contemporary art", tone: "neutral" },
              { label: "Walk-in", tone: "positive" },
              { label: "~45 min", tone: "neutral" },
            ],
            mapUrl: mapLink("Galería Lucía de la Puente Barranco Lima"),
          }),
        },
      ],
    },
  ],
  "lima-foodie-barranco": [
    {
      toastMessage: "Food route generated",
      replacements: [],
    },
    {
      toastMessage: "Lunch queue risk detected, route refreshed",
      replacements: [
        {
          index: 2,
          stop: stop({
            id: "canta-rana-food",
            googlePlaceId: "mock-canta-rana-food",
            name: "La Canta Rana",
            category: "RESTAURANT",
            district: "Barranco",
            address: "Genova 101, Barranco",
            rating: 4.5,
            reviewCount: 2870,
            openState: "OPEN",
            timeLabel: "12:30 PM",
            durationMinutes: 70,
            distanceFromPreviousKm: 0.4,
            walkMinutesFromPrevious: 3,
            description:
              "Fallback lunch anchor with strong category fit and less friction for a fast demo replan.",
            state: "upcoming",
            tier: "LANDMARK",
            tags: [
              { label: "Lunch fallback", tone: "warning" },
              { label: "3 min walk", tone: "positive" },
              { label: "~70 min", tone: "neutral" },
            ],
            mapUrl: mapLink("La Canta Rana Barranco Lima"),
          }),
        },
      ],
    },
  ],
  "lima-urbanist-dual": [
    {
      toastMessage: "Urban route generated",
      replacements: [],
    },
    {
      toastMessage: "Tightened the district crossover and reduced backtracking",
      replacements: [
        {
          index: 2,
          stop: stop({
            id: "larcomar",
            googlePlaceId: "mock-larcomar",
            name: "Larcomar Terrace",
            category: "LOOKOUT",
            district: "Miraflores",
            address: "Malecón de la Reserva 610, Miraflores",
            rating: 4.5,
            reviewCount: 14120,
            openState: "OPEN",
            timeLabel: "11:45 AM",
            durationMinutes: 25,
            distanceFromPreviousKm: 0.5,
            walkMinutesFromPrevious: 4,
            description:
              "Cleaner transition stop for users who prefer clearer district logic and less meandering.",
            state: "upcoming",
            tier: "LANDMARK",
            tags: [
              { label: "Transit hinge", tone: "premium" },
              { label: "4 min walk", tone: "positive" },
              { label: "~25 min", tone: "neutral" },
            ],
            mapUrl: mapLink("Larcomar Miraflores Lima"),
          }),
        },
      ],
    },
  ],
  "lima-bohemian-barranco": [
    {
      toastMessage: "Bohemian route generated",
      replacements: [],
    },
    {
      toastMessage: "Rebalanced the evening pace with a softer opening stop",
      replacements: [
        {
          index: 0,
          stop: stop({
            id: "micaela",
            googlePlaceId: "mock-micaela",
            name: "Micaela Restobar",
            category: "BAR",
            district: "Barranco",
            address: "Jr. Domeyer 280, Barranco",
            rating: 4.4,
            reviewCount: 1040,
            openState: "OPEN",
            timeLabel: "4:00 PM",
            durationMinutes: 40,
            distanceFromPreviousKm: 0,
            walkMinutesFromPrevious: 0,
            description:
              "Lower-noise opener that preserves the mood but makes the sequence easier for a calmer user profile.",
            state: "active",
            tier: "LANDMARK",
            tags: [
              { label: "Soft opener", tone: "positive" },
              { label: "Cocktail", tone: "premium" },
              { label: "~40 min", tone: "neutral" },
            ],
            mapUrl: mapLink("Micaela Restobar Barranco Lima"),
          }),
        },
      ],
    },
  ],
};

const culturalOverlap: ItineraryOverlap = {
  id: "overlap-cultural",
  itineraryId: "lima-cultural-barranco",
  stopName: "MATE – Museo Mario Testino",
  timeWindow: "Now · 11:30 AM",
  count: 3,
  matchCopy:
    "Wandr detected people with the same stop and a compatible time window. No chat, no GPS exactness, just a lightweight social layer for the demo.",
  wandrs: [
    {
      id: "maya",
      initials: "M",
      avatarTone: "oak",
      name: "Maya R.",
      meta: "Solo · From São Paulo · 2nd day in Lima",
      vibeTags: ["Art lover", "Night owl"],
      overlapReason: "Same museum window",
      currentStopLabel: "MATE – Museo Mario Testino",
      timeWindow: "Now",
      matchScore: 0.91,
      mutualNod: true,
      meetupStop: {
        name: "Museo Pedro de Osma",
        detail: "Barranco · 4:00 PM · both on your strand",
      },
      strandPreview: [
        {
          timeLabel: "9:30 AM",
          name: "El Chinito",
          district: "Surquillo",
          state: "done",
        },
        {
          timeLabel: "11:00 AM",
          name: "MATE – Museo Mario Testino",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "1:30 PM",
          name: "La Canta Rana",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "4:00 PM",
          name: "Museo Pedro de Osma",
          district: "Barranco",
          state: "match",
        },
      ],
    },
    {
      id: "sam",
      initials: "S",
      avatarTone: "ink",
      name: "Sam K.",
      meta: "Solo · From Berlin · 5th day in Lima",
      vibeTags: ["Culture", "Food first"],
      overlapReason: "Shared lunch leg",
      currentStopLabel: "MATE – Museo Mario Testino",
      timeWindow: "Now",
      matchScore: 0.84,
      mutualNod: false,
      meetupStop: {
        name: "MATE – Museo Mario Testino",
        detail: "Barranco · right now · both here",
      },
      strandPreview: [
        {
          timeLabel: "10:00 AM",
          name: "Dédalo Arte y Artesanía",
          district: "Barranco",
          state: "done",
        },
        {
          timeLabel: "11:00 AM",
          name: "MATE – Museo Mario Testino",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "2:00 PM",
          name: "Bajada de Baños",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "5:30 PM",
          name: "Isolina",
          district: "Barranco",
          state: "upcoming",
        },
      ],
    },
    {
      id: "rafa",
      initials: "R",
      avatarTone: "marine",
      name: "Rafa M.",
      meta: "Solo · From Mexico City · 1st day in Lima",
      vibeTags: ["Pure chaos", "Night owl"],
      overlapReason: "Late route alignment",
      currentStopLabel: "MATE – Museo Mario Testino",
      timeWindow: "Now",
      matchScore: 0.78,
      mutualNod: false,
      meetupStop: {
        name: "La Canta Rana",
        detail: "Barranco · 1:15 PM · lunch together",
      },
      strandPreview: [
        {
          timeLabel: "11:30 AM",
          name: "MATE – Museo Mario Testino",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "1:00 PM",
          name: "La Canta Rana",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "3:00 PM",
          name: "Bajada de Baños",
          district: "Barranco",
          state: "match",
        },
        {
          timeLabel: "7:00 PM",
          name: "El Delfín",
          district: "Barranco",
          state: "upcoming",
        },
      ],
    },
  ],
};

const foodieOverlap: ItineraryOverlap = {
  id: "overlap-foodie",
  itineraryId: "lima-foodie-barranco",
  stopName: "Isolina Taberna Peruana",
  timeWindow: "12:30 PM · lunch wave",
  count: 2,
  matchCopy:
    "Food overlap is lighter-weight for MVP: same meal window, same district, compatible pace. Enough to validate the social premise without real-time geolocation.",
  wandrs: [culturalOverlap.wandrs[1], culturalOverlap.wandrs[2]],
};

const urbanistOverlap: ItineraryOverlap = {
  id: "overlap-urbanist",
  itineraryId: "lima-urbanist-dual",
  stopName: "Puente de los Suspiros",
  timeWindow: "1:15 PM · crossover point",
  count: 2,
  matchCopy:
    "The strongest overlap in the urban route happens at the district handoff, where multiple strands naturally compress into the same landmark.",
  wandrs: [culturalOverlap.wandrs[0], culturalOverlap.wandrs[1]],
};

const bohemianOverlap: ItineraryOverlap = {
  id: "overlap-bohemian",
  itineraryId: "lima-bohemian-barranco",
  stopName: "Juanito de Barranco",
  timeWindow: "6:20 PM · same tempo",
  count: 1,
  matchCopy:
    "Bohemian overlap is intentionally sparse. That makes the social signal feel more deliberate and less like a feed mechanic.",
  wandrs: [culturalOverlap.wandrs[0]],
};

export const overlapTemplates: Record<string, ItineraryOverlap> = {
  "lima-cultural-barranco": culturalOverlap,
  "lima-foodie-barranco": foodieOverlap,
  "lima-urbanist-dual": urbanistOverlap,
  "lima-bohemian-barranco": bohemianOverlap,
};
