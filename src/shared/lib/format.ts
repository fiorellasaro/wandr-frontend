export function formatDuration(minutes: number) {
  if (minutes >= 60) {
    const hours = minutes / 60;
    return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
  }

  return `${minutes}m`;
}

export function formatRating(rating: number) {
  return rating.toFixed(1);
}

export function formatDistance(km: number) {
  return `${km.toFixed(1)} km`;
}
