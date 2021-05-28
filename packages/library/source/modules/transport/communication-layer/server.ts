import http from "http";
import WebSocket from "isomorphic-ws";

import { CommunicationLayerFactory, CommunicationLayer } from "..";

import {
  SERVER_PORT,
  Log,
  ServerPayload,
  ClientPayload,
} from "../../../utils/type";

import { handleError } from "../../../utils/error";

export const create: CommunicationLayerFactory = ({ onReady, onClose }) => {
  const logs = [] as Log[];

  const httpServer = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.url === "/" && req.method === "GET") res.statusCode = 200;
    else res.statusCode = 400;

    return res.end();
  });

  const server = new WebSocket.Server({ server: httpServer });
  const subscribers = new Set<WebSocket>();

  const push: CommunicationLayer["push"] = (newLogs) => {
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

  httpServer.listen(SERVER_PORT);

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
      socket.send(JSON.stringify(payload), handleError);
      return;
    }

    if (payload.type === "log") {
      push(payload.logs);
      return;
    }
  };
}
