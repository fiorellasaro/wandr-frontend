import { createBrowserRouter, Navigate } from "react-router-dom";

import { MobileLayout } from "@/app/layouts/MobileLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { OverlapsSheetRoute } from "@/pages/OverlapsSheetRoute";
import { StopSheetRoute } from "@/pages/StopSheetRoute";
import { StrandShellPage } from "@/pages/StrandShellPage";
import { WandrerSheetRoute } from "@/pages/WandrerSheetRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/onboarding" replace />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "strand/:itineraryId",
        element: <StrandShellPage />,
        children: [
          {
            path: "stop/:stopId",
            element: <StopSheetRoute />,
          },
          {
            path: "overlaps",
            element: <OverlapsSheetRoute />,
          },
          {
            path: "wandrer/:wandrerId",
            element: <WandrerSheetRoute />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
