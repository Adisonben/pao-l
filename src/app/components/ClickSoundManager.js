"use client";

import { useEffect, useRef } from "react";
import { useGlobalSound } from "@/hooks/useGlobalSound";

export default function ClickSoundManager() {
  const { isMuted } = useGlobalSound();
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio object
    audioRef.current = new Audio("/sounds/click.wav");
    audioRef.current.preload = "auto";

    const playClickSound = () => {
      if (isMuted || !audioRef.current) return;

      // Reset and play for overlapping sounds (basic implementation)
      const sound = audioRef.current.cloneNode();
      sound.volume = 2.0;
      sound.play().catch((err) => {
        // Ignore errors, often caused by browser auto-play policies
        // which are usually unlocked after the first interaction anyway
      });
    };

    // Listen for pointerdown to catch both mouse clicks and touch events
    window.addEventListener("pointerdown", playClickSound);

    return () => {
      window.removeEventListener("pointerdown", playClickSound);
    };
  }, [isMuted]);

  return null; // This component doesn't render anything
}
