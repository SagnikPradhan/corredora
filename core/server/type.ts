import { CallSite } from "./utils/callstack";

export type DataTypes =
  | undefined
  | null
  | number
  | string
  | boolean
  | DataTypes[]
  | RecursiveObject<DataTypes>;

export interface RecursiveObject<Value> {
  [index: string]: Value | RecursiveObject<Value>;
}

export interface ServerLogMessage {
  id: string;
  type: "LOG" | "DEBUG";
  data: DataTypes;
  date: string;
  callsites: CallSite[];
}

export interface ServerErrorMessage {
  id: string;
  type: "ERROR";
  data: ErrorDetails;
  date: string;
  callsites: CallSite[];
}

export interface ErrorDetails {
  name: string;
  message: string;
  props: RecursiveObject<DataTypes>;
}

export type ServerMessage = ServerErrorMessage | ServerLogMessage;
