"use client";

import { createContext, useContext, useRef, useState } from "react";

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

  const attachGestureUnlock = () => {
    if (typeof window === "undefined") return;
    const pending = pendingSoundRef.current;
    if (!pending || pending.unlockAttached) return;

    const attemptPlay = () => {
      const queued = pendingSoundRef.current;
      pendingSoundRef.current = null;
      if (!queued) return;
      playSound(queued.src, queued.options);
    };

    const events = ["pointerdown", "mousedown", "touchend", "keydown", "click"]; 
    events.forEach((event) => {
      window.addEventListener(event, attemptPlay, { once: true, passive: true });
    });

    pendingSoundRef.current = { ...pending, unlockAttached: true };
  };

  const playSound = (src, options = {}) => {
    if (isMuted) return; // Don't play if globally muted

    const resolved = SOUND_LISTS[src] ? pickRandom(SOUND_LISTS[src]) : src;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(resolved);
    audio.volume = options.volume || 1;
    audio.loop = options.loop || false;

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

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    pendingSoundRef.current = null;
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
