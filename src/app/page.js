"use client";

import { useRouter } from "next/navigation";
import AdPanel from "./components/AdPanel";
import KioskPanel from "./components/KioskPanel";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <KioskPanel onStartTest={() => router.push("/blow")} />
      </div>
    </main>
  );
}
