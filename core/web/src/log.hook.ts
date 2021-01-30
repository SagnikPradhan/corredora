import { useEffect, useState } from "react";
import type { ServerMessage } from "corredora";

export function useLogs() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<ServerMessage[]>([]);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:5000");

    websocket.addEventListener("open", () => setConnected(true));

    websocket.addEventListener("message", ({ data: message }) => {
      const log = JSON.parse(message) as ServerMessage;
      setLogs((logs) => [...logs, log]);
    });
  }, []);

  return { logs, connected };
}
