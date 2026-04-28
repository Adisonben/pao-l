"use client";

import { useState, useEffect } from "react";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";

export default function FullscreenHandler() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (isFullscreen) return null;

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed bottom-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/50 text-white backdrop-blur-sm transition-all hover:bg-zinc-900/80 active:scale-95"
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullscreen ? (
        <BsFullscreenExit className="h-4 w-4 opacity-60" />
      ) : (
        <BsFullscreen className="h-4 w-4 opacity-60" />
      )}
    </button>
  );
}
