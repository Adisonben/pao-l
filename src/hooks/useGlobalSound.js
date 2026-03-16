"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const GlobalSoundContext = createContext();

export function GlobalSoundProvider({ children }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = (src, options = {}) => {
    if (isMuted) return; // Don't play if globally muted
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(src);
    audio.volume = options.volume || 1;
    audio.loop = options.loop || false;
    
    audio.play().catch((err) => {
      console.warn("Audio play failed:", err);
    });
    
    audioRef.current = audio;
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const mute = () => {
    setIsMuted(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
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

  // Stop sound when component unmounts
  useEffect(() => {
    return () => {
      context.stopSound();
    };
  }, [context]);

  return context;
}
