"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import ResultPanel from "../components/ResultPanel";
import { useKioskContext } from "@/context/KioskContext";
import { useGlobalSound } from "@/hooks/useGlobalSound";

export default function ResultPage() {
  const router = useRouter();
  const { testResult, sendCommand, mode } = useKioskContext();
  const { playSound } = useGlobalSound();

  const result = testResult?.status === "OK" ? "pass" : "fail";
  const value = testResult?.value ?? null;

  useEffect(() => {
    playSound(result === "pass" ? "/sounds/voice_result_pass.mp3" : "/sounds/voice_result_fail.mp3");
  }, []);

  const handleDone = useCallback(() => {
    sendCommand("RESET");
    if (mode !== "interface") {
      router.push("/");
    }
  }, [sendCommand, router, mode]);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <ResultPanel
          result={result}
          value={value}
          onDone={mode === "interface" ? undefined : handleDone}
          manualMessage={
            mode === "interface"
              ? "Interface mode — use the controls to navigate when ready"
              : undefined
          }
        />
      </div>
    </main>
  );
}
