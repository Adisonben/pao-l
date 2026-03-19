"use client";

import AdPanel from "./components/AdPanel";
import KioskPanel from "./components/KioskPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function Home() {
  const { sendCommand, wsConnected } = useKioskContext();

  const handleStartTest = () => {
    sendCommand("START_TEST");
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <KioskPanel onStartTest={handleStartTest} wsConnected={wsConnected} />
      </div>
    </main>
  );
}
