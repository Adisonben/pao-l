"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REDIRECT_DELAY = 10;

export default function Error({ error, reset }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0f0f0f] text-white">
      <div className="flex flex-col items-center gap-6 text-center px-8">
        <span className="text-6xl">⚠️</span>
        <h2 className="text-2xl font-bold">เกิดข้อผิดพลาด</h2>
        <p className="text-zinc-400 max-w-md">
          ระบบพบปัญหาบางอย่าง กำลังกลับสู่หน้าหลักอัตโนมัติ
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
          >
            ลองใหม่
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
          >
            กลับหน้าหลัก
          </button>
        </div>
        <p className="text-xs text-zinc-600">
          กลับหน้าหลักอัตโนมัติใน{" "}
          <span className="font-bold text-zinc-400">{countdown}</span> วินาที
        </p>
      </div>
    </div>
  );
}
