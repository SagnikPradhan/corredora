import React from "react";
import { useLogs } from "./log.hook";
import type { ServerMessage, Loggable as LoggableData } from "corredora";

export function Logs() {
  const { logs } = useLogs();

  return (
    <ol id="logs" className="flex-grow">
      {logs.map((log) => (
        <li></li>
      ))}
    </ol>
  );
}
