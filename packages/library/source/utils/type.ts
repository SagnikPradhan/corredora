export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export interface Log {
  timestamp: Date;
  level: LogLevel;
  data: unknown;
}

export type ClientPayload =
  | { type: "log"; logs: Log[] }
  | { type: "subscribe" };

export type ServerPayload = { type: "log"; logs: Log[] };

export const SERVER_PORT = 5050;
