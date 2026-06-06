import { Link } from "react-router-dom";

import { useDemoApp } from "@/features/demo/DemoAppContext";

const interestLabels = {
  CULTURAL: "Cultural",
  FOODIE: "Foodie",
  URBANIST: "Urbanist",
  BOHEMIAN: "Bohemian",
};

const budgetLabels = {
  LOW: "Low",
  MID: "Mid",
  HIGH: "High",
  FLEX: "Flexible",
};

const foodLabels = {
  MEAL: "Meal stop",
  SNACK: "Snack / coffee",
  NONE: "No food",
};

export function OwnProfilePage() {
  const { state } = useDemoApp();
  const itinerary = state.itineraries[state.activeItineraryId];
  const completedStops = itinerary?.stops.filter((stop) => stop.state === "done").length ?? 0;
  const nextStop =
    itinerary?.stops.find((stop) => stop.state === "active") ??
    itinerary?.stops.find((stop) => stop.state === "upcoming");
  const activeStrandPath = itinerary ? `/strand/${itinerary.id}` : "/onboarding";

  return (
    <section className="page page--profile-own">
      <header className="topbar">
        <Link to="/" aria-label="Go to start">
          <p className="topbar__brand">WANDR</p>
          {/* <p className="topbar__meta">Own profile</p> */}
        </Link>
        <Link className="button button--small button--ghost" to={activeStrandPath}>
          Strand
        </Link>
      </header>

      <section className="own-profile__hero">
        <div className="own-profile__avatar" aria-hidden="true">
          VT
        </div>
        <div>
          <p className="hero__eyebrow">Your wandr profile</p>
          <h1 className="hero__title">Valeria Torres</h1>
          <p className="hero__body">
            Lima-based explorer with a soft spot for galleries, thoughtful food
            stops and neighborhoods that reward slow attention.
          </p>
        </div>
      </section>

      <section className="own-profile__stats" aria-label="Profile stats">
        <div>
          <strong>{state.preferences.districts.length}</strong>
          <span>districts</span>
        </div>
        <div>
          <strong>{state.preferences.durationHours}h</strong>
          <span>window</span>
        </div>
        <div>
          <strong>{completedStops}</strong>
          <span>visited</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel__section own-profile__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Travel DNA</p>
              <h2 className="section-head__title">Preferences</h2>
            </div>
            <Link
              className="button button--small button--ghost own-profile__edit-preferences"
              to="/onboarding"
            >
              Edit
            </Link>
          </div>

          <div className="tag-row">
            {state.preferences.interests.map((interest) => (
              <span className="tag" key={interest}>
                {interestLabels[interest]}
              </span>
            ))}
            <span className="tag">{budgetLabels[state.preferences.budget]} budget</span>
            <span className="tag">{foodLabels[state.preferences.foodPreference]}</span>
          </div>
        </div>

        <div className="panel__section own-profile__section">
          <div className="section-head">
            <div>
              <p className="section-head__eyebrow">Current strand</p>
              <h2 className="section-head__title">{itinerary?.title ?? "No active strand"}</h2>
            </div>
          </div>

          {itinerary ? (
            <>
              <p className="hero__body own-profile__copy">{itinerary.description}</p>
              <div className="stats-row own-profile__strand-stats">
                <div className="stats-row__item">
                  <strong>{itinerary.stats.stopCount}</strong>
                  <span>stops</span>
                </div>
                <div className="stats-row__item">
                  <strong>{itinerary.stats.totalDistanceKm.toFixed(1)} km</strong>
                  <span>walk</span>
                </div>
                <div className="stats-row__item">
                  <strong>{itinerary.stats.averageRating.toFixed(1)}</strong>
                  <span>rating</span>
                </div>
                <div className="stats-row__item">
                  <strong>{nextStop?.timeLabel ?? "Soon"}</strong>
                  <span>next</span>
                </div>
              </div>
              <Link className="button button--outline button--large" to={`/strand/${itinerary.id}`}>
                View my strand
              </Link>
            </>
          ) : (
            <Link className="button button--primary button--large" to="/onboarding">
              Create my strand
            </Link>
          )}
        </div>
      </section>
    </section>
  );
}
