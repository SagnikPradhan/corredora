import React from "react";
import { ErrorData, Payload } from "corredora";
import { Data } from "./data";

export function Error({
  error,
  stack,
}: {
  error: ErrorData;
  stack: Payload["callstack"];
}) {
  return (
    <div className="error">
      <h3>
        {error.name || "Error"} - {error.message}
      </h3>

      {Object.keys(error.props).length > 0 && (
        <>
          <br />

          <h4>Properties</h4>
          <Data>{error.props}</Data>
        </>
      )}

      <br />
      <ul>
        {stack.map(({ fileName, functionName, column, line }) => (
          <li>
            {functionName} in {fileName} L{line}C{column}
          </li>
        ))}
      </ul>
    </div>
  );
}
