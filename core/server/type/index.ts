import { CallSite } from "../module/callstack/callsite";
import { RecursiveObject } from "./util";

export type Data =
  | undefined
  | null
  | number
  | string
  | boolean
  | Data[]
  | RecursiveObject<Data>;

export type Log = "INFO" | "DEBUG" | "ERROR";

export interface Payload {
  id: string;
  type: Log;
  data: Data;
  callstack: CallSite[];
  date: Date;
}

export interface ErrorData
  extends RecursiveObject<string | RecursiveObject<Data>> {
  name: string;
  message: string;
  props: RecursiveObject<Data>;
}
