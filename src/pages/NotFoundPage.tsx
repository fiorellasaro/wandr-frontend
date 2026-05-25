import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="page page--empty">
      <p className="hero__eyebrow">404</p>
      <h1 className="hero__title">This route does not exist.</h1>
      <Link className="button button--primary" to="/onboarding">
        Back to onboarding
      </Link>
    </div>
  );
}
