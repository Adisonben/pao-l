"use client";

import { createContext, useContext } from "react";
import { useKiosk } from "@/hooks/useKiosk";
import { useAppMode } from "@/hooks/useAppMode";
import { useMockKiosk } from "@/hooks/useMockKiosk";

const KioskContext = createContext(null);

/**
 * ProdKioskProvider — uses real WebSocket connection.
 */
function ProdKioskProvider({ children }) {
  const kiosk = useKiosk();
  const value = { ...kiosk, mockControls: null, mode: "prod" };
  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

/**
 * MockKioskProvider — uses mock data for dev/interface modes.
 */
function MockKioskProvider({ mode, children }) {
  const kiosk = useMockKiosk(mode);
  const { mockControls = null, ...rest } = kiosk;
  const value = { ...rest, mockControls, mode };
  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

/**
 * KioskProvider — wraps the whole app, provides WebSocket + sensor state.
 * Delegates to ProdKioskProvider or MockKioskProvider to avoid
 * conditional hook calls (React Rules of Hooks).
 */
export function KioskProvider({ children }) {
  const mode = useAppMode();

  if (mode === "prod") {
    return <ProdKioskProvider>{children}</ProdKioskProvider>;
  }
  return <MockKioskProvider mode={mode}>{children}</MockKioskProvider>;
}

export function useKioskContext() {
  const ctx = useContext(KioskContext);
  if (!ctx) {
    throw new Error("useKioskContext must be used within KioskProvider");
  }
  return ctx;
}
