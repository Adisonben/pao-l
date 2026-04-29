"use client";

import { useCallback, useEffect } from "react";
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
    <main className="flex h-screen overflow-hidden bg-black">
      <div className="flex w-[70%] flex-col p-6 pb-6">
        <div className="flex-1 overflow-hidden rounded-3xl bg-black/90">
          <AdPanel />
        </div>
      </div>
      <div className="flex w-[30%] flex-col p-6 pb-6">
        <div className="flex-1 overflow-hidden rounded-3xl">
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
      </div>
    </main>
  );
}
