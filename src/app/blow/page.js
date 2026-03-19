"use client";

import AdPanel from "../components/AdPanel";
import BlowPanel from "../components/BlowPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function BlowPage() {
  const { kioskUpdate, sendCommand } = useKioskContext();

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <BlowPanel kioskUpdate={kioskUpdate} sendCommand={sendCommand} />
      </div>
    </main>
  );
}
