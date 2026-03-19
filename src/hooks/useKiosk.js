"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

const RECONNECT_DELAY_MS = 3000;

/**
 * useKiosk — WebSocket connection to the Pao-L backend.
 *
 * Returns:
 *   kioskState   — current kiosk state machine state (e.g. "IDLE", "READY_TO_BLOW")
 *   kioskUpdate  — latest sensor-level update (e.g. "WARMING_UP", "READY_TO_BLOW")
 *   testResult   — { value, status, success } from the last test_result event
 *   deviceStatus — { alcohol, fingerprint, printer, camera } status strings
 *   sessionId    — active session ID or null
 *   wsConnected  — whether the WebSocket is currently open
 *   sendCommand  — fn(cmd: string) sends {"command": cmd} to the backend
 *   lastEvent    — the raw last event object received
 */
export function useKiosk() {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const mountedRef = useRef(true);

  const [wsConnected, setWsConnected] = useState(false);
  const [kioskState, setKioskState] = useState("IDLE");
  const [kioskUpdate, setKioskUpdate] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setWsConnected(true);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    ws.onmessage = (evt) => {
      if (!mountedRef.current) return;
      let data;
      try {
        data = JSON.parse(evt.data);
      } catch {
        return;
      }

      setLastEvent(data);

      const { type } = data;

      if (type === "ping") {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ command: "pong" }));
        }
        return;
      }

      if (type === "kiosk_state") {
        setKioskState(data.state);
        if (data.session_id) setSessionId(data.session_id);
        return;
      }

      if (type === "kiosk_update") {
        setKioskUpdate(data.state);
        if (data.session_id) setSessionId(data.session_id);
        return;
      }

      if (type === "test_result") {
        setTestResult({
          value: data.value,
          status: data.status,
          success: data.success,
          session_id: data.session_id,
        });
        return;
      }

      if (type === "device_status") {
        setDeviceStatus((prev) => ({
          ...prev,
          [data.device]: data.status,
        }));
        return;
      }

      if (type === "session_started") {
        setSessionId(data.session_id);
        setTestResult(null);
        setKioskUpdate(null);
        return;
      }

      if (type === "session_ended") {
        return;
      }
    };

    ws.onerror = () => {
      // onclose will handle reconnect
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setWsConnected(false);
      wsRef.current = null;
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendCommand = useCallback((cmd) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command: cmd }));
    } else {
      console.warn("useKiosk: WebSocket not connected, cannot send", cmd);
    }
  }, []);

  return {
    wsConnected,
    kioskState,
    kioskUpdate,
    testResult,
    deviceStatus,
    sessionId,
    lastEvent,
    sendCommand,
  };
}
