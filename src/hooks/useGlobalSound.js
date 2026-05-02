"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const SOUND_LISTS = {
  welcome: [
    "/sounds/welcomes/welcome_1.wav",
    "/sounds/welcomes/welcome_2.wav",
    "/sounds/welcomes/welcome_3.wav",
  ],
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const GlobalSoundContext = createContext();

export function GlobalSoundProvider({ children }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const pendingSoundRef = useRef(null);
  const pathname = usePathname();
  const soundPathnameRef = useRef(pathname);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    pendingSoundRef.current = null;
  };

  // Automatically stop sound on page change
  useEffect(() => {
    if (pathname !== soundPathnameRef.current) {
      stopSound();
    }
  }, [pathname]);

  const unlockAudio = () => {
    if (typeof window === "undefined") return;
    
    // Create and play a tiny silent sound to unlock the audio system
    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA== ");
    silentAudio.play().catch(() => {});
    
    // Resume AudioContext if it exists (some browsers need this)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === "suspended") ctx.resume();
    }

    const pending = pendingSoundRef.current;
    if (pending) {
      pendingSoundRef.current = null;
      playSound(pending.src, pending.options);
    }
    
    // Remove listeners once unlocked
    const events = ["pointerdown", "mousedown", "touchend", "keydown", "click"];
    events.forEach((event) => {
      window.removeEventListener(event, unlockAudio);
    });
  };

  const attachGestureUnlock = () => {
    if (typeof window === "undefined") return;
    const events = ["pointerdown", "mousedown", "touchend", "keydown", "click"];
    events.forEach((event) => {
      window.addEventListener(event, unlockAudio, { once: true, passive: true });
    });
  };

  const playSound = (src, options = {}) => {
    if (isMuted) return; // Don't play if globally muted

    const resolved = SOUND_LISTS[src] ? pickRandom(SOUND_LISTS[src]) : src;

    // Stop current sound before playing new one
    stopSound();

    const audio = new Audio(resolved);
    audio.volume = options.volume || 1;
    audio.loop = options.loop || false;
    soundPathnameRef.current = pathname; // Track which page this sound belongs to

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((err) => {
        if (err?.name === "NotAllowedError" || err?.name === "NotSupportedError") {
          pendingSoundRef.current = { src, options, unlockAttached: false };
          attachGestureUnlock();
        } else {
          console.warn("Audio play failed:", err);
        }
      });
    }

    audioRef.current = audio;
  };

  const mute = () => {
    setIsMuted(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    pendingSoundRef.current = null;
  };

  const unmute = () => {
    setIsMuted(false);
  };

  return (
    <GlobalSoundContext.Provider value={{ playSound, stopSound, mute, unmute, isMuted }}>
      {children}
    </GlobalSoundContext.Provider>
  );
}

export function useGlobalSound() {
  const context = useContext(GlobalSoundContext);
  if (!context) {
    throw new Error("useGlobalSound must be used within GlobalSoundProvider");
  }

  return context;
}
