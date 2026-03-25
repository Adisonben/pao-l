"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const ADS = [
  { type: "image", src: "/ads/ads1.jpg", duration: 10000 },
  { type: "image", src: "/ads/ads2.jpg", duration: 10000 },
  { type: "image", src: "/ads/ads3.jpg", duration: 10000 },
  { type: "image", src: "/ads/ads4.jpg", duration: 10000 },
];

const IDLE_TIMEOUT = 60_000;

export default function ScreenSaver() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const idleTimerRef = useRef(null);
  const adTimerRef = useRef(null);

  const resetIdle = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setAdIndex(0);
      setVisible(true);
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "touchstart", "keydown", "pointerdown"];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) resetIdle();
  }, [pathname]);

  const currentAd = ADS[adIndex];

  useEffect(() => {
    if (!visible) return;
    if (adTimerRef.current) clearTimeout(adTimerRef.current);
    if (currentAd.type !== "video") {
      adTimerRef.current = setTimeout(() => {
        setAdIndex((i) => (i + 1) % ADS.length);
      }, currentAd.duration || 6000);
    }
    return () => {
      if (adTimerRef.current) clearTimeout(adTimerRef.current);
    };
  }, [visible, adIndex]);

  const handleDismiss = () => {
    setVisible(false);
    router.push("/");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="screensaver"
          className="fixed inset-0 z-9999 cursor-pointer overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleDismiss}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={adIndex}
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
                  className="h-full w-full object-cover"
                  onEnded={() => setAdIndex((i) => (i + 1) % ADS.length)}
                />
              ) : (
                <Image
                  src={currentAd.src}
                  alt={`Advertisement ${adIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={adIndex === 0}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {ADS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === adIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            แตะหน้าจอเพื่อเริ่มใช้งาน
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
