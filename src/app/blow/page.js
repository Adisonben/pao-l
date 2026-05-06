"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InstructionPanel from "../components/InstructionPanel";
import BlowPanel from "../components/BlowPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function BlowPage() {
  const router = useRouter();
  const { sensorState, testResult, mode } = useKioskContext();
  const navigatedRef = useRef(false);

  // Navigate to analyze page when test result is received
  useEffect(() => {
    if (
      mode !== "interface" &&
      testResult &&
      testResult.success &&
      !navigatedRef.current
    ) {
      navigatedRef.current = true;
      router.push("/analyze");
    }
  }, [testResult, router, mode]);

  return (
    <main className="flex h-screen overflow-hidden bg-black">
      <div className="flex w-[70%] flex-col p-6 pb-6">
        <div className="flex-1 overflow-hidden rounded-3xl bg-black/90">
          <InstructionPanel />
        </div>
      </div>
      <div className="flex w-[30%] flex-col p-6 pb-6">
        <div className="flex-1 overflow-hidden rounded-3xl">
          <BlowPanel sensorState={sensorState} />
        </div>
      </div>
    </main>
  );
}
