import { useEffect, useState } from "react";
import type { Payload } from "corredora";

export function useLogs() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<Payload[]>([]);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:5000");

    websocket.addEventListener("open", () => setConnected(true));

    websocket.addEventListener("message", ({ data: message }) => {
      const log = JSON.parse(message) as Payload;
      setLogs((logs) => [...logs, log]);
    });
  }, []);

  return { logs, connected };
}
