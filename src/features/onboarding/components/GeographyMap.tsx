import { useEffect, useRef, useState } from "react";

import type { District } from "@/entities/onboarding/types";
import { districtCenters } from "@/features/onboarding/lib/geography";
import type { GeoPoint } from "@/features/onboarding/lib/geography";
import type {
  GoogleAdvancedMarkerElement,
  GoogleMap,
  GoogleMapsApi,
} from "@/features/onboarding/lib/googleMaps";
import { loadGoogleMapsApi } from "@/features/onboarding/lib/googleMaps";

interface GeographyMapDistrict {
  label: string;
  value: District;
}

interface GeographyMapProps {
  districts: GeographyMapDistrict[];
  nearestDistrict: District | null;
  userLocation: GeoPoint | null;
}

const MAP_PADDING_PX = 56;
const DEFAULT_MARKER_COLOR = "#11100d";
const NEAREST_MARKER_COLOR = "#1f6b45";
const USER_MARKER_COLOR = "#bb4f24";
const MARKER_RING_COLOR = "#f5f3ef";
const GOOGLE_MAPS_DEMO_MAP_ID = "DEMO_MAP_ID";

function toLatLng(point: GeoPoint) {
  return {
    lat: point.latitude,
    lng: point.longitude,
  };
}

function createMarkerNode(fillColor: string, diameter: number) {
  const markerNode = document.createElement("div");
  markerNode.style.width = `${diameter}px`;
  markerNode.style.height = `${diameter}px`;
  markerNode.style.borderRadius = "999px";
  markerNode.style.border = `4px solid ${MARKER_RING_COLOR}`;
  markerNode.style.background = fillColor;
  markerNode.style.boxShadow = "0 10px 24px rgba(17, 16, 13, 0.16)";
  markerNode.style.display = "grid";
  markerNode.style.placeItems = "center";

  const innerDot = document.createElement("span");
  innerDot.style.width = `${Math.max(Math.round(diameter / 3.5), 6)}px`;
  innerDot.style.height = `${Math.max(Math.round(diameter / 3.5), 6)}px`;
  innerDot.style.borderRadius = "999px";
  innerDot.style.background = "rgba(245, 243, 239, 0.92)";

  markerNode.append(innerDot);

  return markerNode;
}

function fitMapToPoints(
  map: GoogleMap,
  googleMaps: GoogleMapsApi,
  districts: GeographyMapDistrict[],
  userLocation: GeoPoint | null,
) {
  const bounds = new googleMaps.maps.LatLngBounds();

  districts.forEach((district) => {
    bounds.extend(toLatLng(districtCenters[district.value]));
  });

  if (userLocation) {
    bounds.extend(toLatLng(userLocation));
  }

  map.fitBounds(bounds, MAP_PADDING_PX);
}

export function GeographyMap({
  districts,
  nearestDistrict,
  userLocation,
}: GeographyMapProps) {
  const mapCanvasRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const mapsApiRef = useRef<GoogleMapsApi | null>(null);
  const districtMarkersRef = useRef<Map<District, GoogleAdvancedMarkerElement>>(
    new Map(),
  );
  const userMarkerRef = useRef<GoogleAdvancedMarkerElement | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!mapCanvasRef.current) {
      return;
    }

    loadGoogleMapsApi()
      .then((googleMaps) => {
        if (cancelled || !mapCanvasRef.current) {
          return;
        }

        mapsApiRef.current = googleMaps;

        if (!mapRef.current) {
          mapRef.current = new googleMaps.maps.Map(mapCanvasRef.current, {
            clickableIcons: false,
            disableDefaultUI: true,
            gestureHandling: "cooperative",
            mapId:
              import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() ||
              GOOGLE_MAPS_DEMO_MAP_ID,
            zoomControl: true,
          });
        }

        districts.forEach((district) => {
          if (districtMarkersRef.current.has(district.value)) {
            return;
          }

          districtMarkersRef.current.set(
            district.value,
            new googleMaps.maps.marker.AdvancedMarkerElement({
              map: mapRef.current,
              position: toLatLng(districtCenters[district.value]),
              title: district.label,
            }),
          );
        });

        setMapError(null);
        setIsMapReady(true);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setMapError(
          error instanceof Error
            ? error.message
            : "Google Maps is unavailable right now.",
        );
        setIsMapReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  useEffect(() => {
    if (!mapRef.current || !mapsApiRef.current || !isMapReady) {
      return;
    }

    districts.forEach((district) => {
      const marker = districtMarkersRef.current.get(district.value);

      if (!marker) {
        return;
      }

      marker.replaceChildren(
        createMarkerNode(
          district.value === nearestDistrict
            ? NEAREST_MARKER_COLOR
            : DEFAULT_MARKER_COLOR,
          district.value === nearestDistrict ? 28 : 24,
        ),
      );
      marker.position = toLatLng(districtCenters[district.value]);
      marker.map = mapRef.current;
      marker.zIndex = district.value === nearestDistrict ? 2 : 1;
    });

    if (userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current =
          new mapsApiRef.current.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: toLatLng(userLocation),
            title: "Your location",
            zIndex: 3,
          });
      }

      userMarkerRef.current.replaceChildren(
        createMarkerNode(USER_MARKER_COLOR, 30),
      );
      userMarkerRef.current.map = mapRef.current;
      userMarkerRef.current.position = toLatLng(userLocation);
      userMarkerRef.current.zIndex = 3;
    } else if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    fitMapToPoints(mapRef.current, mapsApiRef.current, districts, userLocation);
  }, [districts, isMapReady, nearestDistrict, userLocation]);

  useEffect(() => {
    return () => {
      districtMarkersRef.current.forEach((marker) => {
        marker.map = null;
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
    };
  }, []);

  let overlayMessage: string | null = null;
  let overlayClassName = "district-locator__hint";

  if (mapError) {
    overlayMessage = mapError;
    overlayClassName = "district-locator__hint district-locator__hint--error";
  } else if (!isMapReady) {
    overlayMessage = "Loading Google Maps...";
  } else if (!userLocation) {
    overlayMessage = "Enable location to drop your pin on the map.";
  }

  return (
    <div className="district-locator__surface">
      <div className="district-locator__map-canvas" ref={mapCanvasRef} />
      {overlayMessage ? (
        <div className={overlayClassName}>{overlayMessage}</div>
      ) : null}
    </div>
  );
}
