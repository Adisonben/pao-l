"use client";

import { motion } from "framer-motion";
import { TbSquarePlus, TbArrowBigRightLines, TbWind } from "react-icons/tb";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlineStop } from "react-icons/ai";
import { AiOutlineSafety } from "react-icons/ai";
import { SiCodefresh } from "react-icons/si";

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
    <div className="relative flex h-full w-full flex-col bg-[#272727] px-4 xl:px-12 py-4 xl:py-10 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-5xl font-black tracking-tight text-yellow-400 border-b border-yellow-400 pb-4"
      >
        <LuClipboardList className="inline-block mr-4" /><span>วิธีใช้</span><span className="text-white">เครื่องตรวจวัดแอลกอฮอล์</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-2 flex-1"
      >
        <div className="relative flex flex-col overflow-hidden rounded-4xl px-4 xl:px-10 mb-4 xl:mb-10">
          <div className="absolute inset-y-0 right-0 w-1/3" aria-hidden="true" />
          <ol className="relative z-10 flex flex-1 flex-col justify-between">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <li
                key={title}
                className="flex flex-1 items-center gap-6 border-b border-white/10 py-4 last:border-b-0 last:pb-0"
              >
                <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full border border-yellow-400/50 text-5xl font-bold text-yellow-400">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1 xl:gap-2 text-left">
                  <h3 className="text-4xl font-semibold text-yellow-400">{title}</h3>
                  <p className="text-xl text-zinc-300">{description}</p>
                </div>
                <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/30 text-5xl text-yellow-100">
                  <Icon />
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <div className="flex gap-4 items-center justify-center border-t border-b border-yellow-400/50 p-2">
            <div className="flex items-center justify-center">
              <AiOutlineStop className="text-6xl text-red-500" />
            </div>
            <div>
              <p className="text-2xl text-zinc-300"><span className="text-red-400">ห้าม</span>ใช้หลอดจากแก้วน้ำ</p>
              <p className="text-2xl text-zinc-300"><span className="text-red-400">ห้าม</span>นำของเหลวเข้าช่องเป่า</p>
            </div>
          </div>
        </div>
        <div className="mt-2 xl:mt-5 w-full flex justify-center gap-4 xl:gap-6">
          <div className="flex items-center gap-1">
            <div className="text-2xl text-yellow-400">
              <AiOutlineSafety />
            </div>
            <div>
              <span className="text-2xl">ปลอดภัย</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-2xl text-green-400">
              <SiCodefresh />
            </div>
            <div>
              <span className="text-2xl ">สะอาด</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-2xl text-blue-400">
              <TbWind />
            </div>
            <div>
              <span className="text-2xl">รวดเร็ว</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}