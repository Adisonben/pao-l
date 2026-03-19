"use client";

import { createContext, useContext } from "react";
import { useKiosk } from "@/hooks/useKiosk";

const KioskContext = createContext(null);

/**
 * KioskProvider — wraps the whole app, provides WebSocket + sensor state.
 * Navigation is handled by individual pages, not centrally.
 */
export function KioskProvider({ children }) {
  const kiosk = useKiosk();

  return (
    <KioskContext.Provider value={kiosk}>
      {children}
    </KioskContext.Provider>
  );
}

export function useKioskContext() {
  const ctx = useContext(KioskContext);
  if (!ctx) {
    throw new Error("useKioskContext must be used within KioskProvider");
  }
  return ctx;
}
