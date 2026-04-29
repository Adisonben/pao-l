"use client";

import { useEffect, useState } from "react";

const REDIRECT_DELAY = 10;

export default function GlobalError({ error, reset }) {
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = "/";
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          background: "#0f0f0f",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            textAlign: "center",
            padding: "0 32px",
          }}
        >
          <span style={{ fontSize: 64 }}>⚠️</span>
          <h2 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
            ระบบเกิดข้อผิดพลาดร้ายแรง
          </h2>
          <p style={{ color: "#a1a1aa", margin: 0 }}>
            กำลังรีสตาร์ทระบบ...
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#facc15",
              color: "#000",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ลองใหม่
          </button>
          <p style={{ color: "#52525b", fontSize: 12, margin: 0 }}>
            กลับหน้าหลักอัตโนมัติใน {countdown} วินาที
          </p>
        </div>
      </body>
    </html>
  );
}
