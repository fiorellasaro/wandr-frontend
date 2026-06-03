import { useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";

import { useDemoApp } from "@/features/demo/DemoAppContext";
import { isNativeAppRuntime } from "@/shared/lib/locationPermission";

function getNavClassName({ isActive }: { isActive: boolean }) {
  return `app-navigation__item${isActive ? " app-navigation__item--active" : ""}`;
}

function useWebFrameBottomInset(isNativeRuntime: boolean) {
  useEffect(() => {
    if (isNativeRuntime) {
      document.documentElement.style.removeProperty("--web-navigation-bottom-inset");
      return;
    }

    const updateBottomInset = () => {
      const mobileFrame = document.querySelector(".mobile-frame");

      if (!mobileFrame) {
        document.documentElement.style.setProperty(
          "--web-navigation-bottom-inset",
          "8px",
        );
        return;
      }

      const frameRect = mobileFrame.getBoundingClientRect();
      const bottomInset = Math.max(8, window.innerHeight - frameRect.bottom + 8);

      document.documentElement.style.setProperty(
        "--web-navigation-bottom-inset",
        `${Math.round(bottomInset)}px`,
      );
    };

    updateBottomInset();
    window.addEventListener("resize", updateBottomInset);
    window.addEventListener("scroll", updateBottomInset, true);
    window.visualViewport?.addEventListener("resize", updateBottomInset);
    window.visualViewport?.addEventListener("scroll", updateBottomInset);
    window.addEventListener("orientationchange", updateBottomInset);

    return () => {
      window.removeEventListener("resize", updateBottomInset);
      window.removeEventListener("scroll", updateBottomInset, true);
      window.visualViewport?.removeEventListener("resize", updateBottomInset);
      window.visualViewport?.removeEventListener("scroll", updateBottomInset);
      window.removeEventListener("orientationchange", updateBottomInset);
      document.documentElement.style.removeProperty("--web-navigation-bottom-inset");
    };
  }, [isNativeRuntime]);
}

export function AppNavigation() {
  const { pathname } = useLocation();
  const { state } = useDemoApp();
  const isNativeRuntime = isNativeAppRuntime();
  const activeStrandPath = `/strand/${state.activeItineraryId}`;
  const isSheetRoute =
    pathname.includes("/wandr/") ||
    pathname.includes("/stop/");
  const shouldShowNavigation =
    !isSheetRoute && (pathname === "/profile" || pathname.startsWith("/strand/"));
  const runtimeClassName = isNativeRuntime
    ? "app-navigation--native"
    : "app-navigation--web";

  useWebFrameBottomInset(isNativeRuntime);

  if (!shouldShowNavigation) {
    return null;
  }

  return createPortal(
    <nav className={`app-navigation ${runtimeClassName}`} aria-label="Primary">
      <NavLink
        className={({ isActive }) =>
          pathname.startsWith(`${activeStrandPath}/overlaps`) ||
          pathname.startsWith(`${activeStrandPath}/wandr/`)
            ? "app-navigation__item"
            : getNavClassName({ isActive })
        }
        to={activeStrandPath}
      >
        <span
          className="app-navigation__icon app-navigation__icon--today"
          aria-hidden="true"
        />
        <span>Today</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `app-navigation__item${isActive ? " app-navigation__item--active" : ""}`
        }
        to={`${activeStrandPath}/overlaps`}
      >
        <span
          className="app-navigation__icon app-navigation__icon--nearby"
          aria-hidden="true"
        />
        <span>Nearby</span>
      </NavLink>
      <NavLink className={getNavClassName} to="/profile">
        <span
          className="app-navigation__icon app-navigation__icon--me"
          aria-hidden="true"
        />
        <span>Me</span>
      </NavLink>
    </nav>,
    document.body,
  );
}
