"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import StartButton from "./StartButton";
import { useGlobalSound } from "@/hooks/useGlobalSound";

/**
 * KioskPanel — Right 30% interactive kiosk interface.
 * Contains branding, instructions, and the start-test CTA.
 */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function KioskPanel({ onStartTest }) {
  const { playSound } = useGlobalSound();
  
  useEffect(() => {
    playSound("/sounds/voice_welcome.mp3");
  }, [playSound]);
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0f0f0f] px-8">
      <motion.div
        className="flex w-full flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo / Title */}
        <motion.div variants={itemVariants} className="mb-6 flex flex-col items-center gap-1">
          <span className="text-5xl font-black tracking-tight text-white">
            Pao
            <span className="text-yellow-400">-L</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
            Alcohol Breath Test Station
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="mb-8 h-px w-16 bg-yellow-400/40"
        />

        {/* Main instruction */}
        <motion.h1
          variants={itemVariants}
          className="text-xl font-semibold leading-relaxed text-white"
        >
          ตรวจวัดระดับแอลกอฮอล์
          <br />
          ก่อนขับรถ
        </motion.h1>

        {/* Sub instruction */}
        <motion.p
          variants={itemVariants}
          className="mt-3 text-sm text-zinc-400"
        >
          ใช้เวลาเพียง 10 วินาที
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mt-2 w-full flex justify-center">
          <StartButton onClick={onStartTest} />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 text-xs text-zinc-700"
      >
        PAO AL · กดปุ่มเพื่อเริ่มการทดสอบ
      </motion.p>
    </div>
  );
}
