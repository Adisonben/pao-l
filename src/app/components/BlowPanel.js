"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalSound } from "@/hooks/useGlobalSound";
import { useKioskContext } from "@/context/KioskContext";

/**
 * sensorState values from backend alcohol_state events:
 *   connecting, warming_up → "preparing"
 *   ready                  → "ready"
 *   sampling, breath_detected → "blowing"
 *   flow_error             → "flow_error"
 *   timeout, error         → "error"
 */
export const PHASES = {
  preparing: { label: "กำลังเตรียมพร้อม...", color: "text-zinc-400", iconColor: "#71717a", description: "กำลังเตรียมอุปกรณ์และกำหนดค่าให้พร้อมใช้งาน" },
  ready: { label: "พร้อมแล้ว เป่าลมได้เลย!", color: "text-green-400", iconColor: "#86efac", description: "อุปกรณ์พร้อมใช้งานและพร้อมตรวจพบลมหายใจ" },
  blowing: { label: "ตรวจพบลมหายใจ...", color: "text-blue-400", iconColor: "#60a5fa", description: "กำลังเข้าสู่การตรวจลมหายใจ" },
  flow_error: { label: "เป่าไม่ถูกต้อง กรุณาลองใหม่", color: "text-red-400", iconColor: "#f87171", description: "ตรวจพบลมหายใจไม่ถูกต้อง กรุณาลองใหม่" },
  error: { label: "เชื่อมต่ออุปกรณ์ล้มเหลว", color: "text-red-500", iconColor: "#ef4444", description: "มีปัญหาในการเชื่อมต่อกับอุปกรณ์ กรุณาตรวจสอบเครื่องมือและลองใหม่" },
};

export function sensorStateToPhase(sensorState) {
  switch (sensorState) {
    case "ready": return "ready";
    case "sampling":
    case "breath_detected": return "blowing";
    case "flow_error": return "flow_error";
    case "timeout":
    case "error": return "error";
    case "connecting":
    case "warming_up":
    default: return "preparing";
  }
}

export default function BlowPanel({ sensorState }) {
  const router = useRouter();
  const { playSound } = useGlobalSound();
  const { sendCommand } = useKioskContext();
  const phase = sensorStateToPhase(sensorState);
  const previousPhaseRef = useRef(phase);

  const [countdown, setCountdown] = useState(600);

  const current = PHASES[phase] ?? PHASES.preparing;

  useEffect(() => {
    if (countdown <= 0) {
      sendCommand("RESET_SENSOR");
      router.push("/");
      return undefined;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router, sendCommand]);

  useEffect(() => {
    // Play sound when entering "ready" or "blowing" phases
    if ((phase === "ready" || phase === "blowing") && previousPhaseRef.current !== phase) {
      playSound("/sounds/voice_breathing.mp3");
    }
    previousPhaseRef.current = phase;
  }, [phase, playSound]);

  return (
    <div className="flex h-screen flex-col bg-[#0f0f0f]">

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center gap-1 px-4 xl:px-8 pt-4 xl:pt-10">
        <button
          onClick={() => { sendCommand("RESET_SENSOR"); router.push("/"); }}
          className="mb-2 xl:mb-4 flex items-center gap-1 self-start text-xs text-zinc-600 transition-colors hover:text-zinc-400"
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
        <div className="mt-2 xl:mt-4 h-px w-16 bg-yellow-400/30" />
        <h1 className="mt-2 xl:mt-4 text-xl xl:text-2xl font-semibold leading-relaxed text-white">
          ทดสอบระดับแอลกอฮอล์
        </h1>
      </div>

      {/* ── MAIN ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 xl:gap-6 px-4 xl:px-8 text-center">
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

        <div className="relative h-30 w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className={`text-2xl xl:text-3xl font-semibold tracking-wide ${current.color}`}
            >
              {current.label}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key="hint-ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-base text-zinc-600"
            >
              {current.description}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div className="pb-4 xl:pb-8 flex flex-col items-center gap-1">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-xs text-zinc-700"
        >
          PAO AL · กรุณาเป่าลมให้ต่อเนื่อง 10 วินาที
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest"
        >
          กลับหน้าหลักใน {countdown} วินาที
        </motion.p>
      </div>
    </div>
  );
}

function BlowIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={200}
      className="xl:w-[250px] xl:h-[250px]"
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
