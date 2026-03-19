"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalSound } from "@/hooks/useGlobalSound";

/**
 * sensorState values from backend alcohol_state events:
 *   connecting, warming_up → "preparing"
 *   ready                  → "ready"
 *   sampling, breath_detected → "blowing"
 *   flow_error             → "flow_error"
 *   timeout, error         → "error"
 */
const PHASES = {
  preparing:  { label: "กำลังเตรียมพร้อม...", color: "text-zinc-400", iconColor: "#71717a" },
  ready:      { label: "พร้อมแล้ว — เป่าลมได้เลย", color: "text-yellow-400", iconColor: "#facc15" },
  blowing:    { label: "ตรวจพบลมหายใจ...", color: "text-blue-400", iconColor: "#60a5fa" },
  flow_error: { label: "เป่าไม่ถูกต้อง กรุณาลองใหม่", color: "text-red-400", iconColor: "#f87171" },
  error:      { label: "เชื่อมต่อ hardware ล้มเหลว", color: "text-red-500", iconColor: "#ef4444" },
};

function sensorStateToPhase(sensorState) {
  switch (sensorState) {
    case "ready":           return "ready";
    case "sampling":
    case "breath_detected": return "blowing";
    case "flow_error":      return "flow_error";
    case "timeout":
    case "error":           return "error";
    case "connecting":
    case "warming_up":
    default:                return "preparing";
  }
}

export default function BlowPanel({ sensorState, errorCountdown = null }) {
  const router = useRouter();
  const phase = sensorStateToPhase(sensorState);
  const { playSound } = useGlobalSound();

  useEffect(() => {
    playSound("/sounds/voice_breathing.mp3");
  }, [playSound]);

  const current = PHASES[phase] ?? PHASES.preparing;

  return (
    <div className="flex h-screen flex-col bg-[#0f0f0f]">

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center gap-1 px-8 pt-10">
        <button
          onClick={() => router.push("/")}
          className="mb-4 flex items-center gap-1 self-start text-xs text-zinc-600 transition-colors hover:text-zinc-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          กลับ
        </button>
        <span className="text-3xl font-black tracking-tight text-white">
          Pao<span className="text-yellow-400">-L</span>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
          Alcohol Breath Test
        </span>
        <div className="mt-4 h-px w-16 bg-yellow-400/30" />
        <h1 className="mt-4 text-lg font-semibold leading-relaxed text-white">
          ทดสอบระดับแอลกอฮอล์
        </h1>
      </div>

      {/* ── MAIN ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
        <motion.div
          animate={
            phase === "ready"
              ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" } }
              : { scale: 1 }
          }
          style={{
            filter: phase === "ready" ? `drop-shadow(0 0 18px ${current.iconColor}88)` : "none",
          }}
        >
          <BlowIcon color={current.iconColor} />
        </motion.div>

        <div className="relative h-10 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className={`text-base font-semibold tracking-wide ${current.color}`}
            >
              {current.label}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {phase === "ready" ? (
            <motion.p
              key="hint-ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-zinc-600"
            >
              กรุณาเป่าลมเข้าท่อ
            </motion.p>
          ) : errorCountdown !== null ? (
            <motion.p
              key="hint-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-400"
            >
              จะกลับหน้าหลักใน {errorCountdown} วินาที หากยังเชื่อมต่อไม่ได้
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="pb-8 text-center text-xs text-zinc-700"
      >
        PAO AL · กรุณาเป่าลมให้ต่อเนื่อง 10 วินาที
      </motion.p>
    </div>
  );
}

function BlowIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={100}
      height={100}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "stroke 0.4s ease" }}
    >
      <circle cx="22" cy="28" r="14" />
      <path d="M16 31 q6 6 12 0" />
      <circle cx="18" cy="25" r="1.5" fill={color} stroke="none" />
      <circle cx="26" cy="25" r="1.5" fill={color} stroke="none" />
      <path d="M36 28 q6-4 14 0" />
      <path d="M36 32 q8-2 16 2" strokeOpacity="0.6" />
      <path d="M36 36 q5 2 10 5" strokeOpacity="0.35" />
    </svg>
  );
}
