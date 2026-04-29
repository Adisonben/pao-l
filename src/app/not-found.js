"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REDIRECT_DELAY = 5;

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

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
      <div className="flex flex-col items-center gap-4 text-center px-8">
        <span className="text-7xl font-black text-yellow-400">404</span>
        <h2 className="text-2xl font-bold">ไม่พบหน้าที่ต้องการ</h2>
        <p className="text-zinc-400">หน้านี้ไม่มีอยู่ในระบบ</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-xl bg-yellow-400 px-8 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
        >
          กลับหน้าหลัก
        </button>
        <p className="text-xs text-zinc-600">
          กลับหน้าหลักอัตโนมัติใน{" "}
          <span className="font-bold text-zinc-400">{countdown}</span> วินาที
        </p>
      </div>
    </div>
  );
}
