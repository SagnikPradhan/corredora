import { JSONValues } from "./json";

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

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
