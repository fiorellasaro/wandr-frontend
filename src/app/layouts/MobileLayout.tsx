import { Outlet } from "react-router-dom";

export function MobileLayout() {
  return (
    <div className="app-shell">
      <div className="app-shell__ambient app-shell__ambient--left" />
      <div className="app-shell__ambient app-shell__ambient--right" />
      <main className="mobile-frame">
        <Outlet />
      </main>
    </div>
  );
}
