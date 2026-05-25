import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  District,
  Interest,
  OnboardingPreferences,
  Pace,
} from "@/entities/onboarding/types";

import {
  budgetOptions,
  defaultPreferences,
  districtOptions,
  durationOptions,
  foodPreferenceOptions,
  interestOptions,
  paceOptions,
} from "@/features/demo/mockCatalog";
import { useDemoApp } from "@/features/demo/DemoAppContext";
import { GeographyMap } from "@/features/onboarding/components/GeographyMap";
import {
  districtCenters,
  formatDistanceKm,
  getDistanceKm,
} from "@/features/onboarding/lib/geography";
import type {
  LocationStatus,
  UserLocation,
} from "@/features/onboarding/lib/geography";

const GEOLOCATION_PERMISSION_DENIED = 1;
const GEOLOCATION_POSITION_UNAVAILABLE = 2;
const GEOLOCATION_TIMEOUT = 3;

function resolveLocationErrorMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case GEOLOCATION_PERMISSION_DENIED:
      return "Location access was blocked. Retry or continue without live distance.";
    case GEOLOCATION_POSITION_UNAVAILABLE:
      return "We could not read your position. Move a little and try again.";
    case GEOLOCATION_TIMEOUT:
      return "Location took too long to load. Try again for a fresh reading.";
    default:
      return "We could not load your location right now.";
  }
}

export function OnboardingForm() {
  const navigate = useNavigate();
  const { state, generateStrand } = useDemoApp();
  const [draft, setDraft] = useState<OnboardingPreferences>(
    state.preferences ?? defaultPreferences,
  );
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showDistrictFallback, setShowDistrictFallback] = useState(false);

  const toggleInterest = (interest: Interest) => {
    setDraft((current) => {
      const exists = current.interests.includes(interest);

      if (exists) {
        return {
          ...current,
          interests: current.interests.filter((item) => item !== interest),
        };
      }

      if (current.interests.length >= 2) {
        return {
          ...current,
          interests: [current.interests[1], interest],
        };
      }

      return {
        ...current,
        interests: [...current.interests, interest],
      };
    });
  };

  const toggleDistrict = (district: District) => {
    setDraft((current) => {
      const exists = current.districts.includes(district);

      if (exists && current.districts.length > 1) {
        return {
          ...current,
          districts: current.districts.filter((item) => item !== district),
        };
      }

      if (exists) {
        return current;
      }

      return {
        ...current,
        districts:
          current.districts.length >= 2
            ? [current.districts[1], district]
            : [...current.districts, district],
      };
    });
  };

  const setPace = (pace: Pace) => {
    setDraft((current) => ({ ...current, pace }));
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("error");
      setLocationError(
        "This browser does not support location. Continue without live distance.",
      );
      return;
    }

    setLocationStatus("locating");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
        });
        setLocationStatus("granted");
        setLocationError(null);
        setShowDistrictFallback(false);
      },
      (error) => {
        setLocationStatus("error");
        setLocationError(resolveLocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const districtCards = districtOptions
    .map((option) => ({
      ...option,
      distanceKm: userLocation
        ? getDistanceKm(userLocation, districtCenters[option.value])
        : null,
    }))
    .sort((left, right) => {
      if (left.distanceKm === null || right.distanceKm === null) {
        return 0;
      }

      return left.distanceKm - right.distanceKm;
    });
  const nearestDistrict =
    districtCards[0]?.distanceKm !== null ? districtCards[0].value : null;
  const canChooseDistricts =
    locationStatus === "granted" || showDistrictFallback;
  const canSubmit = draft.interests.length > 0 && canChooseDistricts;
  const isOutsideMvpZone =
    districtCards[0]?.distanceKm !== null && districtCards[0].distanceKm > 8;

  let geographySupportCopy =
    "Share your location to unlock the districts closest to you below the map.";

  if (locationStatus === "locating") {
    geographySupportCopy =
      "Waiting for permission and centering the map on your position.";
  }

  if (locationStatus === "granted") {
    geographySupportCopy = isOutsideMvpZone
      ? "You are outside our current coverage area right now, but district distances are still live."
      : "Live distance is on. Pick the district that is closer, or keep both for a crossover route.";
  }

  if (locationStatus === "error" && locationError) {
    geographySupportCopy = locationError;
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const itineraryId = generateStrand(draft);
    navigate(`/strand/${itineraryId}`);
  };

  return (
    <div className="page page--onboarding">
      <header className="hero">
        <p className="hero__eyebrow">Wandr MVP · Lima</p>
        <h1 className="hero__title">
          Wandr builds your day. Then finds your people.
        </h1>
        <p className="hero__body"></p>
      </header>

      <section className="panel">
        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">City</p>
              <h2 className="section-head__title">Lima</h2>
            </div>
          </div>
          <div className="geography-flow">
            <div className="district-locator">
              <div className="district-locator__meta">
                <span className="tag">Nearby districts</span>
                {userLocation ? (
                  <span className="tag">
                    ~{Math.round(userLocation.accuracyMeters)}m accuracy
                  </span>
                ) : null}
                {isOutsideMvpZone ? (
                  <span className="tag tag--warning">Outside coverage</span>
                ) : null}
              </div>

              <GeographyMap
                districts={districtOptions}
                nearestDistrict={
                  locationStatus === "granted" ? nearestDistrict : null
                }
                userLocation={userLocation}
              />

              <div className="district-locator__footer">
                <p className="support-copy">{geographySupportCopy}</p>
                <div className="district-locator__actions">
                  <button
                    className="button button--primary button--small"
                    disabled={locationStatus === "locating"}
                    onClick={requestLocation}
                    type="button"
                  >
                    {locationStatus === "granted"
                      ? "Refresh location"
                      : locationStatus === "locating"
                        ? "Locating..."
                        : "Use my location"}
                  </button>
                  {locationStatus === "error" ? (
                    <button
                      className="button button--ghost button--small"
                      onClick={() => setShowDistrictFallback(true)}
                      type="button"
                    >
                      Continue manually
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {canChooseDistricts ? (
              <>
                <div className="choice-grid choice-grid--two geography-choice-grid">
                  {districtCards.map((option) => {
                    const selected = draft.districts.includes(option.value);
                    const isNearest =
                      locationStatus === "granted" &&
                      nearestDistrict === option.value;

                    return (
                      <button
                        aria-pressed={selected}
                        className={`choice-card choice-card--district${selected ? " choice-card--selected" : ""}`}
                        key={option.value}
                        onClick={() => toggleDistrict(option.value)}
                        type="button"
                      >
                        <div className="choice-card__topline">
                          <span className="choice-card__label">
                            {option.label}
                          </span>
                          {isNearest ? (
                            <span className="choice-card__flag">Closest</span>
                          ) : null}
                        </div>
                        <span className="choice-card__description">
                          {option.description}
                        </span>
                        <span className="choice-card__meta">
                          {option.distanceKm !== null
                            ? formatDistanceKm(option.distanceKm)
                            : "Manual district selection"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="support-copy">
                  Pick one district or keep both if you want the route to cross
                  neighborhoods.
                </p>
              </>
            ) : null}
          </div>
        </div>

        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Available time</p>
              <h2 className="section-head__title">Route window</h2>
            </div>
          </div>
          <div className="chip-row">
            {durationOptions.map((option) => (
              <button
                className={`chip${draft.durationHours === option.value ? " chip--selected" : ""}`}
                key={option.value}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    durationHours: option.value,
                  }))
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="support-copy"></p>
        </div>

        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Interests</p>
              <h2 className="section-head__title">Pick up to 2</h2>
            </div>
          </div>
          <div className="choice-grid choice-grid--two">
            {interestOptions.map((option) => {
              const selected = draft.interests.includes(option.value);

              return (
                <button
                  className={`choice-card${selected ? " choice-card--selected" : ""}`}
                  key={option.value}
                  onClick={() => toggleInterest(option.value)}
                  type="button"
                >
                  <span className="choice-card__label">{option.label}</span>
                  <span className="choice-card__description">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Pace</p>
              <h2 className="section-head__title">
                How do you want the day to feel?
              </h2>
            </div>
          </div>
          <div className="choice-grid choice-grid--three">
            {paceOptions.map((option) => (
              <button
                className={`choice-card${draft.pace === option.value ? " choice-card--selected" : ""}`}
                key={option.value}
                onClick={() => setPace(option.value)}
                type="button"
              >
                <span className="choice-card__label">{option.label}</span>
                <span className="choice-card__description">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Food stop</p>
              <h2 className="section-head__title">
                Should we include a food stop?
              </h2>
            </div>
          </div>
          <div className="choice-grid choice-grid--three">
            {foodPreferenceOptions.map((option) => (
              <button
                className={`choice-card${draft.foodPreference === option.value ? " choice-card--selected" : ""}`}
                key={option.value}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    foodPreference: option.value,
                  }))
                }
                type="button"
              >
                <span className="choice-card__label">{option.label}</span>
                <span className="choice-card__description">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Preferences</p>
              <h2 className="section-head__title">Hard rules</h2>
            </div>
          </div>
          <div className="toggle-list">
            <label className="toggle-row">
              <span>
                <strong>Prefer walking</strong>
                <small>Stay within realistic walking legs.</small>
              </span>
              <input
                checked={draft.preferWalking}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    preferWalking: event.target.checked,
                  }))
                }
                type="checkbox"
              />
            </label>
            <label className="toggle-row">
              <span>
                <strong>Avoid visited</strong>
                <small>
                  Swap known places for fresher options when possible.
                </small>
              </span>
              <input
                checked={draft.avoidVisited}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    avoidVisited: event.target.checked,
                  }))
                }
                type="checkbox"
              />
            </label>
          </div>
        </div>

        <div className="panel__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Budget</p>
              <h2 className="section-head__title">Approximate spend</h2>
            </div>
          </div>
          <div className="chip-row">
            {budgetOptions.map((option) => (
              <button
                className={`chip${draft.budget === option.value ? " chip--selected" : ""}`}
                key={option.value}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    budget: option.value,
                  }))
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer-actions">
        <p className="support-copy">
          Your location stays in-browser and is only used here to compare the
          two MVP districts.
        </p>
        <button
          className="button button--primary button--large"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          Generate strand
        </button>
      </footer>
    </div>
  );
}
