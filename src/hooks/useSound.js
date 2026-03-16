"use client";

import { useEffect, useRef } from "react";

export function useSound(src, options = {}) {
  const audioRef = useRef(null);
  const { volume = 1, loop = false, autoplay = true } = options;

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;

    if (autoplay) {
      audio.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, volume, loop, autoplay]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const mute = () => {
    if (audioRef.current) {
      audioRef.current.muted = true;
    }
  };

  const unmute = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
    }
  };

  return { play, stop, mute, unmute };
}
