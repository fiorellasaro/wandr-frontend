import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from "react";

import type {
  Itinerary,
  StopState,
} from "@/entities/itinerary/types";
import type { OnboardingPreferences } from "@/entities/onboarding/types";

import { itineraryTemplates } from "@/features/demo/mockCatalog";
import { mockWandrService } from "@/features/demo/mockWandrService";

const STORAGE_KEY = "wandr-demo-state-v1";

type PersistedPreferences = Partial<OnboardingPreferences> & {
  includeFood?: boolean;
};

interface DemoState {
  preferences: OnboardingPreferences;
  itineraries: Record<string, Itinerary>;
  activeItineraryId: string;
  itineraryVersions: Record<string, number>;
  meetupsEnabled: boolean;
  sentNods: string[];
  toastMessage: string | null;
}

type DemoAction =
  | {
      type: "setPreferences";
      payload: OnboardingPreferences;
    }
  | {
      type: "setItinerary";
      payload: {
        itinerary: Itinerary;
        version: number;
      };
    }
  | {
      type: "setToast";
      payload: string | null;
    }
  | {
      type: "markStopDone";
      payload: {
        itineraryId: string;
        stopId: string;
      };
    }
  | {
      type: "toggleMeetups";
    }
  | {
      type: "sendNod";
      payload: string;
    };

interface DemoContextValue {
  state: DemoState;
  generateStrand: (preferences: OnboardingPreferences) => string;
  replanStrand: (itineraryId: string) => void;
  markStopDone: (itineraryId: string, stopId: string) => void;
  toggleMeetups: () => void;
  sendNod: (itineraryId: string, wandrId: string) => {
    matched: boolean;
    alreadySent: boolean;
  };
  dismissToast: () => void;
}

function createInitialState(): DemoState {
  const preferences = mockWandrService.getDefaultPreferences();
  const itinerary = mockWandrService.generateItinerary(preferences);
  const seededItineraries = Object.fromEntries(
    Object.values(itineraryTemplates).map((item) => [item.id, structuredClone(item)]),
  ) as Record<string, Itinerary>;

  return {
    preferences,
    itineraries: {
      ...seededItineraries,
      [itinerary.id]: itinerary,
    },
    activeItineraryId: itinerary.id,
    itineraryVersions: {
      [itinerary.id]: 0,
    },
    meetupsEnabled: true,
    sentNods: [],
    toastMessage: null,
  };
}

function normalizePreferences(
  preferences?: PersistedPreferences | null,
): OnboardingPreferences {
  const defaults = mockWandrService.getDefaultPreferences();

  if (!preferences) {
    return defaults;
  }

  return {
    ...defaults,
    ...preferences,
    foodPreference:
      preferences.foodPreference ??
      (preferences.includeFood === true ? "MEAL" : "NONE"),
    socialPreferences: {
      ...defaults.socialPreferences,
      ...preferences.socialPreferences,
    },
  };
}

function readPersistedState() {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(stored) as DemoState & {
      preferences?: PersistedPreferences;
    };

    return {
      ...createInitialState(),
      ...parsed,
      preferences: normalizePreferences(parsed.preferences),
    };
  } catch {
    return createInitialState();
  }
}

function advanceStopStates(stops: Itinerary["stops"], stopId: string) {
  const selectedIndex = stops.findIndex((stop) => stop.id === stopId);

  if (selectedIndex === -1) {
    return stops;
  }

  return stops.map((stop, index) => {
    let nextState: StopState = stop.state;

    if (index <= selectedIndex) {
      nextState = "done";
    } else if (index === selectedIndex + 1) {
      nextState = "active";
    } else {
      nextState = "upcoming";
    }

    return {
      ...stop,
      state: nextState,
    };
  });
}

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "setPreferences":
      return {
        ...state,
        preferences: action.payload,
      };
    case "setItinerary":
      return {
        ...state,
        itineraries: {
          ...state.itineraries,
          [action.payload.itinerary.id]: action.payload.itinerary,
        },
        activeItineraryId: action.payload.itinerary.id,
        itineraryVersions: {
          ...state.itineraryVersions,
          [action.payload.itinerary.id]: action.payload.version,
        },
      };
    case "setToast":
      return {
        ...state,
        toastMessage: action.payload,
      };
    case "markStopDone": {
      const itinerary = state.itineraries[action.payload.itineraryId];

      if (!itinerary) {
        return state;
      }

      return {
        ...state,
        itineraries: {
          ...state.itineraries,
          [itinerary.id]: {
            ...itinerary,
            stops: advanceStopStates(itinerary.stops, action.payload.stopId),
          },
        },
      };
    }
    case "toggleMeetups":
      return {
        ...state,
        meetupsEnabled: !state.meetupsEnabled,
      };
    case "sendNod":
      if (state.sentNods.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        sentNods: [...state.sentNods, action.payload],
      };
    default:
      return state;
  }
}

const DemoAppContext = createContext<DemoContextValue | null>(null);

export function DemoAppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(demoReducer, undefined, readPersistedState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: DemoContextValue = {
    state,
    generateStrand(preferences) {
      const itinerary = mockWandrService.generateItinerary(preferences);
      dispatch({ type: "setPreferences", payload: preferences });
      dispatch({
        type: "setItinerary",
        payload: {
          itinerary,
          version: 0,
        },
      });
      dispatch({ type: "setToast", payload: "Strand generated from your brief" });

      return itinerary.id;
    },
    replanStrand(itineraryId) {
      const currentVersion = state.itineraryVersions[itineraryId] ?? 0;
      const nextVersion = currentVersion + 1;
      const result = mockWandrService.replanItinerary(
        itineraryId,
        nextVersion,
        state.preferences,
      );

      dispatch({
        type: "setItinerary",
        payload: {
          itinerary: result.itinerary,
          version: nextVersion,
        },
      });
      dispatch({ type: "setToast", payload: result.toastMessage });
    },
    markStopDone(itineraryId, stopId) {
      dispatch({
        type: "markStopDone",
        payload: {
          itineraryId,
          stopId,
        },
      });
      dispatch({ type: "setToast", payload: "Stop marked as visited" });
    },
    toggleMeetups() {
      dispatch({ type: "toggleMeetups" });
    },
    sendNod(itineraryId, wandrId) {
      const overlap = mockWandrService.getOverlap(itineraryId);
      const wandr = overlap?.wandrs.find((item) => item.id === wandrId);
      const key = `${itineraryId}:${wandrId}`;
      const alreadySent = state.sentNods.includes(key);

      if (!alreadySent) {
        dispatch({ type: "sendNod", payload: key });
      }

      dispatch({
        type: "setToast",
        payload: alreadySent
          ? "Nod already sent"
          : wandr?.mutualNod
            ? `Mutual nod with ${wandr.name.split(" ")[0]}`
            : `Nod sent to ${wandr?.name ?? "wandr"}`,
      });

      return {
        matched: Boolean(wandr?.mutualNod),
        alreadySent,
      };
    },
    dismissToast() {
      dispatch({ type: "setToast", payload: null });
    },
  };

  return (
    <DemoAppContext.Provider value={value}>{children}</DemoAppContext.Provider>
  );
}

export function useDemoApp() {
  const context = useContext(DemoAppContext);

  if (!context) {
    throw new Error("useDemoApp must be used within DemoAppProvider");
  }

  return context;
}
