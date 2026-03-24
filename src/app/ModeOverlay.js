"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useKioskContext } from "@/context/KioskContext";
import { PHASES, sensorStateToPhase } from "@/app/components/BlowPanel";

const PHASE_TARGETS = [
  { key: "preparing", state: "connecting" },
  { key: "ready", state: "ready" },
  { key: "blowing", state: "sampling" },
  { key: "flow_error", state: "flow_error" },
  { key: "error", state: "error" },
];

const STEPS = [
  { path: "/", label: "Home" },
  { path: "/blow", label: "Blow" },
  { path: "/analyze", label: "Analyze" },
  { path: "/result", label: "Result" },
];

const MODE_LABEL = {
  dev: "Development",
  interface: "Interface",
  prod: "Production",
};

const badgeBase =
  "pointer-events-auto rounded-lg bg-zinc-900/85 px-4 py-3 text-xs text-white shadow-lg shadow-black/40 backdrop-blur";
const buttonBase =
  "rounded-md bg-white/12 px-2 py-1 text-xs font-medium uppercase tracking-wide text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40";

export default function ModeOverlay() {
  const { mode, mockControls, sensorState } = useKioskContext();
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = useMemo(
    () => STEPS.findIndex((step) => step.path === pathname),
    [pathname]
  );

  const phaseKey = useMemo(() => sensorStateToPhase(sensorState), [sensorState]);
  const phaseInfo = PHASES[phaseKey];

  if (!mode || mode === "prod") {
    return null;
  }

  const goToStep = (index) => {
    if (index < 0 || index >= STEPS.length) return;
    router.push(STEPS[index].path);
  };

  const goOffset = (offset) => {
    if (currentIndex === -1) return;
    goToStep(currentIndex + offset);
  };

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-50 flex flex-col gap-3">
      <div className={badgeBase}>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Mode
          </span>
          <span className="text-sm font-semibold text-amber-300">
            {MODE_LABEL[mode] ?? mode}
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-300">
          UI is running in {MODE_LABEL[mode]?.toLowerCase() ?? mode} mode. Backend
          connections are disabled.
        </p>
      </div>

      {/* {phaseInfo ? (
        <div className={badgeBase}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Current phase
            </span>
            <span className="text-[11px] text-zinc-400">
              {sensorState ?? "unknown"}
            </span>
          </div>
          <p className={`mt-2 text-sm font-semibold ${phaseInfo.color}`}>
            {phaseInfo.label}
          </p>
        </div>
      ) : null} */}

      {mockControls?.setSensorState ? (
        <div className={badgeBase}>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Set phase
          </span>
          <div className="flex flex-wrap gap-2">
            {PHASE_TARGETS.map(({ key, state }) => {
              const info = PHASES[key];
              const active = phaseKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`${buttonBase} ${active ? "border border-amber-300/60 bg-white/25 text-amber-100" : ""}`}
                  onClick={() => mockControls.setSensorState?.(state)}
                >
                  {info?.label ?? key}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {mode === "dev" && mockControls ? (
        <div className={badgeBase}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonBase}
              onClick={() => mockControls.replayDemo?.()}
            >
              Replay Demo
            </button>
            <button
              type="button"
              className={buttonBase}
              onClick={() => mockControls.reset?.()}
            >
              Reset State
            </button>
          </div>
        </div>
      ) : null}

      {mode === "interface" ? (
        <div className={badgeBase}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Step Navigation
            </span>
            <span className="text-[11px] text-zinc-200">
              {currentIndex !== -1 ? STEPS[currentIndex].label : "Custom"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className={buttonBase}
              onClick={() => goOffset(-1)}
              disabled={currentIndex <= 0}
            >
              Previous
            </button>
            <button
              type="button"
              className={buttonBase}
              onClick={() => goOffset(1)}
              disabled={currentIndex === -1 || currentIndex >= STEPS.length - 1}
            >
              Next
            </button>
          </div>

          {mockControls ? (
            <div className="mt-3 border-t border-white/10 pt-3">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                Mock Data
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={buttonBase}
                  onClick={() => mockControls.triggerPass?.()}
                >
                  Show Pass
                </button>
                <button
                  type="button"
                  className={buttonBase}
                  onClick={() => mockControls.triggerFail?.()}
                >
                  Show Fail
                </button>
                <button
                  type="button"
                  className={buttonBase}
                  onClick={() => mockControls.clearResult?.()}
                >
                  Clear Result
                </button>
                <button
                  type="button"
                  className={buttonBase}
                  onClick={() => mockControls.reset?.()}
                >
                  Reset State
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
