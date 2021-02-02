import React, { ReactNode } from "react";
import { useLogs } from "./hook";
import { Data } from "../data";
import { ErrorData, Log } from "corredora";
import { Error as ErrorC } from "../error";

export function Logs() {
  const { logs } = useLogs();

  return (
    <table id="logs" className="flex-grow text-sm font-monospace">
      <tbody>
        {logs.map((log, index) => (
          <Log type={log.type} key={index}>
            <td>
              {new Date(log.date).toLocaleTimeString(undefined, {
                hour12: false,
              })}
            </td>

            <td>{log.callstack[0].fileName}</td>

            <td className="flex-grow">
              {log.type === "ERROR" ? (
                <ErrorC stack={log.callstack} error={log.data as ErrorData} />
              ) : (
                <Data>{log.data}</Data>
              )}
            </td>
          </Log>
        ))}
      </tbody>
    </table>
  );
}

function Log({ children, type }: { type: Log; children: ReactNode }) {
  return (
    <tr
      className={`flex flex-row gap-2 px-2 ${
        type === "ERROR"
          ? "bg-red-light"
          : type === "DEBUG"
          ? "bg-orange-light"
          : "bg-green-light"
      }`}
    >
      {children}
    </tr>
  );
}
