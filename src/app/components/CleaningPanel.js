"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const COUNTDOWN_SEC = 5;

export default function CleaningPanel() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0f0f0f]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <CleaningSpinner />

        <p className="text-2xl font-bold tracking-wide text-white">
          กำลังทำความสะอาด
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-zinc-500"
        >
          กลับหน้าหลักใน{" "}
          <span className="font-bold text-zinc-300">{countdown}</span> วินาที
        </motion.p>
      </motion.div>
    </div>
  );
}

function CleaningSpinner() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-3 rounded-full border-2 border-transparent border-t-cyan-400/50"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
      <motion.div
        className="h-3 w-3 rounded-full bg-cyan-400"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
      />
    </div>
  );
}
