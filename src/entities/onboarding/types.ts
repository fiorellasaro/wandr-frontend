export type City = "Lima";

export type District = "Barranco" | "Miraflores";

export type Interest = "CULTURAL" | "FOODIE" | "URBANIST" | "BOHEMIAN";

export type Pace = "TRANQUI" | "MEDIUM" | "INTENSE";

export type FoodPreference = "MEAL" | "SNACK" | "NONE";

export type Budget = "LOW" | "MID" | "HIGH" | "FLEX";

export type SocialGroupComposition =
  | "NO_PREFERENCE"
  | "WOMEN_ONLY"
  | "MIXED";

export type SocialMeetupStyle =
  | "COFFEE"
  | "MEAL"
  | "WALK"
  | "NIGHT"
  | "ANY";

export interface SocialPreferences {
  enabled: boolean;
  groupComposition: SocialGroupComposition;
  groupSize: number;
  meetupStyle: SocialMeetupStyle;
}

export interface OnboardingPreferences {
  city: City;
  districts: District[];
  durationHours: 2 | 3 | 4 | 6;
  interests: Interest[];
  pace: Pace;
  foodPreference: FoodPreference;
  socialPreferences: SocialPreferences;
  preferWalking: boolean;
  avoidVisited: boolean;
  budget: Budget;
}

export interface OnboardingOption<T extends string | number> {
  value: T;
  label: string;
  description: string;
}
