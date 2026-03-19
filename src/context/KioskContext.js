"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useKiosk } from "@/hooks/useKiosk";

const KioskContext = createContext(null);

/**
 * KioskProvider — wraps the whole app, manages navigation driven by backend events.
 *
 * Navigation rules:
 *   kiosk_state: READY_TO_BLOW  → /blow     (from /)
 *   kiosk_state: ANALYZING      → /analyze  (from /blow)
 *   kiosk_state: RESULT         → /result   (from /analyze)
 *   kiosk_state: IDLE           → /         (from /result or /cleaning)
 */
export function KioskProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const kiosk = useKiosk();
  const { kioskState } = kiosk;

  // Track previous state to avoid duplicate navigations
  const prevStateRef = useRef(null);

  useEffect(() => {
    if (kioskState === prevStateRef.current) return;
    prevStateRef.current = kioskState;

    switch (kioskState) {
      case "READY_TO_BLOW":
        if (pathname === "/") router.push("/blow");
        break;
      case "ANALYZING":
        if (pathname === "/blow") router.push("/analyze");
        break;
      case "RESULT":
        if (pathname === "/analyze") router.push("/result");
        break;
      case "IDLE":
        if (pathname !== "/") router.push("/");
        break;
      default:
        break;
    }
  }, [kioskState, pathname, router]);

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
