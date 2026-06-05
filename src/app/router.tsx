import { createBrowserRouter } from "react-router-dom";

import { MobileLayout } from "@/app/layouts/MobileLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { OwnProfilePage } from "@/pages/OwnProfilePage";
import { OverlapsSheetRoute } from "@/pages/OverlapsSheetRoute";
import { StopSheetRoute } from "@/pages/StopSheetRoute";
import { StrandShellPage } from "@/pages/StrandShellPage";
import { WandrSheetRoute } from "@/pages/WandrSheetRoute";
import { WelcomePage } from "@/pages/WelcomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "profile",
        element: <OwnProfilePage />,
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
            children: [
              {
                path: "wandr/:wandrId",
                element: <WandrSheetRoute />,
              },
            ],
          },
          {
            path: "wandr/:wandrId",
            element: <WandrSheetRoute />,
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
