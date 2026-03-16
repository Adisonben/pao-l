"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// type Ad = {
//   type: "image" | "gif" | "video";
//   src: string;
//   duration?: number; // ใช้กับ image/gif
// };

const ADS = [
  { type: "video", src: "/ads/ads6.mp4" },
];

export default function AnalyzePanel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const currentAd = ADS[index];

  const nextAd = () => {
    setIndex((i) => (i + 1) % ADS.length);
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (currentAd.type !== "video") {
      timerRef.current = setTimeout(() => {
        nextAd();
      }, currentAd.duration || 6000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      <AnimatePresence mode="wait">

        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >

          {currentAd.type === "video" ? (
            <video
              src={currentAd.src}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-fit"
              onEnded={nextAd}
            />
          ) : (
            <Image
              src={currentAd.src}
              alt={`Advertisement ${index + 1}`}
              fill
              className="object-fit"
              priority={index === 0}
            />
          )}

        </motion.div>

      </AnimatePresence>

      {/* Dot indicators */}

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {ADS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

    </div>
  );
}