import type { District } from "@/entities/onboarding/types";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface UserLocation extends GeoPoint {
  accuracyMeters: number;
}

export type LocationStatus = "idle" | "locating" | "granted" | "error";

export const districtCenters: Record<District, GeoPoint> = {
  Miraflores: {
    latitude: -12.1213,
    longitude: -77.0297,
  },
  Barranco: {
    latitude: -12.1457,
    longitude: -77.0201,
  },
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(from: GeoPoint, to: GeoPoint) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusKm * arc;
}

export function formatDistanceKm(distanceKm: number) {
  return distanceKm >= 10
    ? `${Math.round(distanceKm)} km from you`
    : `${distanceKm.toFixed(1)} km from you`;
}
