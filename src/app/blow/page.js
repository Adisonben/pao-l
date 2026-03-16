"use client";

import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import BlowPanel from "../components/BlowPanel";

export default function BlowPage() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <BlowPanel onBlowStart={() => router.push("/analyze")} />
      </div>
    </main>
  );
}
