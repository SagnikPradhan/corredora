export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export interface RecursiveObject<T = unknown> {
  [key: string]: T | RecursiveObject<T>;
}

export type JSONPrimitives = null | undefined | number | boolean | string;
export type JSONValues =
  | JSONPrimitives
  | JSONPrimitives[]
  | RecursiveObject<JSONPrimitives | JSONPrimitives[]>;

export interface CallSite {
  file: string;
  fileShort: string;
  line?: number;
  column?: number;
  callee: string;
  native: boolean;
  thirdParty: boolean;
  internal: boolean;
}

export interface Log {
  id: string;
  name: string;
  level: LogLevel;

  data: JSONValues;

  timestamp: Date;

  callstack: CallSite[];
}

export type ClientPayload =
  | { type: "log"; logs: Log[] }
  | { type: "subscribe" };

export type ServerPayload = { type: "log"; logs: Log[] };

export const SERVER_PORT = 5050;
