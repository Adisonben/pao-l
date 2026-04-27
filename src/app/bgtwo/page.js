"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import KioskPanel from "../components/KioskPanel";
import { useKioskContext } from "@/context/KioskContext";
import { useGlobalSound } from "@/hooks/useGlobalSound";

export default function HomeWbgtwo() {
  const router = useRouter();
  const { sendCommand, wsConnected } = useKioskContext();
  const { playSound } = useGlobalSound();

  useEffect(() => {
    playSound("welcome");
  }, []);

  const handleStartTest = () => {
    sendCommand("START_TEST");
    router.push("/blow");
  };

  return (
    <main className="flex h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full object-cover z-1">
        <img src="/bg2.png" alt="" className="w-full h-full object-fit" />
      </div>
      <div className="flex w-[70%] flex-col p-6 pb-6">
        <div className="flex-1 overflow-hidden rounded-3xl bg-black/90">
          <AdPanel />
        </div>
      </div>
      <div className="flex w-[30%] flex-col p-6 pb-6">
        <div className="flex-1 overflow-hidden rounded-3xl">
          <KioskPanel onStartTest={handleStartTest} wsConnected={wsConnected} />
        </div>
      </div>
    </main>
  );
}
