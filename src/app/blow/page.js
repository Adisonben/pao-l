"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdPanel from "../components/AdPanel";
import BlowPanel from "../components/BlowPanel";
import { useKioskContext } from "@/context/KioskContext";

export default function BlowPage() {
  const router = useRouter();
  const { sensorState, testResult, sendCommand } = useKioskContext();
  const navigatedRef = useRef(false);
  const errorTimeoutRef = useRef(null);
  const retryIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [errorCountdown, setErrorCountdown] = useState(null);

  const stopErrorTimers = () => {
    if (errorTimeoutRef.current) { clearTimeout(errorTimeoutRef.current); errorTimeoutRef.current = null; }
    if (retryIntervalRef.current) { clearInterval(retryIntervalRef.current); retryIntervalRef.current = null; }
    if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
    setErrorCountdown(null);
  };

  useEffect(() => {
    if (testResult && testResult.success && !navigatedRef.current) {
      navigatedRef.current = true;
      router.push("/analyze");
    }
  }, [testResult, router]);

  useEffect(() => {
    if (sensorState === "error") {
      if (errorTimeoutRef.current) return; // already counting

      setErrorCountdown(10);
      sendCommand("START_TEST");

      countdownIntervalRef.current = setInterval(() => {
        setErrorCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }, 1000);

      retryIntervalRef.current = setInterval(() => {
        sendCommand("START_TEST");
      }, 2000);

      errorTimeoutRef.current = setTimeout(() => {
        stopErrorTimers();
        sendCommand("RESET");
        router.replace("/");
      }, 10000);
    } else {
      stopErrorTimers();
    }
  }, [sensorState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => stopErrorTimers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-[70%]">
        <AdPanel />
      </div>
      <div className="w-[30%]">
        <BlowPanel sensorState={sensorState} errorCountdown={errorCountdown} />
      </div>
    </main>
  );
}
