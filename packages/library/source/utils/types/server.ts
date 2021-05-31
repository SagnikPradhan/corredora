import { Log } from "./log";

export type ClientPayload =
  | { type: "log"; logs: Log[] }
  | { type: "subscribe" };

export type ServerPayload = { type: "log"; logs: Log[] };

export const SERVER_PORT = 5050;
