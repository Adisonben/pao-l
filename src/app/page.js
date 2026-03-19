"use client";

import { useRouter } from "next/navigation";
import AdPanel from "./components/AdPanel";
import KioskPanel from "./components/KioskPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function Home() {
  const router = useRouter();
  const { sendCommand, wsConnected } = useKioskContext();

  const handleStartTest = () => {
    sendCommand("START_TEST");
    router.push("/blow");
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
