"use client";

import { motion } from "framer-motion";
import StartButton from "./StartButton";
import { FaRegClock, FaRegCopyright } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { AiOutlineSafety } from "react-icons/ai";
import { SiCodefresh } from "react-icons/si";
import { TbWind } from "react-icons/tb";

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

export default function KioskPanel({ onStartTest, wsConnected = false }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-[#0f0f0f] px-4 xl:px-8">
      <div className="absolute right-6 top-6 flex gap-2">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          <ReactCountryFlag countryCode="TH" svg style={{ width: '2em', height: '2em' }} />
          TH
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
        >
          <ReactCountryFlag countryCode="US" svg style={{ width: '2em', height: '2em' }} />
          EN
        </button>
      </div>
      <motion.div
        className="flex w-full flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo / Title */}
        <motion.div variants={itemVariants} className="mb-2 flex flex-col items-center gap-1">
          <span className="text-4xl font-black tracking-tight text-white">
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
          className="mb-4 h-px w-32 bg-yellow-400/40"
        />

        {/* Main instruction */}
        <motion.h1
          variants={itemVariants}
          className="text-2xl font-semibold leading-relaxed text-white"
        >
          <span>ตรวจวัดระดับ </span>
          <span className="text-yellow-400">แอลกอฮอล์</span>
          <br />
          <span>ก่อนขับรถ</span>
        </motion.h1>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mt-2 w-full flex justify-center">
          <StartButton onClick={onStartTest} disabled={!wsConnected} />
        </motion.div>

        {/* Sub instruction */}
        <motion.div
          variants={itemVariants}
          className="mt-2 text-zinc-400 mb-2"
        >
          <div className="flex items-center gap-2">
            <div className="text-5xl">
              <FaRegClock />
            </div>
            <div>
              <span className="text-xl">ใช้เวลาเพียง </span>
              <br />
              <span className="text-3xl text-yellow-400 font-bold">10</span><span className="text-xl xl:text-2xl"> วินาที</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full flex justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="text-lg xl:text-xl text-yellow-400">
              <AiOutlineSafety />
            </div>
            <div>
              <span className="text-lg xl:text-xl text-white">ปลอดภัย</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-lg xl:text-xl text-green-400">
              <SiCodefresh />
            </div>
            <div>
              <span className="text-lg xl:text-xl text-white">สะอาด</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-lg xl:text-xl text-blue-400">
              <TbWind />
            </div>
            <div>
              <span className="text-lg xl:text-xl text-white">รวดเร็ว</span>
            </div>
          </div>
        </motion.div>
      </motion.div>


      {/* Footer */}
      <motion.div variants={itemVariants} className="absolute bottom-0 flex gap-4">
        {/* copy right */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xs text-zinc-700"
        >
          <span className="flex items-center gap-1">
            <FaRegCopyright />
            <span>Pao-L</span>
          </span>
        </motion.p>

        {/* Connection status */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xs text-zinc-700 flex items-center gap-2"
        >
          <span
            className={`h-2 w-2 rounded-full ${wsConnected ? "bg-green-400" : "bg-zinc-600"
              }`}
          ></span>
          <span className="text-xs text-zinc-600">
            {wsConnected ? "เชื่อมต่อแล้ว" : "กำลังเชื่อมต่อ..."}
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
