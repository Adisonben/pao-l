"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import ResultPanel from "../components/ResultPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function ResultPage() {
  const router = useRouter();
  const { testResult, sendCommand, mode } = useKioskContext();

  const result = testResult?.status === "OK" ? "pass" : "fail";
  const value = testResult?.value ?? null;

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
