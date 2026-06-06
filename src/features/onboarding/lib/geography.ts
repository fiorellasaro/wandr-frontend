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
  Getsemaní: {
    latitude: 10.4208,
    longitude: -75.5461,
  },
  "San Felipe": {
    latitude: 10.4226,
    longitude: -75.5392,
  },
};

const CARTAGENA_MVP_RADIUS_KM = 8;

export const cartagenaDemoLocation: UserLocation = {
  latitude: 10.4215,
  longitude: -75.5446,
  accuracyMeters: 35,
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

export function isInsideCartagenaMvpZone(location: GeoPoint) {
  return Object.values(districtCenters).some(
    (districtCenter) =>
      getDistanceKm(location, districtCenter) <= CARTAGENA_MVP_RADIUS_KM,
  );
}

export function resolveCartagenaOnboardingLocation(
  location: UserLocation,
): UserLocation {
  return isInsideCartagenaMvpZone(location) ? location : cartagenaDemoLocation;
}
