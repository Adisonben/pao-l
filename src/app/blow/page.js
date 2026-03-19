"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import BlowPanel from "../components/BlowPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function BlowPage() {
  const router = useRouter();
  const { sensorState, testResult } = useKioskContext();
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (testResult && testResult.success && !navigatedRef.current) {
      navigatedRef.current = true;
      router.push("/analyze");
    }
  }, [testResult, router]);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <BlowPanel sensorState={sensorState} />
      </div>
    </main>
  );
}
