"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import BlowPanel from "../components/BlowPanel";
import { useKioskContext } from "@/context/KioskContext";

const MAX_ERROR_RETRY = 5;

export default function BlowPage() {
  const router = useRouter();
  const { sensorState, testResult, sendCommand } = useKioskContext();
  const navigatedRef = useRef(false);
  const retryIntervalRef = useRef(null);
  const errorActiveRef = useRef(false);
  const resetTriggeredRef = useRef(false);
  const attemptCountRef = useRef(0);
  const [errorAttempt, setErrorAttempt] = useState(null);

  const stopErrorTimers = () => {
    if (retryIntervalRef.current) { clearInterval(retryIntervalRef.current); retryIntervalRef.current = null; }
    setErrorAttempt(null);
    errorActiveRef.current = false;
  };

  const triggerReset = () => {
    if (resetTriggeredRef.current) return;
    resetTriggeredRef.current = true;
    stopErrorTimers();
    sendCommand("RESET");
    router.replace("/");
  };

  const startErrorRecovery = () => {
    errorActiveRef.current = true;
    resetTriggeredRef.current = false;
    attemptCountRef.current = 1;
    setErrorAttempt(1);
    sendCommand("START_TEST");

    retryIntervalRef.current = setInterval(() => {
      attemptCountRef.current += 1;
      if (attemptCountRef.current > MAX_ERROR_RETRY) {
        triggerReset();
        return;
      }
      setErrorAttempt(attemptCountRef.current);
      sendCommand("START_TEST");
    }, 2000);
  };

  useEffect(() => {
    if (testResult && testResult.success && !navigatedRef.current) {
      navigatedRef.current = true;
      router.push("/analyze");
    }
  }, [testResult, router]);

  useEffect(() => {
    if (sensorState === "error" || sensorState === "timeout") {
      if (!errorActiveRef.current) {
        startErrorRecovery();
      }
      return;
    }

    const RECOVERY_SUCCESS_STATES = new Set(["ready", "breath_detected", "sampling", "analyzing", "flow_error"]);
    if (errorActiveRef.current && RECOVERY_SUCCESS_STATES.has(sensorState)) {
      stopErrorTimers();
      resetTriggeredRef.current = false;
      attemptCountRef.current = 0;
    }
  }, [sensorState]);

  useEffect(() => {
    return () => {
      stopErrorTimers();
      resetTriggeredRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <BlowPanel sensorState={sensorState} errorAttempt={errorAttempt} maxRetry={MAX_ERROR_RETRY} />
      </div>
    </main>
  );
}
