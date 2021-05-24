import { useEffect, useState } from "react";

import { useServerStatus } from "./server-status";
import { useWebsocket } from "./websocket";

import {
  ClientPayload,
  Log,
  ServerPayload,
  SERVER_PORT,
} from "corredora/dist/internal";

export function useConnector() {
  const [logs, setLogs] = useState<Log[]>([]);
  const { status, ...statusCheck } = useServerStatus();

  const { connect } = useWebsocket(`ws://localhost:${SERVER_PORT}`, {
    open: (send) => {
      statusCheck.pause();

      setLogs(() => []);

      const payload: ClientPayload = { type: "subscribe" };
      send(JSON.stringify(payload));
    },

    close: () => {
      statusCheck.start();
    },

    message: (data) => {
      const payload: ServerPayload = JSON.parse(data);
      setLogs((logs) => [...payload.logs, ...logs]);
    },
  });

  useEffect(() => {
    if (status === 1) connect();
  }, [status]);

  return { logs };
}
