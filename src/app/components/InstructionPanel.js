"use client";

import { motion } from "framer-motion";
import { TbSquarePlus, TbArrowBigRightLines, TbWind } from "react-icons/tb";
import { LuClipboardList } from "react-icons/lu";

const steps = [
  {
    title: "หยิบหลอดใหม่",
    description: "รับหลอดใหม่จากกล่องด้านข้าง",
    icon: TbSquarePlus,
  },
  {
    title: "เสียบหลอดที่ช่องเป่า",
    description: "ใส่หลอดลงในช่องเป่าให้แน่น",
    icon: TbArrowBigRightLines,
  },
  {
    title: "เป่าลมค้างไว้ประมาณ 3 วินาที",
    description: "เริ่มเป่าเมื่อสัญญาณพร้อมและเป่าต่อเนื่อง",
    icon: TbWind,
  },
];

export default function InstructionPanel() {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#272727] px-12 py-10 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-6xl font-black tracking-tight text-yellow-400"
      >
        <LuClipboardList className="inline-block mr-4" /><span>วิธีใช้เครื่องตรวจวัดแอลกอฮอล์</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10 flex-1"
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-4xl border border-yellow-400/15 bg-white/5 px-10 py-8">
          <div className="absolute inset-y-0 right-0 w-1/3" aria-hidden="true" />
          <ol className="relative z-10 flex flex-1 flex-col justify-between">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <li
                key={title}
                className="flex flex-1 items-center gap-8 border-b border-white/10 py-6 last:border-b-0 last:pb-0"
              >
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-yellow-400/50 text-6xl font-bold text-yellow-400">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-col gap-2 text-left">
                  <h3 className="text-6xl font-semibold text-yellow-400">{title}</h3>
                  <p className="text-4xl text-zinc-300">{description}</p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/30 text-4xl text-yellow-100">
                  <Icon />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </div>
  );
}