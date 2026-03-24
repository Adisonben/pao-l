"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STATE_MESSAGES = {
  connecting: "กำลังเชื่อมต่ออุปกรณ์...",
  warming_up: "กำลังอุ่นเครื่องเซ็นเซอร์...",
  ready: "พร้อมเริ่มการทดสอบ",
  sampling: "กำลังตรวจวัดระดับแอลกอฮอล์...",
  breath_detected: "ตรวจพบท่อลม กำลังวัดผล...",
  flow_error: "การเป่าผิดพลาด กรุณาลองอีกครั้ง",
  timeout: "หมดเวลาการเป่า",
  error: "การเชื่อมต่อผิดพลาด",
};

const PASS_RESULT = { value: 0.018, status: "OK", success: true };
const FAIL_RESULT = { value: 0.085, status: "NG", success: false };

function messageForState(state) {
  return STATE_MESSAGES[state] ?? null;
}

export function useMockKiosk(mode = "dev") {
  const [wsConnected, setWsConnected] = useState(true);
  const [sensorState, setSensorState] = useState("ready");
  const [sensorMessage, setSensorMessage] = useState(messageForState("ready"));
  const [testResult, setTestResult] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const emitState = useCallback((state, message) => {
    const event = { type: "alcohol_state", state, message };
    setSensorState(state);
    setSensorMessage(message ?? messageForState(state));
    setLastEvent(event);
    if (state === "connecting" || state === "warming_up") {
      setTestResult(null);
    }
  }, []);

  const emitResult = useCallback((payload) => {
    if (!payload) {
      setTestResult(null);
      setLastEvent({ type: "alcohol_result_cleared" });
      return;
    }

    const finalResult = {
      value: payload.value ?? (payload.success ? PASS_RESULT.value : FAIL_RESULT.value),
      status: payload.status ?? (payload.success ? "OK" : "NG"),
      success: payload.success ?? true,
    };

    const event = { type: "alcohol_result", ...finalResult };
    setTestResult(finalResult);
    setLastEvent(event);
  }, []);

  const resetState = useCallback(() => {
    clearTimers();
    setTestResult(null);
    emitState("ready");
    setLastEvent({ type: "mock_reset" });
  }, [clearTimers, emitState]);

  const startTimeline = useCallback(() => {
    clearTimers();
    setTestResult(null);

    emitState("connecting");

    const schedule = (delay, fn) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
    };

    schedule(900, () => emitState("warming_up"));
    schedule(2200, () => emitState("ready"));
    schedule(3300, () => emitState("sampling"));
    schedule(4300, () => emitState("breath_detected"));
    schedule(5600, () => emitResult({ ...PASS_RESULT }));
  }, [clearTimers, emitState, emitResult]);

  const setConnected = useCallback((connected) => {
    setWsConnected(Boolean(connected));
    setLastEvent({ type: "mock_connection", connected: Boolean(connected) });
  }, []);

  const clearResult = useCallback(() => {
    emitResult(null);
  }, [emitResult]);

  useEffect(() => {
    emitState("ready");
    return () => {
      clearTimers();
    };
  }, [emitState, clearTimers]);

  const sendCommand = useCallback(
    (cmd) => {
      const normalized = String(cmd ?? "").trim().toUpperCase();
      if (!normalized) return;

      if (normalized === "START_TEST") {
        if (mode === "dev") {
          startTimeline();
        } else {
          emitState("ready");
        }
      }

      if (normalized === "RESET") {
        resetState();
      }
    },
    [mode, startTimeline, emitState, resetState]
  );

  const mockControls = useMemo(() => {
    if (mode === "interface") {
      return {
        setConnected,
        setSensorState: (state, message) => emitState(state, message),
        triggerPass: (value = PASS_RESULT.value) =>
          emitResult({ value, status: "OK", success: true }),
        triggerFail: (value = FAIL_RESULT.value) =>
          emitResult({ value, status: "NG", success: false }),
        clearResult,
        reset: resetState,
      };
    }

    if (mode === "dev") {
      return {
        replayDemo: startTimeline,
        reset: resetState,
        setSensorState: (state, message) => emitState(state, message),
        clearResult,
        triggerPass: (value = PASS_RESULT.value) =>
          emitResult({ value, status: "OK", success: true }),
        triggerFail: (value = FAIL_RESULT.value) =>
          emitResult({ value, status: "NG", success: false }),
      };
    }

    return null;
  }, [mode, setConnected, emitState, emitResult, clearResult, resetState, startTimeline]);

  return {
    wsConnected,
    sensorState,
    sensorMessage,
    testResult,
    lastEvent,
    sendCommand,
    mockControls,
  };
}
