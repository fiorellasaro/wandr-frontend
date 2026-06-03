import type { PropsWithChildren } from "react";

import { DemoAppProvider } from "@/features/demo/DemoAppContext";

import "@/app/styles/global.scss";

export function AppProviders({ children }: PropsWithChildren) {
  return <DemoAppProvider>{children}</DemoAppProvider>;
}
