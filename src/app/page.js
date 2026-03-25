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
    <main className="flex h-screen overflow-hidden">
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
