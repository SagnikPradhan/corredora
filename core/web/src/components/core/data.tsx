import React from "react";
import { Data } from "corredora";

export function Data({ children: data }: { children: Data }) {
  if (typeof data !== "object" || data === null) return <p>{String(data)}</p>;
  else
    return (
      <details className="">
        <summary>
          {(Array.isArray(data) ? "Array " : "Object ") +
            Object.keys(data).length}
        </summary>

        <table>
          <tbody>
            {Object.entries(data).map(([key, value]) => {
              return (
                <tr className="">
                  <td className="flex flex-col items-end px-1">{key}</td>
                  <td className="px-1">{<Data>{value}</Data>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    );
}
