"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalSound } from "@/hooks/useGlobalSound";

const COUNTDOWN_SEC = 10;

const ALCOHOL_TIERS = [
  { level: 0,  nickname: "ข้อผิดพลาด", symptom: "ไม่สามารถอ่านค่าได้",       color: "#71717a",  bg: "rgba(113,113,122,0.12)",  minMg: -Infinity, maxMg: -1,      icon_path: "", soundFolder: null },
  { level: 1,  nickname: "สุภาพชน",   symptom: "หน้าเริ่มตึงนิดๆ แต่ทรงยังเป๊ะ", color: "#4ade80",  bg: "rgba(74,222,128,0.10)",   minMg: 0,         maxMg: 30,     icon_path: "characters/level1.png", soundFolder: "sounds/result/level_1" },
  { level: 2,  nickname: "นักปราชญ์",  symptom: "พูดมาก รู้ทุกเรื่อง",         color: "#a3e635",  bg: "rgba(163,230,53,0.10)",   minMg: 31,        maxMg: 50,      icon_path: "characters/level2.png", soundFolder: "sounds/result/level_2" },
  { level: 3,  nickname: "เศรษฐี",     symptom: "สายเปย์ จ่ายไม่อั้น",        color: "#facc15",  bg: "rgba(250,204,21,0.10)",   minMg: 51,        maxMg: 100,     icon_path: "characters/level3.png", soundFolder: "sounds/result/level_3" },
  { level: 4,  nickname: "ศิลปิน",     symptom: "ร้องได้ทุกเพลง เต้นทุกแนว",  color: "#fb923c",  bg: "rgba(251,146,60,0.10)",   minMg: 101,       maxMg: 150,      icon_path: "characters/level4.png", soundFolder: "sounds/result/level_4" },
  { level: 5,  nickname: "จอมยุทธ์",   symptom: "หาเรื่อง ใครมีเรื่องบอกกู",    color: "#f87171",  bg: "rgba(248,113,113,0.10)",  minMg: 151,       maxMg: 200,      icon_path: "characters/level5.png", soundFolder: "sounds/result/level_5" },
  { level: 6,  nickname: "ร่างทรง",    symptom: "นิ่งเป็นหลับ ขยับเป็นร่วง",    color: "#e879f9",  bg: "rgba(232,121,249,0.10)",  minMg: 201,       maxMg: 250,       icon_path: "characters/level6.png", soundFolder: "sounds/result/level_6" },
  { level: 7,  nickname: "เทพ",      symptom: "เมื่อคืนกูกลับยังไงวะ",        color: "#f43f5e",  bg: "rgba(244,63,94,0.12)",    minMg: 251,       maxMg: Infinity, icon_path: "characters/level7.png", soundFolder: "sounds/result/level_7" },
];

const ADVICE = {
  0: "อุ๊ย! อ่านค่าไม่ได้เลย ลองเป่าใหม่อีกทีได้เลยนะ",
  1: "โอเคอยู่นะเพื่อน ไหวชิว แต่ดื่มน้ำด้วยละกัน อย่าประมาทล่ะ",
  2: "เริ่มใกล้เส้นแล้วนะเพื่อน พักดื่มแปปนึงได้แล้ว หาไรกินก่อนเลย แล้วค่อยคิดว่าจะกลับบ้านยังไงด้วยนะ",
  3: "เกินแล้วนะเพื่อน ขับรถไม่ได้เด็ดขาดเลยนะ เรียกรถไว้ก่อนเลย วันนี้ฝากกุญแจรถกับเพื่อนไปได้เลย",
  4: "เมาแล้วเพื่อน นั่งพักก่อนเลยนะ อย่าเดินคนเดียว ให้คนอยู่เป็นเพื่อนด้วย ดื่มน้ำเยอะๆ เดี๋ยวค่อยๆ ดีขึ้นเอง",
  5: "หยุดก่อนนะเพื่อน เมามากแล้ว ให้คนที่ไว้ใจได้อยู่ด้วยนะ นอนพักได้แล้ว",
  6: "เพื่อน! ต้องมีคนอยู่เฝ้าตลอดเลยนะ นอนตะแคงไว้ ถ้าอาการแย่ลงโทร 1669 ได้เลย อย่ารอนะ",
  7: "โทร 1669 เดี๋ยวนี้เลยนะ! ห้ามทิ้งไว้คนเดียวเด็ดขาด นอนตะแคงไว้ คอยดูการหายใจ รอรถพยาบาลด้วยกัน",
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
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);
  const isManual = Boolean(manualMessage);
  const tier = getAlcoholLevel(value);
  console.log(isManual);
  const { playSound } = useGlobalSound();

  useEffect(() => {
    if (isManual) return undefined;
    if (countdown <= 0) {
      if (onDone) onDone();
      else router.push("/");
      return undefined;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router, onDone, isManual]);

  useEffect(() => {
    if (tier.level === 0 || !tier.soundFolder) return;
    const soundPath = getRandomSoundPath(tier.soundFolder, tier.level);
    
    playSound(soundPath);
  }, [tier.level, tier.soundFolder, isManual]);

  return (
    <div className="flex h-screen flex-col bg-[#0f0f0f]">

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center gap-1 px-6 pt-8">
        <button
          onClick={() => router.push("/")}
          className="mb-3 flex items-center gap-1 self-start text-xs text-zinc-600 transition-colors hover:text-zinc-400"
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
        <div className="mt-3 h-px w-12 bg-yellow-400/30" />
      </div>

      <p className="text-center pt-2">ผลการตรวจวัดระดับแอลกอฮอล์ในลมหายใจ</p>

      {/* ── MAIN ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-10 py-4 text-center">
        <div className="bg-[#833535] flex flex-1 flex-col items-center justify-center gap-5 px-10 text-center rounded-4xl"
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
                ระดับที่ {tier.level}
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
            {/* {tier.level > 0 && (
              <span
                className="text-xs font-bold px-3 py-0.5 rounded-full"
                style={{ background: tier.color, color: "#0f0f0f" }}
              >
                ระดับที่ {tier.level}
              </span>
            )} */}
            <span className="text-5xl font-black" style={{ color: tier.color }}>
              {tier.nickname}
            </span>
          </motion.div>

          <div className="h-px w-full" style={{ background: tier.color }} />

          {/* Symptom */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="font-semibold  text-start w-full"
          >
            <span className="text-zinc-400 text-lg">อาการที่พบ:</span> <br />
            <span className="text-zinc-200 text-2xl">{tier.symptom}</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="font-semibold  text-start w-full"
          >
            <span className="text-zinc-400 text-md">คำแนะนำ:</span> <br />
            <span className="text-zinc-200 text-md">{ADVICE[tier.level]}</span>
          </motion.p>
          
          {/* BAC Value */}
          {/* {value !== null && value >= 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-0.5 rounded-xl px-6 py-3"
              style={{ background: tier.bg, borderColor: tier.color, border: `1px solid ${tier.color}40` }}
            >
              <span className="text-4xl font-black tabular-nums" style={{ color: tier.color }}>
                {(value * 1000).toFixed(1)}
              </span>
              <span className="text-sm text-zinc-400 tracking-widest uppercase">mg%</span>
            </motion.div>
          )} */}

          {/* Countdown / manual */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-sm text-zinc-600"
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
                กลับหน้าหลักใน{" "}
                <span className="font-bold text-zinc-300">{countdown}</span>{" "}
                วินาที
              </>
            )}
          </motion.p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="pb-6 text-center text-xs text-zinc-700"
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
