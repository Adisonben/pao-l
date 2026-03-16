"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalSound } from "@/hooks/useGlobalSound";

const COUNTDOWN_SEC = 6;

export default function ResultPanel({ result = "pass", onDone }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);
  const isPass = result === "pass";
  
  const { playSound } = useGlobalSound();
  
  useEffect(() => {
    playSound(isPass ? "/sounds/voice_result_pass.mp3" : "/sounds/voice_result_fail.mp3");
  }, [isPass, playSound]);

  useEffect(() => {
    if (countdown <= 0) {
      if (onDone) onDone();
      else router.push("/");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router, onDone]);

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
          กลับหน้าหลัก
        </button>
        <span className="text-3xl font-black tracking-tight text-white">
          Pao<span className="text-yellow-400">-L</span>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
          Alcohol Breath Test
        </span>
        <div className="mt-4 h-px w-16 bg-yellow-400/30" />
        <h1 className="mt-4 text-lg font-semibold leading-relaxed text-white">
          ผลตรวจวัดระดับแอลกอฮอล์
        </h1>
      </div>

      {/* ── MAIN ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
        <ResultIcon isPass={isPass} />

        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 18 }}
          className={`text-5xl font-black tracking-widest ${
            isPass ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPass ? "Pass" : "Fail"}
        </motion.span>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`text-sm font-medium ${
            isPass ? "text-green-400/70" : "text-red-400/70"
          }`}
        >
          {isPass ? "ระดับแอลกอฮอล์อยู่ในเกณฑ์ปกติ" : "ระดับแอลกอฮอล์เกินมาตรฐาน"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xs text-zinc-600"
        >
          กลับหน้าหลักใน{" "}
          <span className="font-bold text-zinc-400">{countdown}</span>{" "}
          วินาที
        </motion.p>
      </div>

      {/* ── FOOTER ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="pb-8 text-center text-xs text-zinc-700"
      >
        PAO AL · ขอบคุณที่ใช้บริการ
      </motion.p>
    </div>
  );
}

function ResultIcon({ isPass }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 16 }}
      className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${
        isPass
          ? "border-green-400/40 bg-green-400/10"
          : "border-red-400/40 bg-red-400/10"
      }`}
    >
      {isPass ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f87171"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M18 6L6 18M6 6l12 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          />
        </svg>
      )}
    </motion.div>
  );
}
