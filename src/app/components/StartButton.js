"use client";

import { useState } from "react";

const heartbeatRingStyles = [
  { border: "2.5px solid rgba(255,200,50,0.75)", delay: "0s" },
  { border: "2px solid rgba(255,160,20,0.5)", delay: "0.08s" },
  { border: "1.5px solid rgba(255,120,0,0.3)", delay: "0.16s" },
];

export default function StartButton({
  label = "เริ่ม",
  sublabel = "ทดสอบ",
  onClick,
  size = 220,
}) {
  const [pressing, setPressing] = useState(false);

  const handlePointerDown = () => {
    setPressing(true);
    onClick?.();
  };

  return (
    <>
      <style>{`
        @keyframes heartbeat-ring {
          0%   { transform: scale(1); opacity: 0.8; }
          14%  { transform: scale(1.08); opacity: 0.6; }
          28%  { transform: scale(1); opacity: 0.8; }
          42%  { transform: scale(1.05); opacity: 0.5; }
          70%  { transform: scale(1); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        @keyframes arrow-nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>

      <div
        className="mt-10 flex w-full justify-center"
        style={{
          position: "relative",
          width: size + 60,
          height: size + 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!pressing &&
          heartbeatRingStyles.map((ring) => (
            <div
              key={ring.delay}
              style={{
                position: "absolute",
                width: size * 1.04,
                height: size * 1.04,
                borderRadius: "50%",
                border: ring.border,
                animation: `heartbeat-ring 2s ease-out infinite ${ring.delay}`,
                pointerEvents: "none",
              }}
            />
          ))}

        <button
          onPointerDown={handlePointerDown}
          onPointerUp={() => setPressing(false)}
          onPointerLeave={() => setPressing(false)}
          style={{
            position: "relative",
            width: size,
            height: size,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            overflow: "hidden",
            outline: "none",
            zIndex: 2,
            fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
            background: pressing
              ? `radial-gradient(circle at 50% 55%,
                  #ffdd44 0%,
                  #f5a800 40%,
                  #c06000 75%,
                  #7a3500 100%)`
              : `radial-gradient(circle at 45% 38%,
                  #fffde0 0%,
                  #ffe84d 18%,
                  #ffc200 38%,
                  #f59000 58%,
                  #c86000 76%,
                  #7a3500 100%)`,
            boxShadow: pressing
              ? `0 2px 8px rgba(0,0,0,0.8),
                 inset 0 6px 18px rgba(0,0,0,0.4),
                 inset 0 -2px 8px rgba(255,200,60,0.2)`
              : `0 0 0 3px rgba(255,180,20,0.6),
                 0 0 0 6px rgba(255,120,0,0.25),
                 0 8px 0 rgba(100,40,0,0.9),
                 0 12px 24px rgba(0,0,0,0.8),
                 inset 0 3px 12px rgba(255,255,200,0.55),
                 inset 0 -5px 14px rgba(100,40,0,0.6)`,
            transform: pressing ? "scale(0.95) translateY(6px)" : "scale(1) translateY(0px)",
            transition:
              "transform 0.13s cubic-bezier(.22,.68,0,1.2), box-shadow 0.13s ease, background 0.1s ease",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-5%",
              left: "8%",
              width: "65%",
              height: "55%",
              background:
                "radial-gradient(ellipse at 38% 32%, rgba(255,255,255,0.7) 0%, rgba(255,255,220,0.35) 40%, transparent 70%)",
              borderRadius: "50%",
              transform: "rotate(-20deg)",
              pointerEvents: "none",
              opacity: pressing ? 0.1 : 1,
              transition: "opacity 0.13s ease",
            }}
          />

          <span
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
              width: "25%",
              height: "16%",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, transparent 80%)",
              borderRadius: "50%",
              transform: "rotate(-30deg)",
              filter: "blur(1.5px)",
              pointerEvents: "none",
              opacity: pressing ? 0 : 0.9,
              transition: "opacity 0.13s ease",
            }}
          />

          <span
            style={{
              position: "absolute",
              bottom: "3%",
              left: "18%",
              width: "64%",
              height: "20%",
              background:
                "radial-gradient(ellipse, rgba(255,180,40,0.45) 0%, transparent 80%)",
              borderRadius: "50%",
              pointerEvents: "none",
              opacity: pressing ? 0.1 : 1,
              transition: "opacity 0.13s ease",
            }}
          />

          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: pressing
                ? "radial-gradient(circle at 50% 28%, rgba(0,0,0,0.38) 0%, transparent 65%)"
                : "none",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: size * 0.01,
              transform: pressing ? "translateY(3px)" : "translateY(0)",
              transition: "transform 0.13s ease",
            }}
          >
            <span
              style={{
                fontSize: size * 0.22,
                fontWeight: 900,
                color: "#1a0900",
                letterSpacing: "0.01em",
                lineHeight: 1,
                userSelect: "none",
                textShadow: "0 1px 0 rgba(255,240,100,0.6), 0 -1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {label}
            </span>

            <span
              style={{
                fontSize: size * 0.155,
                fontWeight: 700,
                color: "rgba(20,8,0,0.8)",
                letterSpacing: "0.01em",
                lineHeight: 1,
                userSelect: "none",
                textShadow: "0 1px 0 rgba(255,240,100,0.5)",
              }}
            >
              {sublabel}
            </span>

            <div
              style={{
                marginTop: size * 0.025,
                animation: pressing ? "none" : "arrow-nudge 1.8s ease-in-out infinite",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size * 0.18}
                height={size * 0.18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(20,8,0,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 1px 0 rgba(255,240,100,0.5))" }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
