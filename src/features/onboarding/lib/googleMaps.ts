const GOOGLE_MAPS_SCRIPT_ID = "wandr-google-maps";
const GOOGLE_MAPS_CALLBACK_NAME = "__wandrGoogleMapsInit";

export interface GoogleMapsLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GoogleMapsLatLngBounds {
  extend(point: GoogleMapsLatLngLiteral): void;
}

export interface GoogleMap {
  fitBounds(bounds: GoogleMapsLatLngBounds, padding?: number): void;
}

export interface GoogleAdvancedMarkerElement extends HTMLElement {
  map?: GoogleMap | null;
  position?: GoogleMapsLatLngLiteral;
  zIndex?: number;
}

export interface GoogleMapsApi {
  maps: {
    LatLngBounds: new () => GoogleMapsLatLngBounds;
    Map: new (
      container: HTMLElement,
      options: Record<string, unknown>,
    ) => GoogleMap;
    marker: {
      AdvancedMarkerElement: new (
        options?: Record<string, unknown>,
      ) => GoogleAdvancedMarkerElement;
    };
  };
}

interface GoogleMapsWindow extends Window {
  __wandrGoogleMapsInit?: () => void;
  google?: GoogleMapsApi;
}

let googleMapsPromise: Promise<GoogleMapsApi> | null = null;

export function loadGoogleMapsApi() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();

  if (!apiKey) {
    return Promise.reject(
      new Error(
        "Google Maps API key missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.",
      ),
    );
  }

  const mapsWindow = window as GoogleMapsWindow;

  if (mapsWindow.google?.maps) {
    return Promise.resolve(mapsWindow.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise<GoogleMapsApi>((resolve, reject) => {
    const cleanup = () => {
      delete mapsWindow.__wandrGoogleMapsInit;
    };

    const handleError = () => {
      cleanup();
      googleMapsPromise = null;
      reject(new Error("Google Maps could not be loaded right now."));
    };

    mapsWindow.__wandrGoogleMapsInit = () => {
      cleanup();

      if (mapsWindow.google?.maps) {
        resolve(mapsWindow.google);
        return;
      }

      googleMapsPromise = null;
      reject(new Error("Google Maps loaded without the expected Maps API."));
    };

    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=marker&loading=async&v=weekly&callback=${GOOGLE_MAPS_CALLBACK_NAME}`;
    script.addEventListener("error", handleError, { once: true });
    document.head.append(script);
  });

  return googleMapsPromise;
}
