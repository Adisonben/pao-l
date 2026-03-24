"use client";

import { createContext, useContext } from "react";
import { useKiosk } from "@/hooks/useKiosk";
import { useAppMode } from "@/hooks/useAppMode";
import { useMockKiosk } from "@/hooks/useMockKiosk";

const KioskContext = createContext(null);

/**
 * KioskProvider — wraps the whole app, provides WebSocket + sensor state.
 * Navigation is handled by individual pages, not centrally.
 */
export function KioskProvider({ children }) {
  const mode = useAppMode();
  const baseKiosk = mode === "prod" ? useKiosk() : useMockKiosk(mode);

  const { mockControls = null, ...rest } = baseKiosk;
  const value = {
    ...rest,
    mockControls,
    mode,
  };

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

export function useKioskContext() {
  const ctx = useContext(KioskContext);
  if (!ctx) {
    throw new Error("useKioskContext must be used within KioskProvider");
  }
  return ctx;
}
