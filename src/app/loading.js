"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border-2 border-transparent border-t-yellow-400/40"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          />
        </div>

        {/* Brand */}
        <span className="text-2xl font-black tracking-tight text-white">
          Pao<span className="text-yellow-400">-L</span>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
          กำลังโหลด...
        </span>
      </div>
    </div>
  );
}
