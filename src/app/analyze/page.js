"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import AnalyzePanel from "../components/AnalyzePanel";

export default function AnalyzePage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/result"), 10000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen ad */}
      <div className="h-full w-full">
        <AnalyzePanel />
      </div>

      {/* Loader overlay — bottom-right */}
      <div className="absolute bottom-8 right-8">
        <LoaderCircle />
      </div>
    </main>
  );
}

function LoaderCircle() {
  return (
    <div className="relative flex h-72 w-72 items-center justify-center">
      {/* Outer spinning ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
      />
      {/* Inner slower ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-transparent border-t-blue-400/50"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
      />
      {/* Center text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="z-10 text-center text-[40px] font-semibold leading-tight text-blue-400"
      >
        กำลัง
        <br />
        วิเคราะห์ผล
      </motion.span>
    </div>
  );
}
