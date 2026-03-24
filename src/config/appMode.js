const VALID_MODES = new Set(["dev", "interface", "prod"]);

const rawMode = (process.env.NEXT_PUBLIC_APP_MODE || "").toLowerCase();
const resolvedMode = VALID_MODES.has(rawMode) ? rawMode : "prod";

export function getAppMode() {
  return resolvedMode;
}

export function isProdMode() {
  return resolvedMode === "prod";
}

export function isDevMode() {
  return resolvedMode === "dev";
}

export function isInterfaceMode() {
  return resolvedMode === "interface";
}
