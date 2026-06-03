import { Capacitor, registerPlugin } from "@capacitor/core";
import type { PermissionState } from "@capacitor/core";

type NativeLocationPermissionState = {
  coarseLocation?: PermissionState;
  fineLocation?: PermissionState;
};

type LocationPermissionResult = {
  granted: boolean;
  isNativeAndroid: boolean;
  state?: PermissionState;
};

type AndroidLocationPermissionPlugin = {
  checkPermissions: () => Promise<NativeLocationPermissionState>;
  requestPermissions: (options?: {
    permissions?: Array<"coarseLocation" | "fineLocation">;
  }) => Promise<NativeLocationPermissionState>;
};

const AndroidLocationPermission =
  registerPlugin<AndroidLocationPermissionPlugin>("AndroidLocationPermission");

function hasAnyLocationPermission(state: NativeLocationPermissionState) {
  return (
    state.fineLocation === "granted" || state.coarseLocation === "granted"
  );
}

function getBestPermissionState(
  state: NativeLocationPermissionState,
): PermissionState | undefined {
  return state.fineLocation ?? state.coarseLocation;
}

export function isNativeAppRuntime() {
  return Capacitor.isNativePlatform();
}

export function isNativeAndroidRuntime() {
  return isNativeAppRuntime() && Capacitor.getPlatform() === "android";
}

export async function requestLocationPermissionForRuntime(): Promise<LocationPermissionResult> {
  if (!isNativeAndroidRuntime()) {
    return {
      granted: true,
      isNativeAndroid: false,
    };
  }

  const currentState = await AndroidLocationPermission.checkPermissions();

  if (hasAnyLocationPermission(currentState)) {
    return {
      granted: true,
      isNativeAndroid: true,
      state: "granted",
    };
  }

  const nextState = await AndroidLocationPermission.requestPermissions({
    permissions: ["coarseLocation", "fineLocation"],
  });
  const granted = hasAnyLocationPermission(nextState);

  return {
    granted,
    isNativeAndroid: true,
    state: granted ? "granted" : getBestPermissionState(nextState),
  };
}
