"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalSound } from "@/hooks/useGlobalSound";
import { SiCodefresh } from "react-icons/si";
import { useKioskContext } from "@/context/KioskContext";

const ALCOHOL_TIERS = [
  { level: 0, nickname: "ข้อผิดพลาด", symptom: "ไม่สามารถอ่านค่าได้", color: "#71717a", bg: "rgba(113,113,122,0.12)", minMg: -Infinity, maxMg: -1, icon_path: "", soundFolder: null },
  { level: 1, nickname: "สุภาพชน", symptom: "หน้าเริ่มตึงนิดๆ แต่ทรงยังเป๊ะ", color: "#4ade80", bg: "rgba(74,222,128,0.10)", minMg: 0, maxMg: 30, icon_path: "characters/level1.png", soundFolder: "sounds/result/level_1" },
  { level: 2, nickname: "นักปราชญ์", symptom: "พูดมาก รู้ทุกเรื่อง", color: "#a3e635", bg: "rgba(163,230,53,0.10)", minMg: 31, maxMg: 50, icon_path: "characters/level2.png", soundFolder: "sounds/result/level_2" },
  { level: 3, nickname: "เศรษฐี", symptom: "สายเปย์ จ่ายไม่อั้น", color: "#facc15", bg: "rgba(250,204,21,0.10)", minMg: 51, maxMg: 100, icon_path: "characters/level3.png", soundFolder: "sounds/result/level_3" },
  { level: 4, nickname: "ศิลปิน", symptom: "ร้องได้ทุกเพลง เต้นทุกแนว", color: "#fb923c", bg: "rgba(251,146,60,0.10)", minMg: 101, maxMg: 150, icon_path: "characters/level4.png", soundFolder: "sounds/result/level_4" },
  { level: 5, nickname: "จอมยุทธ์", symptom: "หาเรื่อง ใครมีเรื่องบอกกู", color: "#f87171", bg: "rgba(248,113,113,0.10)", minMg: 151, maxMg: 200, icon_path: "characters/level5.png", soundFolder: "sounds/result/level_5" },
  { level: 6, nickname: "ร่างทรง", symptom: "นิ่งเป็นหลับ ขยับเป็นร่วง", color: "#e879f9", bg: "rgba(232,121,249,0.10)", minMg: 201, maxMg: 250, icon_path: "characters/level6.png", soundFolder: "sounds/result/level_6" },
  { level: 7, nickname: "เทพ", symptom: "เมื่อคืนกูกลับยังไงวะ", color: "#f43f5e", bg: "rgba(244,63,94,0.12)", minMg: 251, maxMg: Infinity, icon_path: "characters/level7.png", soundFolder: "sounds/result/level_7" },
];

const ADVICE = {
  0: "อุ๊ย! อ่านค่าไม่ได้เลย ลองเป่าใหม่อีกทีได้เลยนะ",
  1: "โอเคอยู่นะเพื่อน ไหวชิว แต่ดื่มน้ำด้วยละกัน อย่าประมาทล่ะ",
  2: "เริ่มใกล้เส้นแล้วนะเพื่อน พักดื่มแปปนึงได้แล้ว หาไรกินก่อนเลย",
  3: "เกินแล้วนะเพื่อน ขับรถไม่ได้เด็ดขาดเลยนะ เรียกรถไว้ก่อนเลย",
  4: "เมาแล้วเพื่อน นั่งพักก่อนเลยนะ ดื่มน้ำเยอะๆ เดี๋ยวค่อยๆ ดีขึ้นเอง",
  5: "หยุดก่อนนะเพื่อน เมามากแล้ว นอนพักได้แล้ว",
  6: "เพื่อน! ต้องมีคนอยู่เฝ้าตลอดเลยนะ นอนตะแคงไว้",
  7: "โทร 1669 เดี๋ยวนี้เลยนะ! ห้ามทิ้งไว้คนเดียวเด็ดขาด",
};

function getAlcoholLevel(value) {
  if (value === null || value === undefined || value < 0) {
    return ALCOHOL_TIERS[0];
  }
  const mg = value * 1000;
  return ALCOHOL_TIERS.find((t) => t.level > 0 && mg >= t.minMg && mg <= t.maxMg)
    ?? ALCOHOL_TIERS[ALCOHOL_TIERS.length - 1];
}

function getRandomSoundPath(soundFolder, level) {
  const randomIndex = Math.floor(Math.random() * 3) + 1;
  return `/${soundFolder}/result_${level}${randomIndex}.wav`;
}

export default function ResultPanel({
  result = "pass",
  value = null,
  onDone,
  manualMessage,
}) {
  const router = useRouter();
  const isManual = Boolean(manualMessage);
  const tier = getAlcoholLevel(value);
  const { playSound } = useGlobalSound();
  const { sendCommand, resetResult } = useKioskContext();
  const [countdown, setCountdown] = useState(10);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [resetSucceeded, setResetSucceeded] = useState(false);

  // Send RESET_SENSOR on mount
  useEffect(() => {
    sendCommand("RESET_SENSOR");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track reset success from backend
  useEffect(() => {
    if (!resetResult) return;
    if (resetResult.success) {
      setResetSucceeded(true);
    } else {
      // Reset failed — retry
      console.warn("[ResultPanel] Reset failed, retrying...");
      sendCommand("RESET_SENSOR");
    }
  }, [resetResult, sendCommand]);

  // Countdown logic: 10s initially, then 5s loops until reset success
  useEffect(() => {
    if (isManual) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
        setElapsedTime((e) => e + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Check for success when countdown hits 0
      if (resetSucceeded) {
        if (onDone) onDone();
        else router.push("/");
      } else {
        // Still not ready, wait another 5 seconds
        setCountdown(5);
        // Note: we continue incrementing elapsedTime via the next countdown cycle
      }
    }
  }, [countdown, resetSucceeded, isManual, onDone, router]);

  // Play result sound
  useEffect(() => {
    if (tier.level === 0 || !tier.soundFolder) return;
    const soundPath = getRandomSoundPath(tier.soundFolder, tier.level);
    playSound(soundPath);
  }, [tier.level]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-col bg-[#0f0f0f]">

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center gap-1 px-4 pt-2">
        <button
          onClick={() => router.push("/")}
          className=" flex items-center gap-1 self-start text-xs text-zinc-600 transition-colors hover:text-zinc-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          กลับหน้าหลัก
        </button>
        <span className="text-2xl font-black tracking-tight text-white">
          Pao<span className="text-yellow-400">-L</span>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
          Alcohol Breath Test
        </span>
        <div className="h-px w-12 bg-yellow-400/30" />
      </div>

      <p className="text-center pt-2 text-white">ผลการตรวจวัดระดับแอลกอฮอล์ในลมหายใจ</p>

      {/* ── MAIN ── */}
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-4 text-center">
        <div className="bg-[#833535] flex flex-1 flex-col items-center justify-center gap-2 px-6 py-6 text-center rounded-4xl"
          style={{
            background: `${tier.color}20`,
            border: `2px solid ${tier.color}`,
          }}
        >
          {/* Level + Nickname */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-1"
          >
            {tier.level > 0 && (
              <span
                className="text-xl font-bold px-3 py-0.5 rounded-full"
                style={{ background: tier.color, color: "#0f0f0f" }}
              >
                ระดับที่ {tier.level} ({value * 1000} mg%)
              </span>
            )}
          </motion.div>

          {/* Icon */}
          <ResultIcon tier={tier} />

          {/* Level + Nickname */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-4xl font-black" style={{ color: tier.color }}>
              {tier.nickname}
            </span>
          </motion.div>

          <div className="h-px w-full" style={{ background: tier.color }} />

          {/* Symptom */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="font-semibold text-start w-full"
          >
            <span className="text-zinc-400 text-base xl:text-lg">อาการที่พบ:</span> <br />
            <span className="text-zinc-200 text-xl">{tier.symptom}</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="font-semibold text-start w-full"
          >
            <span className="text-zinc-400 text-sm xl:text-md">คำแนะนำ:</span> <br />
            <span className="text-zinc-200 text-sm xl:text-md">{ADVICE[tier.level]}</span>
          </motion.p>
        </div>
      </div>

      {/* Resetting status / manual */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="flex items-center justify-center gap-2 text-sm text-zinc-300"
      >
        {isManual ? (
          <span
            className="rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{ background: tier.bg, color: tier.color }}
          >
            {manualMessage}
          </span>
        ) : (
          <>
            <span className="relative flex h-10 w-10 items-center justify-center text-green-500">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-green-500/20 border-t-green-500" />
              <SiCodefresh className="text-lg" />
            </span>
            <span className="text-base">
              กำลังทำความสะอาดเซนเซอร์... ({elapsedTime} วินาที)
            </span>
          </>
        )}
      </motion.p>

      {/* ── FOOTER ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mt-auto pb-3 xl:pb-6 text-center text-xs text-zinc-300"
      >
        PAO AL · ขอบคุณที่ใช้บริการ
      </motion.p>
    </div>
  );
}

function ResultIcon({ tier }) {
  return (
    <>
      {tier.level === 0 ? (
        <span
          style={{
            fontSize: 52,
            lineHeight: 1,
            userSelect: "none",
            color: "red",
          }}
        >
          ?
        </span>
      ) : (
        <div className="overflow-hidden w-full flex justify-center items-center">
          <div className="frame">
            <img src={`/${tier.icon_path}`} alt={`Level ${tier.level} character`} />
          </div>
        </div>
      )}
    </>
  );
}
