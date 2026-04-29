"use client";

import { useEffect, useRef } from "react";
import { useGlobalSound } from "@/hooks/useGlobalSound";

const POOL_SIZE = 4;

export default function ClickSoundManager() {
  const { isMuted } = useGlobalSound();
  const poolRef = useRef([]);
  const indexRef = useRef(0);

  useEffect(() => {
    // Pre-create a fixed pool of Audio instances
    const pool = Array.from({ length: POOL_SIZE }, () => {
      const audio = new Audio("/sounds/click.wav");
      audio.preload = "auto";
      audio.volume = 1.0;
      return audio;
    });
    poolRef.current = pool;

    const playClickSound = () => {
      if (isMuted) return;

      // Cycle through the pool instead of cloning nodes
      const audio = poolRef.current[indexRef.current];
      indexRef.current = (indexRef.current + 1) % POOL_SIZE;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore auto-play policy errors on first interaction
      });
    };

    window.addEventListener("pointerdown", playClickSound);

    return () => {
      window.removeEventListener("pointerdown", playClickSound);
      // Cleanup: pause all pool instances
      poolRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      poolRef.current = [];
    };
  }, [isMuted]);

  return null;
}
