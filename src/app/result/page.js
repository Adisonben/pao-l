"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdPanel from "../components/AdPanel";
import ResultPanel from "../components/ResultPanel";
import CleaningPanel from "../components/CleaningPanel";

export default function ResultPage() {
  const [phase, setPhase] = useState("result");

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>

      <AnimatePresence mode="wait">
        {phase === "result" ? (
          <motion.div
            key="result"
            className="w-[30%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultPanel result="pass" onDone={() => setPhase("cleaning")} />
          </motion.div>
        ) : (
          <motion.div
            key="cleaning"
            className="w-[30%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CleaningPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
