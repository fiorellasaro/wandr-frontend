import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { AppNavigation } from "@/app/layouts/AppNavigation";
import { isNativeAppRuntime } from "@/shared/lib/locationPermission";

export function MobileLayout() {
  const { pathname } = useLocation();
  const frameRef = useRef<HTMLElement | null>(null);
  const isSheetRoute =
    pathname.includes("/wandr/") ||
    pathname.includes("/stop/");
  const shouldShowNavigation =
    !isSheetRoute && (pathname === "/profile" || pathname.startsWith("/strand/"));
  const runtimeClassName = isNativeAppRuntime()
    ? "mobile-frame--native"
    : "mobile-frame--web";

  useLayoutEffect(() => {
    if (!isSheetRoute) {
      frameRef.current?.scrollTo({ top: 0, left: 0 });
    }
  }, [isSheetRoute, pathname]);

  return (
    <div className="app-shell">
      <div className="app-shell__ambient app-shell__ambient--left" />
      <div className="app-shell__ambient app-shell__ambient--right" />
      <main
        className={`mobile-frame ${runtimeClassName}${shouldShowNavigation ? " mobile-frame--with-navigation" : ""}`}
        ref={frameRef}
      >
        <Outlet />
        <AppNavigation />
      </main>
    </div>
  );
}
