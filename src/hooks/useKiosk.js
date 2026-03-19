"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

const RECONNECT_DELAY_MS = 3000;

/**
 * useKiosk — WebSocket connection to the Pao-L backend (slim).
 *
 * Returns:
 *   wsConnected   — whether the WebSocket is currently open
 *   sensorState   — latest alcohol sensor state (e.g. "connecting", "warming_up", "ready", "error")
 *   sensorMessage — Thai/English status message from the sensor
 *   testResult    — { value, status, success } from the alcohol_result event
 *   lastEvent     — the raw last event object received
 *   sendCommand   — fn(cmd: string) sends {"command": cmd} to the backend
 */
export function useKiosk() {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const mountedRef = useRef(true);

  const [wsConnected, setWsConnected] = useState(false);
  const [sensorState, setSensorState] = useState(null);
  const [sensorMessage, setSensorMessage] = useState(null);
  const [testResult, setTestResult] = useState(null);
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
        console.log("[WS] Received:", data);
      } catch {
        console.error("[WS] Failed to parse:", evt.data);
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

      if (type === "ready") {
        console.log("[WS] Backend ready");
        return;
      }

      if (type === "alcohol_state") {
        setSensorState(data.state);
        if (data.message) setSensorMessage(data.message);
        console.log("[WS] Sensor state:", data.state);
        return;
      }

      if (type === "alcohol_result") {
        setTestResult({
          value: data.value,
          status: data.status,
          success: data.success,
        });
        console.log("[WS] Test result:", data);
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
    sensorState,
    sensorMessage,
    testResult,
    lastEvent,
    sendCommand,
  };
}
