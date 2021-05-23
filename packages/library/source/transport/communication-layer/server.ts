import WebSocket from "isomorphic-ws";

import { PushLogsFn, CommunicationLayerFactory } from "..";

import {
  SERVER_PORT,
  Log,
  ServerPayload,
  ClientPayload,
} from "../../utils/type";

import { handleError } from "../../utils/error";

export const createServer: CommunicationLayerFactory = ({
  onReady,
  onClose,
}) => {
  const logs = [] as Log[];

  const server = new WebSocket.Server({ port: SERVER_PORT });
  const subscribers = new Set<WebSocket>();

  const push: PushLogsFn = (newLogs) => {
    logs.push(...newLogs);

    const payload: ServerPayload = { type: "log", logs: newLogs };
    subscribers.forEach((socket) =>
      socket.send(JSON.stringify(payload), handleError)
    );
  };

  server.on("listening", () => onReady());
  server.on("close", () => onClose());

  server.on("connection", (socket) => {
    socket.on(
      "message",
      createMessageListener({ socket, subscribers, push, logs })
    );
  });

  return { push };
};

function createMessageListener({
  socket,
  subscribers,
  push,
  logs,
}: {
  socket: WebSocket;
  subscribers: Set<WebSocket>;
  push: (logs: Log[]) => void;
  logs: Log[];
}) {
  return (data: WebSocket.Data) => {
    const payload = JSON.parse(data.toString()) as ClientPayload;

    if (payload.type === "subscribe") {
      subscribers.add(socket);
      socket.on("close", () => subscribers.delete(socket));

      const payload: ServerPayload = { type: "log", logs };
      socket.emit(JSON.stringify(payload), handleError);
      return;
    }

    if (payload.type === "log") {
      push(payload.logs);
      return;
    }
  };
}
